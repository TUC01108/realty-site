import type { IntentBand, PublicLeadInput } from "./types"

export type ScoreResult = {
  score: number
  band: IntentBand
  reasons: string[]
  nextAction: string
}

function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)))
}

function bandFor(score: number): IntentBand {
  if (score >= 80) return "hot"
  if (score >= 55) return "warm"
  if (score >= 30) return "nurture"
  return "browse"
}

export function scoreLead(input: PublicLeadInput): ScoreResult {
  let score = 8
  const reasons: string[] = []

  const hasPhone = Boolean(input.phone?.replace(/\D/g, "").length >= 7)
  const hasEmail = Boolean(input.email?.includes("@"))
  if (hasPhone) {
    score += 10
    reasons.push("Gave a phone number")
  }
  if (hasEmail) {
    score += 4
  }

  if (input.timeline === "asap") {
    score += 36
    reasons.push("Wants to move immediately")
  } else if (input.timeline === "30_days") {
    score += 28
    reasons.push("30-day timeline")
  } else if (input.timeline === "90_days") {
    score += 16
    reasons.push("90-day timeline")
  } else if (input.timeline === "6_months") {
    score += 8
  }

  const motivation = (input.motivation || "").toLowerCase()
  const hotWhy =
    /inherit|job|reloc|divorce|foreclos|probate|landlord|tired|downsiz|upsize|school|medical|retire|transfer/.test(
      motivation
    )
  if (hotWhy) {
    score += 14
    reasons.push("Clear life-event motivation")
  } else if (motivation.length > 12) {
    score += 6
  }

  if (input.type === "seller") {
    if (input.address && input.address.trim().length > 6) {
      score += 16
      reasons.push("Named a specific property")
    }
    if (input.occupancy === "vacant") {
      score += 10
      reasons.push("Property is vacant")
    } else if (input.occupancy === "owner") {
      score += 6
    } else if (input.occupancy === "tenant") {
      score += 4
      reasons.push("Tenant in place — extra listing prep")
    }
    if (input.estimatedValue && input.estimatedValue >= 400_000) {
      score += 8
      reasons.push("Price point worth a full listing effort")
    }
    if (input.water && input.water !== "unknown") score += 3
    if (input.wastewater && input.wastewater !== "unknown") score += 3
    if (input.wastewater === "cesspool") {
      reasons.push("Cesspool on title — conversion talk is part of the listing")
    }
    if (input.lavaZone && /^(1|2)$/.test(input.lavaZone)) {
      score -= 4
      reasons.push("Lava zone 1 or 2 — still a lead, financing will be tighter")
    }
  }

  if (input.type === "buyer") {
    if (input.financing === "cash") {
      score += 24
      reasons.push("Cash buyer")
    } else if (input.financing === "pre_approved") {
      score += 22
      reasons.push("Pre-approved")
    } else if (input.financing === "pre_qualified") {
      score += 10
    } else {
      score -= 6
      reasons.push("Not financed yet — qualify before showing")
    }
    if (input.budgetMax && input.budgetMax >= 400_000) {
      score += 8
    }
    if (input.areaSlug && input.areaSlug !== "island") {
      score += 8
      reasons.push("Named a target area")
    }
    if (input.relocatingFrom && input.relocatingFrom.trim().length > 1) {
      score += 10
      reasons.push("Relocating — usually a real move date")
    }
    if (input.propertyUse === "primary") score += 6
  }

  const finalScore = clamp(score)
  const band = bandFor(finalScore)

  let nextAction = "Send a useful note and wait."
  if (input.type === "seller") {
    if (band === "hot")
      nextAction = "Call today. Book a listing consult this week."
    else if (band === "warm")
      nextAction = "Call within 24 hours. Offer a walkthrough and a net sheet."
    else if (band === "nurture")
      nextAction = "Send the neighborhood packet and a 2-week follow-up."
  } else {
    if (band === "hot")
      nextAction = "Call today. Confirm funds and set a showing window."
    else if (band === "warm")
      nextAction = "Call within 24 hours. Get lender name or proof of funds."
    else if (band === "nurture")
      nextAction = "Send 3 matching actives and a buyer consult invite."
  }

  if (reasons.length === 0) reasons.push("Thin intake — confirm they are real")

  return { score: finalScore, band, reasons, nextAction }
}

export function nextActionDue(band: IntentBand, createdAt = new Date()) {
  const hours = band === "hot" ? 4 : band === "warm" ? 24 : band === "nurture" ? 72 : 168
  return new Date(createdAt.getTime() + hours * 60 * 60 * 1000).toISOString()
}
