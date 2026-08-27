"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { deskCookieName } from "@/lib/brand"
import { getDeskPin } from "@/lib/auth"
import { parseMoney } from "@/lib/format"
import { inputToLead, ingestPublicLead, makeActivity } from "@/lib/leads"
import { resetStore, updateStore } from "@/lib/store"
import type {
  DocStatus,
  LeadSource,
  LeadType,
  PublicLeadInput,
  Stage,
} from "@/lib/types"

function str(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim()
}

function asEnum<T extends string>(value: string, allowed: readonly T[], fallback: T): T {
  return (allowed as readonly string[]).includes(value) ? (value as T) : fallback
}

function fromForm(form: FormData, type: LeadType, source: LeadSource): PublicLeadInput {
  return {
    type,
    source,
    name: str(form, "name"),
    email: str(form, "email"),
    phone: str(form, "phone"),
    areaSlug: str(form, "areaSlug") || "island",
    address: str(form, "address"),
    city: str(form, "city"),
    timeline: asEnum(str(form, "timeline"), ["asap", "30_days", "90_days", "6_months", "browsing"] as const, "90_days"),
    motivation: str(form, "motivation"),
    occupancy: asEnum(str(form, "occupancy"), ["owner", "tenant", "vacant", "unknown"] as const, "unknown"),
    water: asEnum(str(form, "water"), ["county", "catchment", "private_well", "unknown"] as const, "unknown"),
    wastewater: asEnum(str(form, "wastewater"), ["sewer", "septic", "cesspool", "unknown"] as const, "unknown"),
    financing: asEnum(str(form, "financing"), ["cash", "pre_approved", "pre_qualified", "not_yet"] as const, "not_yet"),
    propertyUse: asEnum(str(form, "propertyUse"), ["primary", "second_home", "investment", "land", "unknown"] as const, "unknown"),
    beds: str(form, "beds"),
    baths: str(form, "baths"),
    sqft: str(form, "sqft"),
    budgetMin: parseMoney(form.get("budgetMin")),
    budgetMax: parseMoney(form.get("budgetMax")),
    estimatedValue: parseMoney(form.get("estimatedValue")),
    relocatingFrom: str(form, "relocatingFrom"),
    yearBuilt: str(form, "yearBuilt"),
    lavaZone: str(form, "lavaZone"),
    hoa: str(form, "hoa") === "on" || str(form, "hoa") === "true",
    notes: str(form, "notes"),
  }
}

export async function submitPublicLead(formData: FormData) {
  const type = str(formData, "type") === "buyer" ? "buyer" : "seller"
  const source = asEnum(
    str(formData, "source"),
    ["valuation", "buyer_match", "area_page", "manual"] as const,
    type === "buyer" ? "buyer_match" : "valuation"
  )
  const input = fromForm(formData, type, source)
  if (!input.name || (!input.email && !input.phone)) {
    redirect(`/thanks?error=1`)
  }
  const created = await ingestPublicLead(input)
  revalidatePath("/desk")
  redirect(`/thanks?type=${type}&band=${created.band}`)
}

export async function createManualLead(formData: FormData) {
  const type = str(formData, "type") === "buyer" ? "buyer" : "seller"
  const source = asEnum(
    str(formData, "source"),
    ["manual", "fsbo", "expired", "sphere", "referral"] as const,
    "manual"
  )
  const input = fromForm(formData, type, source)
  if (!input.name) {
    redirect("/desk/leads/new?error=1")
  }
  const lead = inputToLead(input)
  await updateStore((store) => {
    store.leads.unshift(lead)
    store.activities.unshift(makeActivity(lead.id, "system", "Lead added from the desk."))
    return store
  })
  revalidatePath("/desk")
  redirect(`/desk/leads/${lead.id}`)
}

export async function updateLeadFields(formData: FormData) {
  const leadId = str(formData, "id")
  await updateStore((store) => {
    const lead = store.leads.find((l) => l.id === leadId)
    if (!lead) return store
    const input = fromForm(formData, lead.type, lead.source)
    const next = inputToLead(
      { ...input, type: lead.type, source: lead.source, name: input.name || lead.name },
      lead
    )
    next.listPrice = parseMoney(formData.get("listPrice")) ?? lead.listPrice
    next.contractPrice = parseMoney(formData.get("contractPrice")) ?? lead.contractPrice
    const rate = Number(str(formData, "commissionRate"))
    if (rate > 0 && rate < 0.2) next.commissionRate = rate
    next.nextAction = str(formData, "nextAction") || next.nextAction
    const due = str(formData, "nextActionAt")
    if (due) next.nextActionAt = new Date(due).toISOString()
    Object.assign(lead, next)
    store.activities.unshift(makeActivity(leadId, "note", "File details updated."))
    return store
  })
  revalidatePath("/desk")
  redirect(`/desk/leads/${leadId}`)
}

export async function setStage(formData: FormData) {
  const leadId = str(formData, "id")
  const stage = str(formData, "stage") as Stage
  await updateStore((store) => {
    const lead = store.leads.find((l) => l.id === leadId)
    if (!lead) return store
    const prev = lead.stage
    lead.stage = stage
    lead.updatedAt = new Date().toISOString()
    lead.lastTouchedAt = lead.updatedAt
    if (stage === "closed") lead.closedAt = lead.updatedAt
    if (stage === "lost") lead.nextActionAt = null
    store.activities.unshift(
      makeActivity(leadId, "stage_change", `Moved from ${prev} to ${stage}.`)
    )
    return store
  })
  revalidatePath("/desk")
}

export async function addNote(formData: FormData) {
  const leadId = str(formData, "id")
  const body = str(formData, "body")
  const type = asEnum(str(formData, "activityType"), ["note", "call", "email", "sms"] as const, "note")
  if (!body) redirect(`/desk/leads/${leadId}`)
  await updateStore((store) => {
    const lead = store.leads.find((l) => l.id === leadId)
    if (!lead) return store
    lead.lastTouchedAt = new Date().toISOString()
    lead.updatedAt = lead.lastTouchedAt
    if (type === "call" && lead.stage === "new") lead.stage = "contacted"
    store.activities.unshift(makeActivity(leadId, type, body))
    return store
  })
  revalidatePath("/desk")
  redirect(`/desk/leads/${leadId}`)
}

export async function setDocStatus(formData: FormData) {
  const leadId = str(formData, "leadId")
  const docId = str(formData, "docId")
  const status = str(formData, "status") as DocStatus
  await updateStore((store) => {
    const lead = store.leads.find((l) => l.id === leadId)
    if (!lead) return store
    const doc = lead.documents.find((d) => d.id === docId)
    if (!doc) return store
    doc.status = status
    lead.updatedAt = new Date().toISOString()
    store.activities.unshift(
      makeActivity(leadId, "document", `${doc.name} → ${status}.`)
    )
    return store
  })
  revalidatePath("/desk")
}

export async function saveSettings(formData: FormData) {
  await updateStore((store) => {
    store.settings.agentName = str(formData, "agentName") || store.settings.agentName
    store.settings.brokerage = str(formData, "brokerage")
    store.settings.license = str(formData, "license")
    store.settings.phone = str(formData, "phone")
    store.settings.email = str(formData, "email")
    const rate = Number(str(formData, "defaultCommissionRate"))
    if (rate > 0 && rate < 0.2) store.settings.defaultCommissionRate = rate
    store.settings.cursorPlan = str(formData, "cursorPlan") === "ultra" ? "ultra" : "pro"
    return store
  })
  revalidatePath("/desk")
  redirect("/desk/settings")
}

export async function restoreSamples() {
  await resetStore()
  revalidatePath("/desk")
  redirect("/desk")
}

export async function loginDesk(formData: FormData) {
  const pin = str(formData, "pin")
  const expected = getDeskPin()
  if (!expected || pin !== expected) {
    redirect("/desk/login?error=1")
  }
  const jar = await cookies()
  jar.set(deskCookieName, "ok", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
  })
  redirect("/desk")
}

export async function logoutDesk() {
  const jar = await cookies()
  jar.delete(deskCookieName)
  redirect("/desk/login")
}
