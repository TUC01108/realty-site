export const brand = {
  name: "Your Big Island Real Estate",
  shortName: "YBI Real Estate",
  deskName: "Yordana's desk",
  island: "Hawaiʻi Island",
  islandShort: "Big Island",
  tagline: "Meaningful journeys in buying and selling homes.",
  description:
    "Yordana Bolanos Salas, RS-88323, Realtor with Coldwell Banker Island Properties in Hilo — buying and selling homes across Hawaiʻi Island.",
  documentTitle:
    "Yordana Bolanos Salas, RS-88323 | Coldwell Banker Island Properties, Hilo",
  agentName: "Yordana Bolanos Salas",
  firstName: "Yordana",
  jobTitle: "Realtor",
  license: "RS-88323",
  brokerage: "Coldwell Banker Island Properties",
  phone: "808.642.4933",
  phoneHref: "tel:+18086424933",
  email: "yourbigislandrealestate@gmail.com",
  streetAddress: "101 Hualalai Street",
  addressLocality: "Hilo",
  addressRegion: "HI",
  postalCode: "96720",
  addressLine: "101 Hualalai Street, Hilo, HI 96720",
  addressDisplay: "101 Hualalai Street, Hilo, Hawaiʻi 96720",
  instagram: "https://www.instagram.com/yourbigislandrealestate/",
  instagramHandle: "@yourbigislandrealestate",
  cbProfile:
    "https://www.coldwellbanker.com/hi/hilo/agents/yordana-bolanos-salas/aid-P00200000000039q2zvjC11jFnQiQ3wNS71Nbufd",
  siteUrl: "https://www.yourbigislandrealestate.com",
  languages: "English, Spanish, and Portuguese",
  languageList: ["English", "Spanish", "Portuguese"] as const,
}

export const defaultSettings = {
  agentName: brand.agentName,
  brokerage: brand.brokerage,
  license: brand.license,
  phone: brand.phone,
  email: brand.email,
  defaultCommissionRate: 0.025,
  cursorPlan: "pro" as const,
  proPrice: 20,
  ultraPrice: 200,
}

export const stageLabels: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  active: "Active",
  under_contract: "Under contract",
  closed: "Closed",
  lost: "Lost",
}

export const stageHints: Record<string, string> = {
  new: "Not spoken with yet. Call today if hot.",
  contacted: "First conversation done. Book the consult.",
  qualified: "Real intent confirmed. Start the packet.",
  active: "Listed or actively showing.",
  under_contract: "In escrow. Run the document checklist.",
  closed: "Recorded. Ask for the review and referrals.",
  lost: "Dead or went elsewhere. Keep the notes.",
}

export const timelineLabels: Record<string, string> = {
  asap: "Ready now",
  "30_days": "Within 30 days",
  "90_days": "Within 90 days",
  "6_months": "This year",
  browsing: "Just looking",
}

export const financingLabels: Record<string, string> = {
  cash: "Cash",
  pre_approved: "Pre-approved",
  pre_qualified: "Pre-qualified",
  not_yet: "Not yet financed",
}

export const occupancyLabels: Record<string, string> = {
  owner: "Owner-occupied",
  tenant: "Tenant-occupied",
  vacant: "Vacant",
  unknown: "Unknown",
}

export const waterLabels: Record<string, string> = {
  county: "County water",
  catchment: "Catchment",
  private_well: "Private well",
  unknown: "Unknown",
}

export const wastewaterLabels: Record<string, string> = {
  sewer: "Sewer",
  septic: "Septic",
  cesspool: "Cesspool",
  unknown: "Unknown",
}

export const sourceLabels: Record<string, string> = {
  valuation: "Home value form",
  buyer_match: "Buyer match form",
  area_page: "Neighborhood page",
  manual: "Manual entry",
  fsbo: "FSBO conversion",
  expired: "Expired listing",
  sphere: "Sphere / past client",
  referral: "Referral",
}

export const stageProbability: Record<string, number> = {
  new: 0.05,
  contacted: 0.1,
  qualified: 0.25,
  active: 0.45,
  under_contract: 0.8,
  closed: 1,
  lost: 0,
}

export const sellerStages = [
  "new",
  "contacted",
  "qualified",
  "active",
  "under_contract",
  "closed",
] as const

export const deskPinFallback = "yordana"
export const deskCookieName = "ybi_desk"
