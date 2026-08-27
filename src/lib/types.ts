export const leadTypes = ["seller", "buyer"] as const
export type LeadType = (typeof leadTypes)[number]

export const stages = [
  "new",
  "contacted",
  "qualified",
  "active",
  "under_contract",
  "closed",
  "lost",
] as const
export type Stage = (typeof stages)[number]

export const timelines = [
  "asap",
  "30_days",
  "90_days",
  "6_months",
  "browsing",
] as const
export type Timeline = (typeof timelines)[number]

export const intentBands = ["hot", "warm", "nurture", "browse"] as const
export type IntentBand = (typeof intentBands)[number]

export const occupancyTypes = ["owner", "tenant", "vacant", "unknown"] as const
export type Occupancy = (typeof occupancyTypes)[number]

export const waterSystems = ["county", "catchment", "private_well", "unknown"] as const
export type WaterSystem = (typeof waterSystems)[number]

export const wastewaterSystems = [
  "sewer",
  "septic",
  "cesspool",
  "unknown",
] as const
export type Wastewater = (typeof wastewaterSystems)[number]

export const financingTypes = [
  "cash",
  "pre_approved",
  "pre_qualified",
  "not_yet",
] as const
export type Financing = (typeof financingTypes)[number]

export const propertyUses = [
  "primary",
  "second_home",
  "investment",
  "land",
  "unknown",
] as const
export type PropertyUse = (typeof propertyUses)[number]

export const docStatuses = [
  "pending",
  "prepared",
  "sent",
  "signed",
  "filed",
  "not_needed",
] as const
export type DocStatus = (typeof docStatuses)[number]

export const activityTypes = [
  "note",
  "call",
  "email",
  "sms",
  "stage_change",
  "form_submit",
  "document",
  "system",
] as const
export type ActivityType = (typeof activityTypes)[number]

export type LeadSource =
  | "valuation"
  | "buyer_match"
  | "area_page"
  | "manual"
  | "fsbo"
  | "expired"
  | "sphere"
  | "referral"

export type DocumentItem = {
  id: string
  key: string
  name: string
  category: string
  why: string
  status: DocStatus
  notes: string
}

export type Activity = {
  id: string
  leadId: string
  type: ActivityType
  body: string
  createdAt: string
}

export type Lead = {
  id: string
  type: LeadType
  stage: Stage
  source: LeadSource
  name: string
  email: string
  phone: string
  areaSlug: string
  address: string
  city: string
  timeline: Timeline
  motivation: string
  occupancy: Occupancy
  water: WaterSystem
  wastewater: Wastewater
  financing: Financing
  propertyUse: PropertyUse
  beds: string
  baths: string
  sqft: string
  budgetMin: number | null
  budgetMax: number | null
  estimatedValue: number | null
  listPrice: number | null
  contractPrice: number | null
  commissionRate: number
  intentScore: number
  intentBand: IntentBand
  scoreReasons: string[]
  nextAction: string
  nextActionAt: string | null
  notes: string
  relocatingFrom: string
  yearBuilt: string
  lavaZone: string
  hoa: boolean
  isSample: boolean
  createdAt: string
  updatedAt: string
  lastTouchedAt: string
  closedAt: string | null
  documents: DocumentItem[]
}

export type Settings = {
  agentName: string
  brokerage: string
  license: string
  phone: string
  email: string
  defaultCommissionRate: number
  cursorPlan: "pro" | "ultra"
  proPrice: number
  ultraPrice: number
}

export type Store = {
  settings: Settings
  leads: Lead[]
  activities: Activity[]
}

export type PublicLeadInput = {
  type: LeadType
  source: LeadSource
  name: string
  email: string
  phone: string
  areaSlug: string
  address?: string
  city?: string
  timeline: Timeline
  motivation?: string
  occupancy?: Occupancy
  water?: WaterSystem
  wastewater?: Wastewater
  financing?: Financing
  propertyUse?: PropertyUse
  beds?: string
  baths?: string
  sqft?: string
  budgetMin?: number | null
  budgetMax?: number | null
  estimatedValue?: number | null
  relocatingFrom?: string
  yearBuilt?: string
  lavaZone?: string
  hoa?: boolean
  notes?: string
}
