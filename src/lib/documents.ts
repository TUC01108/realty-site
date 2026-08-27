import type { DocumentItem, Lead, LeadType } from "./types"

type Template = Omit<DocumentItem, "id" | "status" | "notes">

const sellerDocs: Template[] = [
  {
    key: "listing_agreement",
    name: "Exclusive right-to-sell listing agreement",
    category: "Representation",
    why: "Official HAR listing contract. Use the worksheet below to fill the blanks, then complete the brokerage form.",
  },
  {
    key: "listing_input",
    name: "MLS / listing input sheet",
    category: "Marketing",
    why: "Beds, baths, tenure, TMK, water, wastewater, parking, and remarks — gathered once so photos and MLS go out the same day.",
  },
  {
    key: "srpd",
    name: "Seller’s Real Property Disclosure Statement",
    category: "Disclosures",
    why: "The seller tells the truth in writing. Start it at the listing consult, not the week of offer.",
  },
  {
    key: "lead_paint",
    name: "Lead-based paint disclosure",
    category: "Disclosures",
    why: "Required for housing built before 1978. Mark not-needed if the home is newer.",
  },
  {
    key: "lava_hazard",
    name: "Volcanic / lava-zone acknowledgment",
    category: "Island facts",
    why: "Buyers and lenders treat zones 1–3 differently. Put the zone in the file before the first showing.",
  },
  {
    key: "water_system",
    name: "Water system disclosure (county, catchment, well)",
    category: "Island facts",
    why: "Catchment and private wells are normal here and still surprise mainland buyers. Spell out tanks, catchment area, and treatment.",
  },
  {
    key: "wastewater",
    name: "Wastewater / cesspool / septic disclosure",
    category: "Island facts",
    why: "Cesspool conversion and septic capacity kill deals when they appear at inspection. Ask on day one.",
  },
  {
    key: "harpta_firpta",
    name: "HARPTA / FIRPTA residency worksheet",
    category: "Closing",
    why: "Non-resident sellers can owe Hawaiʻi withholding. Confirm residency early so net sheets are not fiction.",
  },
  {
    key: "hoa_docs",
    name: "Association documents request",
    category: "Disclosures",
    why: "Bylaws, budget, minutes, rental rules, and pending assessments. Skip if there is no association.",
  },
  {
    key: "photo_staging",
    name: "Photo, access, and staging checklist",
    category: "Marketing",
    why: "Keys, alarm, pets, occupied rooms, and what gets boxed before the photographer arrives.",
  },
  {
    key: "net_sheet",
    name: "Seller net sheet",
    category: "Money",
    why: "Commission, HARPTA, payoff, cesspool, roof, and closing costs — the number they actually care about.",
  },
]

const buyerDocs: Template[] = [
  {
    key: "buyer_broker",
    name: "Buyer representation agreement",
    category: "Representation",
    why: "Written agency before showings. Use the worksheet to fill names, area, and compensation, then complete the brokerage form.",
  },
  {
    key: "funds",
    name: "Pre-approval or proof of funds",
    category: "Money",
    why: "No touring occupied homes on a maybe. Cash letters and underwritten pre-approvals only.",
  },
  {
    key: "purchase_contract",
    name: "Purchase contract worksheet (DROA / HAR RPC)",
    category: "Offer",
    why: "Price, dates, inclusions, and financing blanks prepared so the official form is a 20-minute sit-down, not a scramble.",
  },
  {
    key: "financing_addendum",
    name: "Financing addendum",
    category: "Offer",
    why: "Loan type, dates, and what happens if the appraisal misses. Mark not-needed for cash.",
  },
  {
    key: "inspection_plan",
    name: "Inspection plan (home, termite, cesspool, survey)",
    category: "Due diligence",
    why: "East-side rain and west-side salt need different inspectors. Book them the day the offer dates are set.",
  },
  {
    key: "lead_paint",
    name: "Lead-based paint acknowledgment",
    category: "Disclosures",
    why: "If the home is pre-1978. Otherwise mark not-needed.",
  },
  {
    key: "lava_insurance",
    name: "Lava zone / insurance feasibility",
    category: "Island facts",
    why: "Some zones and some lenders do not mix. Check before the client falls in love with a Puna lot.",
  },
  {
    key: "escrow_open",
    name: "Escrow opening packet",
    category: "Closing",
    why: "IDs, entity docs, wiring instructions warning, and the timeline the closing date actually requires.",
  },
  {
    key: "closing_calendar",
    name: "Closing calendar",
    category: "Closing",
    why: "Inspection, appraisal, HOA docs, loan conditions, and walkthrough — one page, no hunting through texts.",
  },
]

function withIds(type: LeadType): DocumentItem[] {
  const list = type === "seller" ? sellerDocs : buyerDocs
  return list.map((doc) => ({
    ...doc,
    id: `${type}_${doc.key}`,
    status: "pending",
    notes: "",
    // unique per lead at assignment time
  }))
}

export function buildDocumentPacket(lead: Pick<Lead, "id" | "type" | "yearBuilt" | "hoa" | "financing">): DocumentItem[] {
  return withIds(lead.type).map((doc) => {
    let status = doc.status
    if (doc.key === "lead_paint") {
      const year = Number(lead.yearBuilt)
      if (year && year >= 1978) status = "not_needed"
    }
    if (doc.key === "hoa_docs" && lead.hoa === false) status = "not_needed"
    if (doc.key === "financing_addendum" && lead.financing === "cash") status = "not_needed"
    return { ...doc, id: `${lead.id}_${doc.key}`, status }
  })
}

export function packetProgress(docs: DocumentItem[]) {
  const actionable = docs.filter((d) => d.status !== "not_needed")
  const done = actionable.filter((d) =>
    ["prepared", "sent", "signed", "filed"].includes(d.status)
  )
  const signed = actionable.filter((d) => ["signed", "filed"].includes(d.status))
  return {
    total: actionable.length,
    done: done.length,
    signed: signed.length,
    percent: actionable.length === 0 ? 0 : Math.round((done.length / actionable.length) * 100),
  }
}

export const docStatusLabels: Record<string, string> = {
  pending: "Not started",
  prepared: "Prepared",
  sent: "Sent",
  signed: "Signed",
  filed: "Filed",
  not_needed: "Not needed",
}
