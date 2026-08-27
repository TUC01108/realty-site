import { brand } from "./brand"
import { getArea } from "./areas"
import type { Lead } from "./types"

export function sellerFirstText(lead: Lead) {
  const area = getArea(lead.areaSlug)
  return `Hi ${lead.name.split(" ")[0]}, this is Yordana with Your Big Island Real Estate. I received your note about ${lead.address || `a home in ${area.name}`}. I can call with a private value range and a net sheet — no listing appointment required to start. When is a good 10-minute window today?`
}

export function buyerFirstText(lead: Lead) {
  const area = getArea(lead.areaSlug)
  return `Hi ${lead.name.split(" ")[0]}, this is Yordana with Your Big Island Real Estate. I have your notes for ${area.name}. I only set showings once funds or a pre-approval are in the file — that keeps everyone from wasting a Saturday. Can we talk for 10 minutes today?`
}

export function sellerNetEmail(lead: Lead, agentName: string) {
  const area = getArea(lead.areaSlug)
  return {
    subject: `Private value range for ${lead.address || area.name}`,
    body: `Hi ${lead.name.split(" ")[0]},

Thank you for trusting me with ${lead.address || `your ${area.name} home`}.

Here is how I work: I pull the last 90 days of closed sales on streets that actually match yours (same district, similar water/wastewater, similar view). Then I send a net sheet — not a list price pulled from air.

What I need from you to make the number real:
• Approximate payoff, if any
• Whether the home is vacant, owner-occupied, or tenant-occupied
• Anything a buyer will see anyway (roof, cesspool/septic, catchment, unpermitted work)

I will not put a sign in the yard until you say so.

${agentName}
${brand.brokerage} · ${brand.license}
${brand.phone}
`,
  }
}

export function buyerMatchesEmail(lead: Lead, agentName: string) {
  const area = getArea(lead.areaSlug)
  return {
    subject: `${area.name} homes that fit what you described`,
    body: `Hi ${lead.name.split(" ")[0]},

I looked at what is actually livable in ${area.name} for your range. I am not going to dump the MLS at you.

Next step is a 15-minute call so I know:
• Primary home, second home, or investment
• Cash or lender (and which lender)
• The date you actually need keys

If those three are solid, I will set showings. If they are not, I will tell you what to fix first so we do not burn weekends.

${agentName}
${brand.brokerage} · ${brand.license}
${brand.phone}
`,
  }
}

export const playbook = [
  {
    id: "valuation-seo",
    title: "Home-value pages (already built)",
    effort: "Once, then share",
    revenue: "Highest — captures sellers who already own a house",
    why: "A seller with an address and a 30-day timeline is the fastest path to a listing side. One $600k side at 2.5% is $15,000 — enough to fund Cursor Ultra for years.",
    steps: [
      "Share /valuation and the district URLs on Google Business, Instagram bio, and email signature. These belong on yourbigislandrealestate.com — not a second brand.",
      "Ask every past client to forward the Hilo / Kona / Waimea page to one person thinking about selling.",
      "Post one neighborhood fact per week (cesspool, catchment, lava zone) and link the area page — that is organic, not ads.",
    ],
  },
  {
    id: "hot-sla",
    title: "Same-day call on every Hot lead",
    effort: "10 minutes",
    revenue: "Protects the leads this site already creates",
    why: "Speed-to-lead is the whole game. A Hot seller who waits overnight lists with whoever answered.",
    steps: [
      "Open Desk each morning. Anything Hot + overdue is the first call, not email.",
      "Use the script on the lead file. Book a consult or a showing window before you hang up.",
      "Log the call so the next action date moves.",
    ],
  },
  {
    id: "expired",
    title: "Weekly expired / withdrawn list",
    effort: "90 minutes every Monday",
    revenue: "Sellers who already wanted to sell",
    why: "They had intent. The last listing failed. That is a conversation, not a cold call.",
    steps: [
      "Pull expired and withdrawn in your districts from the last 14 days.",
      "Skip anything still in a pocket listing with another agent you respect.",
      "Handwritten note + one follow-up call. Put them in Desk as source “Expired” so the packet is waiting if they say yes.",
    ],
  },
  {
    id: "fsbo",
    title: "FSBO eight-touch (no begging)",
    effort: "Two a week",
    revenue: "Owners already paying for a sign",
    why: "Most FSBOs do not fail from price. They fail from showings, disclosures, and the first nasty inspection. That is your pitch.",
    steps: [
      "Touch 1: “If you sell it yourself, good. If you want the cesspool / HARPTA / disclosure stack handled, I am here.”",
      "Touch 2 (day 5): send a one-page sold snapshot for their street, not a resume.",
      "If they engage, create the seller packet in Desk the same hour.",
    ],
  },
  {
    id: "sphere",
    title: "Sphere: 10 conversations a week",
    effort: "Ongoing",
    revenue: "Highest conversion, lowest cost",
    why: "Organic does not mean anonymous. People on-island already know you. They do not know you want the referral.",
    steps: [
      "Text 10 people you actually know. Ask how they are. Mention you are taking listings on the side they live on.",
      "Log referrals in Desk as source “Sphere” so they get the same SLA as a website lead.",
    ],
  },
  {
    id: "google-profile",
    title: "Google Business Profile, weekly",
    effort: "20 minutes",
    revenue: "Free local search",
    why: "“realtor Hilo” and “sell my house Kona” still start on Google. Posts plus reviews beat a pretty brochure.",
    steps: [
      "One photo from a listing or a neighborhood walk.",
      "One sentence of useful island truth (water, lava, schools).",
      "Link to the matching /areas page.",
    ],
  },
]
