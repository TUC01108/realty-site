import type { Metadata } from "next"
import GuideArticle from "@/components/GuideArticle"
import JsonLd from "@/components/JsonLd"
import { getGuide } from "@/data/guides"
import { absUrl } from "@/lib/schema"

const guide = getGuide("lava-flow-hazard-zones-and-insurance")!

export const metadata: Metadata = {
  title: guide.htmlTitle,
  description: guide.description,
  alternates: { canonical: `/guides/${guide.slug}` },
}

const sources = [
  {
    label: "USGS Hawaiian Volcano Observatory — FAQs about lava-flow hazards",
    href: "https://www.usgs.gov/observatories/hvo/frequently-asked-questions-and-answers-about-lava-flow-hazards",
  },
  {
    label: "Wright, T.L., et al., 1992, Map showing lava-flow hazard zones, Island of Hawaiʻi: USGS MF-2193 (PDF)",
    href: "https://pubs.usgs.gov/mf/1992/2193/mf2193.pdf",
  },
  {
    label: "Hawaiʻi DCCA Insurance Division — lava-flow insurance information",
    href: "https://cca.hawaii.gov/ins/lava-flow-insurance-information/",
  },
  {
    label: "Hawaii Property Insurance Association — coverage and limits offered",
    href: "https://www.hpiainfo.com/coverage-information/coverage-offered/",
  },
]

export default function LavaInsurancePage() {
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
          { href: "/guides/county-water-vs-rainwater-catchment", label: "County water vs rainwater catchment" },
          { href: "/guides/hawaii-county-short-term-vacation-rentals", label: "Short-term vacation rentals in Hawaiʻi County" },
          { href: "/guides/dont-buy-the-house-you-see", label: "Don’t buy the house you see" },
        ]}
      >
        <p>
          Lava-flow hazard and insurance bindability are two different files. I keep them apart on
          purpose. A USGS zone is not a quote. A quote is not a geologic forecast. I will not tell you
          a listing is uninsurable, and I will not tell you a zone is “safe.”
        </p>
        <h2 className="font-display text-2xl text-coral mt-4">What the USGS map is — and is not</h2>
        <p>
          The Island of Hawaiʻi lava-flow hazard zone map (Wright and others, USGS Miscellaneous Field
          Studies Map 2193, 1992) divides the island into zones 1 through 9. Zone 1 is the highest
          relative long-term hazard — summits and rift zones of Kīlauea and Mauna Loa, where lava
          typically first reaches the surface. Zone 9, Kohala, is the lowest relative zone on this
          island; USGS notes that volcano has not erupted for tens of thousands of years.
        </p>
        <p>
          USGS is clear about the rest, and I repeat it because the internet does not:
        </p>
        <ul className="list-disc pl-5 grid gap-2">
          <li>The zones are <strong>relative</strong> hazard for general planning. Zone 3 is more hazardous than zone 4. Zone 1 is <strong>not</strong> “twice” zone 2. USGS says it is incorrect to treat the numbers as a quantitative ratio.</li>
          <li>The map is <strong>not</strong> a current-eruption forecast, and not a statement that lava will or will not reach a house this year.</li>
          <li>Boundaries are approximate and gradational — on the order of <strong>about half a mile</strong> (about a <strong>quarter mile around Zone 1</strong>). Digital GIS pins omit that width. The map is indicative at neighborhood scale, not at the property line, and not a parcel survey.</li>
          <li>Hazard can still vary inside a single zone. A printed paper map was not drawn to identify individual parcels.</li>
        </ul>
        <p>
          USGS still considers the 1992 map accurate for long-term hazard — decades to centuries of
          volcanic behavior, not last month’s news. If you want the zone for a place you are actually
          buying, we look at the map together and we stay humble about the boundary.
        </p>
        <h2 className="font-display text-2xl text-coral mt-4">Insurance is a different conversation</h2>
        <p>
          Lava is not hurricane. Lava is not flood. Those products, deductibles, and residual markets
          are not interchangeable, and I will not collapse them into one scare sentence.
        </p>
        <p>
          Hawaiʻi DCCA’s Insurance Division keeps a lava-flow insurance page because this is a real
          consumer problem on this island. In practice, most voluntary (admitted) carriers are unwilling
          to write in USGS Zones 1 and 2. That is a market fact, not a geologic one, and it is still
          not the same sentence as “this house cannot be insured.”
        </p>
        <p>
          The Hawaii Property Insurance Association (HPIA) is the residual market — last resort — for
          residential property in the State when the voluntary market will not write. HPIA’s public
          coverage page currently states that policy limits range from $50,000 to $450,000 across its
          dwelling, homeowner, renter, and unit-owner forms. I am stating that as HPIA published it; I
          am not promising it will still be the cap when you bind, and $450,000 is not rebuild cost. You
          should read the policy forms. You should work with a licensed producer. HPIA is not a favor I
          can pull, and eligibility is not automatic because a listing is in a certain zone.
        </p>
        <p>
          If lava, hurricane, or flood is material to whether you can live with the house, we put a
          licensed insurance producer on the file before you are emotionally committed to the lanai.
          HID’s lava-flow page is the starting point I send people to — not a blog, and not me
          pretending to be an underwriter. This page is not legal advice and not an insurance
          recommendation.
        </p>
      </GuideArticle>
    </>
  )
}
