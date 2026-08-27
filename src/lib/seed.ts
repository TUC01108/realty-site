import { defaultSettings } from "./brand"
import { buildDocumentPacket } from "./documents"
import { nextActionDue, scoreLead } from "./scoring"
import type { Lead, PublicLeadInput, Store } from "./types"

function stamp(daysAgo: number, hour = 10) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  d.setHours(hour, 12, 0, 0)
  return d.toISOString()
}

function dueInHours(hours: number) {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()
}

function leadFrom(partial: PublicLeadInput & Pick<Lead, "id" | "stage" | "createdAt" | "name" | "notes"> & Partial<Lead>): Lead {
  const scored = scoreLead(partial)
  const base: Lead = {
    id: partial.id,
    type: partial.type,
    stage: partial.stage,
    source: partial.source,
    name: partial.name,
    email: partial.email,
    phone: partial.phone,
    areaSlug: partial.areaSlug,
    address: partial.address ?? "",
    city: partial.city ?? "",
    timeline: partial.timeline,
    motivation: partial.motivation ?? "",
    occupancy: partial.occupancy ?? "unknown",
    water: partial.water ?? "unknown",
    wastewater: partial.wastewater ?? "unknown",
    financing: partial.financing ?? "not_yet",
    propertyUse: partial.propertyUse ?? "unknown",
    beds: partial.beds ?? "",
    baths: partial.baths ?? "",
    sqft: partial.sqft ?? "",
    budgetMin: partial.budgetMin ?? null,
    budgetMax: partial.budgetMax ?? null,
    estimatedValue: partial.estimatedValue ?? null,
    listPrice: partial.listPrice ?? null,
    contractPrice: partial.contractPrice ?? null,
    commissionRate: defaultSettings.defaultCommissionRate,
    intentScore: scored.score,
    intentBand: scored.band,
    scoreReasons: scored.reasons,
    nextAction: partial.nextAction ?? scored.nextAction,
    nextActionAt: partial.nextActionAt ?? nextActionDue(scored.band),
    notes: partial.notes,
    relocatingFrom: partial.relocatingFrom ?? "",
    yearBuilt: partial.yearBuilt ?? "",
    lavaZone: partial.lavaZone ?? "",
    hoa: partial.hoa ?? false,
    isSample: true,
    createdAt: partial.createdAt,
    updatedAt: partial.createdAt,
    lastTouchedAt: partial.lastTouchedAt ?? partial.createdAt,
    closedAt: partial.closedAt ?? null,
    documents: [],
  }
  base.documents = buildDocumentPacket(base)
  if (partial.documents) base.documents = partial.documents
  return base
}

export function createSeedStore(): Store {
  const keiko = leadFrom({
    id: "lead_keiko",
    type: "seller",
    source: "valuation",
    stage: "new",
    name: "Keiko Tanaka",
    email: "keiko.tanaka.sample@example.com",
    phone: "(808) 555-0142",
    areaSlug: "south-hilo",
    address: "128 Puʻuʻeo St",
    city: "Hilo",
    timeline: "asap",
    motivation: "Inherited mom's house. Siblings want to sell and split. Need it listed this month.",
    occupancy: "vacant",
    water: "county",
    wastewater: "sewer",
    beds: "3",
    baths: "2",
    sqft: "1,420",
    estimatedValue: 625000,
    yearBuilt: "1968",
    lavaZone: "3",
    notes: "SAMPLE. Vacant inherited cottage near downtown Hilo. Roof looks original from street view — flag at consult.",
    createdAt: stamp(0, 8),
    nextActionAt: dueInHours(-2),
  })

  const rossi = leadFrom({
    id: "lead_rossi",
    type: "buyer",
    source: "buyer_match",
    stage: "contacted",
    name: "Mark & Elena Rossi",
    email: "rossi.sample@example.com",
    phone: "(415) 555-0194",
    areaSlug: "south-kohala",
    city: "Waikoloa",
    timeline: "30_days",
    motivation: "Relocating from Bay Area. Elena starts remote in 6 weeks. Want a lock-and-leave near the airport.",
    financing: "cash",
    propertyUse: "primary",
    budgetMin: 1400000,
    budgetMax: 1850000,
    relocatingFrom: "San Francisco, CA",
    notes: "SAMPLE. Cash, real move date. Send Village vs resort-adjacent contrast and HOA reality.",
    createdAt: stamp(1, 15),
    lastTouchedAt: stamp(0, 9),
    nextAction: "Send 4 actives and book a two-day showing block.",
    nextActionAt: dueInHours(6),
  })

  const david = leadFrom({
    id: "lead_david",
    type: "seller",
    source: "area_page",
    stage: "qualified",
    name: "David Kealoha",
    email: "d.kealoha.sample@example.com",
    phone: "(808) 555-0177",
    areaSlug: "north-kona",
    address: "75-5782 Nani Kailua Dr",
    city: "Kailua-Kona",
    timeline: "90_days",
    motivation: "Tired landlord. Tenant through October. Wants a net number before deciding to list.",
    occupancy: "tenant",
    water: "county",
    wastewater: "septic",
    beds: "3",
    baths: "2.5",
    sqft: "1,860",
    estimatedValue: 875000,
    listPrice: 875000,
    yearBuilt: "1994",
    hoa: false,
    notes: "SAMPLE. Consult done. He will list when tenant gives 30-day. Draft listing agreement now so signing is one meeting.",
    createdAt: stamp(6, 11),
    lastTouchedAt: stamp(1, 16),
    nextAction: "Send net sheet and tenant-in-place listing plan.",
    nextActionAt: dueInHours(20),
  })
  david.documents = david.documents.map((d) =>
    d.key === "net_sheet" ? { ...d, status: "prepared", notes: "Draft at $875k / 5% total / tenant through Oct." } : d
  )

  const priya = leadFrom({
    id: "lead_priya",
    type: "buyer",
    source: "buyer_match",
    stage: "new",
    name: "Priya Shah",
    email: "priya.shah.sample@example.com",
    phone: "(808) 555-0119",
    areaSlug: "south-hilo",
    city: "Hilo",
    timeline: "6_months",
    motivation: "First home. Renting in Waiākea. Learning the east side.",
    financing: "not_yet",
    propertyUse: "primary",
    budgetMin: 380000,
    budgetMax: 450000,
    notes: "SAMPLE. Do not show homes until a lender has her. Send two lender names.",
    createdAt: stamp(2, 19),
    nextActionAt: dueInHours(30),
  })

  const castillo = leadFrom({
    id: "lead_castillo",
    type: "buyer",
    source: "manual",
    stage: "under_contract",
    name: "Luis & Ana Castillo",
    email: "castillo.sample@example.com",
    phone: "(808) 555-0160",
    areaSlug: "puna",
    address: "19-4234 Haunani Rd",
    city: "Volcano",
    timeline: "asap",
    motivation: "Found the forest house. Under contract. Inspection this week.",
    financing: "pre_approved",
    propertyUse: "primary",
    budgetMax: 535000,
    contractPrice: 510000,
    water: "catchment",
    wastewater: "septic",
    yearBuilt: "1986",
    beds: "2",
    baths: "2",
    notes: "SAMPLE. In escrow. Termite + catchment + roof are the inspection stack.",
    createdAt: stamp(18, 10),
    lastTouchedAt: stamp(0, 7),
    nextAction: "Confirm inspectors and keep the closing calendar current.",
    nextActionAt: dueInHours(8),
  })
  castillo.documents = castillo.documents.map((d) => {
    if (["buyer_broker", "funds", "purchase_contract"].includes(d.key)) {
      return { ...d, status: "signed" }
    }
    if (d.key === "inspection_plan") return { ...d, status: "sent", notes: "Home + termite booked Thursday." }
    if (d.key === "financing_addendum") return { ...d, status: "signed" }
    return d
  })

  const jim = leadFrom({
    id: "lead_jim",
    type: "seller",
    source: "fsbo",
    stage: "contacted",
    name: "Jim Brennan",
    email: "jim.brennan.sample@example.com",
    phone: "(808) 555-0133",
    areaSlug: "puna",
    address: "15-2114 Akeakamai Loop",
    city: "Hawaiian Paradise Park",
    timeline: "30_days",
    motivation: "Tried FSBO for 7 weeks. Two tire-kickers. Cesspool. Wants it gone before he leaves for the mainland.",
    occupancy: "owner",
    water: "catchment",
    wastewater: "cesspool",
    beds: "3",
    baths: "2",
    sqft: "1,280",
    estimatedValue: 389000,
    lavaZone: "3",
    yearBuilt: "2004",
    notes: "SAMPLE. FSBO conversion. Bring cesspool cost on the net sheet so the list price is not a fantasy.",
    createdAt: stamp(4, 14),
    lastTouchedAt: stamp(3, 9),
    nextAction: "Second touch: send a 90-day HPP sold snapshot and a net at $389k.",
    nextActionAt: dueInHours(-18),
  })

  const aisha = leadFrom({
    id: "lead_aisha",
    type: "buyer",
    source: "area_page",
    stage: "qualified",
    name: "Aisha Mohamed",
    email: "aisha.m.sample@example.com",
    phone: "(808) 555-0188",
    areaSlug: "hamakua",
    city: "Honokaʻa",
    timeline: "30_days",
    motivation: "Job transfer. Needs a house near Honokaʻa before the school year.",
    financing: "pre_approved",
    propertyUse: "primary",
    budgetMin: 520000,
    budgetMax: 680000,
    relocatingFrom: "Hilo",
    notes: "SAMPLE. Pre-approved, date-driven. Show Honokaʻa town first, not cliff lots.",
    createdAt: stamp(3, 8),
    lastTouchedAt: stamp(1, 12),
    nextAction: "Set Saturday showings. Two town homes, one backup.",
    nextActionAt: dueInHours(12),
  })

  const closed = leadFrom({
    id: "lead_closed_demo",
    type: "seller",
    source: "sphere",
    stage: "closed",
    name: "Noelani Grace",
    email: "n.grace.sample@example.com",
    phone: "(808) 555-0101",
    areaSlug: "north-kona",
    address: "78-1210 Kamehameha III Rd",
    city: "Kailua-Kona",
    timeline: "asap",
    motivation: "Downsized after the kids left.",
    occupancy: "owner",
    water: "county",
    wastewater: "sewer",
    estimatedValue: 1120000,
    listPrice: 1095000,
    contractPrice: 1075000,
    beds: "3",
    baths: "3",
    yearBuilt: "2001",
    hoa: true,
    notes: "SAMPLE closed file so the revenue desk has a real GCI number. Ask for three referrals this month.",
    createdAt: stamp(70, 9),
    lastTouchedAt: stamp(8, 11),
    closedAt: stamp(8, 11),
    nextAction: "Ask for referrals and a Google review.",
    nextActionAt: dueInHours(48),
  })
  closed.documents = closed.documents.map((d) => ({ ...d, status: d.status === "not_needed" ? d.status : "filed" }))

  const leads = [keiko, rossi, david, priya, castillo, jim, aisha, closed]

  return {
    settings: { ...defaultSettings },
    leads,
    activities: [
      {
        id: "act_keiko_form",
        leadId: "lead_keiko",
        type: "form_submit",
        body: "Submitted the home-value form from the Hilo page. Inherited, vacant, wants it listed this month.",
        createdAt: keiko.createdAt,
      },
      {
        id: "act_rossi_call",
        leadId: "lead_rossi",
        type: "call",
        body: "Intro call. Cash. Waikoloa Village first, resort only if the HOA math works. Two-day trip in 11 days.",
        createdAt: stamp(0, 9),
      },
      {
        id: "act_castillo_offer",
        leadId: "lead_castillo",
        type: "stage_change",
        body: "Offer accepted at $510,000. Inspection clock started.",
        createdAt: stamp(5, 17),
      },
    ],
  }
}
