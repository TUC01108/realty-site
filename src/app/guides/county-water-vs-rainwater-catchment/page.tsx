import type { Metadata } from "next"
import GuideArticle from "@/components/GuideArticle"
import JsonLd from "@/components/JsonLd"
import { getGuide } from "@/data/guides"
import { absUrl } from "@/lib/schema"

const guide = getGuide("county-water-vs-rainwater-catchment")!

export const metadata: Metadata = {
  title: guide.htmlTitle,
  description: guide.description,
  alternates: { canonical: `/guides/${guide.slug}` },
}

const sources = [
  { label: "County of Hawaiʻi Department of Water Supply — About DWS (23 systems)", href: "https://www.hawaiidws.org/about-dws/" },
  { label: "DWS — What about rainwater catchment?", href: "https://www.hawaiidws.org/catchment/" },
  { label: "Hawaiʻi DOH Safe Drinking Water Branch — Rainwater catchment", href: "https://health.hawaii.gov/sdwb/raincatchment/" },
  { label: "DWS Rules & Regulations — cross-connections and backflow (PDF)", href: "https://www.hawaiidws.org/wp-content/uploads/2018/06/Rules-and-Regulations.pdf" },
]

export default function CountyWaterPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    author: { "@type": "Person", name: "Yordana Bolanos Salas" },
    url: absUrl(`/guides/${guide.slug}`),
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <GuideArticle
        guide={guide}
        sources={sources}
        related={[
          { href: "/guides/lava-flow-hazard-zones-and-insurance", label: "Lava-flow hazard zones and insurance" },
          { href: "/guides/hawaii-county-short-term-vacation-rentals", label: "Short-term vacation rentals in Hawaiʻi County" },
          { href: "/guides/dont-buy-the-house-you-see", label: "Don’t buy the house you see" },
        ]}
      >
        <p>
          On Hawaiʻi Island, water is something we verify before we talk about lifestyle. The County of
          Hawaiʻi Department of Water Supply is a semi-autonomous agency. It does not run one island-wide
          grid. DWS says its primary function is potable service through{" "}
          <strong>23 individual water systems</strong> distributed around the island. A house in Hilo and
          a house in Ocean View are not on “the County water.” They may not be on County water at all.
        </p>
        <p>
          A water main in the road is not a meter. Capacity, rules, and whether DWS will issue a new
          service are questions for DWS against the TMK — not for a listing remark, and not for me
          guessing from a drive-by. If the seller says “County water is available,” I still want the
          Department to say it about this parcel.
        </p>
        <h2 className="font-display text-2xl text-coral mt-4">Catchment is a private system</h2>
        <p>
          Rainwater catchment is how a large part of this island actually drinks and bathes. DWS is
          explicit: it <strong>does not recognize nor regulate</strong> rainwater catchment. If you are
          beyond a public water system, you are the utility. Gutters, roof material, screens, tank,
          pumps, filters, testing — that is owner maintenance, not a County subscription.
        </p>
        <p>
          The State Department of Health Safe Drinking Water Branch is also explicit: rainwater
          catchment systems on individual homes are <strong>not regulated by DOH</strong>, and DOH does
          not certify a home tank as potable the way a public water system is certified. DOH publishes
          guidance — design, maintenance, testing, including a screening panel for E. coli, turbidity,
          lead, and copper — and it is still your system. I will not tell you a catchment house has
          “City water quality.” I will tell you to read the DOH page and budget for upkeep.
        </p>
        <h2 className="font-display text-2xl text-coral mt-4">Catchment plus a meter is not a free upgrade</h2>
        <p>
          People like the sentence “we’ll keep the tank and get a meter later.” Dual catchment and a
          DWS meter is a <strong>cross-connection / backflow</strong> issue. DWS rules prohibit
          connections that could let water or other substances flow from the premises into the
          Department’s system. Existing cross-connections with an auxiliary supply have to be eliminated
          or protected with an approved backflow-prevention assembly, typically immediately downstream
          of the meter, at the consumer’s expense, with testing and maintenance on the owner. I am not
          your plumber. I am the person who will not let that surprise show up after you are in
          contract.
        </p>
        <p>
          This is not legal advice and not a DWS determination. Before you write an offer I want the
          TMK in front of DWS, and I want the water field on the listing treated as a claim to verify.
          Lenders and insurers have their own water questions; those are not the same as DWS, and not
          the same as DOH.
        </p>
      </GuideArticle>
    </>
  )
}
