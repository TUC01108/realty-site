import { expectedGci } from "./format"
import { stageProbability } from "./brand"
import type { Lead, Settings, Stage } from "./types"

export function dealPrice(lead: Lead) {
  return lead.contractPrice || lead.listPrice || lead.estimatedValue || lead.budgetMax || 0
}

export function gci(lead: Lead) {
  return expectedGci(dealPrice(lead), lead.commissionRate)
}

export function weightedGci(lead: Lead) {
  return Math.round(gci(lead) * (stageProbability[lead.stage] ?? 0))
}

export function cursorMonthly(settings: Settings) {
  return settings.cursorPlan === "ultra" ? settings.ultraPrice : settings.proPrice
}

export function pipelineStats(leads: Lead[], settings: Settings) {
  const open = leads.filter((l) => l.stage !== "lost")
  const closed = leads.filter((l) => l.stage === "closed")
  const active = leads.filter((l) => !["closed", "lost"].includes(l.stage))
  const hot = active.filter((l) => l.intentBand === "hot")
  const closedGci = closed.reduce((sum, l) => sum + gci(l), 0)
  const weighted = active.reduce((sum, l) => sum + weightedGci(l), 0)
  const monthly = cursorMonthly(settings)
  const monthsPaid = monthly === 0 ? 0 : Math.floor(closedGci / monthly)
  const monthsToUltra = Math.max(0, Math.ceil((settings.ultraPrice * 12 - closedGci) / Math.max(monthly, 1)))
  return {
    openCount: open.length,
    activeCount: active.length,
    hotCount: hot.length,
    closedCount: closed.length,
    closedGci,
    weighted,
    monthly,
    monthsPaid,
    canUpgrade: closedGci >= settings.ultraPrice * 3,
    monthsToUltra,
  }
}

export function sellerNetEstimate(lead: Lead) {
  const price = dealPrice(lead)
  if (!price) return null
  const commission = price * lead.commissionRate * 2
  const closing = price * 0.007
  const harpta = 0
  const cesspool = lead.wastewater === "cesspool" ? 18000 : 0
  return {
    price,
    commission,
    closing,
    harpta,
    cesspool,
    net: price - commission - closing - harpta - cesspool,
  }
}

export const stageOrder: Stage[] = [
  "new",
  "contacted",
  "qualified",
  "active",
  "under_contract",
  "closed",
  "lost",
]
