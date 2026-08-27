import { defaultSettings } from "./brand"
import { buildDocumentPacket } from "./documents"
import { id } from "./format"
import { nextActionDue, scoreLead } from "./scoring"
import { updateStore } from "./store"
import type { Activity, Lead, PublicLeadInput } from "./types"

export function inputToLead(input: PublicLeadInput, existing?: Partial<Lead>): Lead {
  const scored = scoreLead(input)
  const now = new Date().toISOString()
  const leadId = existing?.id ?? id("lead")
  const lead: Lead = {
    id: leadId,
    type: input.type,
    stage: existing?.stage ?? "new",
    source: input.source,
    name: input.name,
    email: input.email,
    phone: input.phone,
    areaSlug: input.areaSlug,
    address: input.address ?? "",
    city: input.city ?? "",
    timeline: input.timeline,
    motivation: input.motivation ?? "",
    occupancy: input.occupancy ?? "unknown",
    water: input.water ?? "unknown",
    wastewater: input.wastewater ?? "unknown",
    financing: input.financing ?? "not_yet",
    propertyUse: input.propertyUse ?? "unknown",
    beds: input.beds ?? "",
    baths: input.baths ?? "",
    sqft: input.sqft ?? "",
    budgetMin: input.budgetMin ?? null,
    budgetMax: input.budgetMax ?? null,
    estimatedValue: input.estimatedValue ?? null,
    listPrice: existing?.listPrice ?? input.estimatedValue ?? null,
    contractPrice: existing?.contractPrice ?? null,
    commissionRate: existing?.commissionRate ?? defaultSettings.defaultCommissionRate,
    intentScore: scored.score,
    intentBand: scored.band,
    scoreReasons: scored.reasons,
    nextAction: existing?.nextAction ?? scored.nextAction,
    nextActionAt: existing?.nextActionAt ?? nextActionDue(scored.band),
    notes: input.notes ?? existing?.notes ?? "",
    relocatingFrom: input.relocatingFrom ?? "",
    yearBuilt: input.yearBuilt ?? "",
    lavaZone: input.lavaZone ?? "",
    hoa: input.hoa ?? false,
    isSample: existing?.isSample ?? false,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    lastTouchedAt: now,
    closedAt: existing?.closedAt ?? null,
    documents: existing?.documents ?? [],
  }
  if (!lead.documents.length) lead.documents = buildDocumentPacket(lead)
  return lead
}

export function makeActivity(leadId: string, type: Activity["type"], body: string): Activity {
  return {
    id: id("act"),
    leadId,
    type,
    body,
    createdAt: new Date().toISOString(),
  }
}

export async function ingestPublicLead(input: PublicLeadInput) {
  const lead = inputToLead(input)
  await updateStore((store) => {
    store.leads.unshift(lead)
    store.activities.unshift(
      makeActivity(
        lead.id,
        "form_submit",
        `${lead.type === "seller" ? "Seller" : "Buyer"} inquiry from the public site. Intent ${lead.intentScore} (${lead.intentBand}).`
      )
    )
    return store
  })
  return { id: lead.id, band: lead.intentBand, score: lead.intentScore }
}
