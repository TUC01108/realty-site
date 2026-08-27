import type { Metadata } from "next"
import GuideArticle from "@/components/GuideArticle"
import JsonLd from "@/components/JsonLd"
import { getGuide } from "@/data/guides"
import { absUrl } from "@/lib/schema"

const guide = getGuide("dont-buy-the-house-you-see")!

export const metadata: Metadata = {
  title: guide.htmlTitle,
  description: guide.description,
  alternates: { canonical: `/guides/${guide.slug}` },
}

const sources = [
  { label: "DWS — About the Department (23 separate systems)", href: "https://www.hawaiidws.org/about-dws/" },
  { label: "DWS — Rainwater catchment", href: "https://www.hawaiidws.org/catchment/" },
  { label: "USGS HVO — lava-flow hazard FAQs", href: "https://www.usgs.gov/observatories/hvo/frequently-asked-questions-and-answers-about-lava-flow-hazards" },
  { label: "Hawaiʻi DCCA Insurance Division — lava-flow insurance", href: "https://cca.hawaii.gov/ins/lava-flow-insurance-information/" },
]

export default function DontBuyTheHousePage() {
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
          { href: "/guides/lava-flow-hazard-zones-and-insurance", label: "Lava-flow hazard zones and insurance" },
        ]}
      >
        <p>
          The house you see on a screen is an invitation. It is not the house. On Hawaiʻi Island the
          expensive surprises are usually not the backsplash. They are water, whether anyone will bind
          insurance, what “lava zone” actually means, and whether the use you want — especially overnight
          rental — is even a legal use in <em>this</em> county.
        </p>
        <p>
          I do this work from Hilo. I would rather lose a weekend of showings than write an offer on a
          feeling. This is not legal advice.
        </p>
        <h2 className="font-display text-2xl text-coral mt-4">Water you cannot see</h2>
        <p>
          DWS is 23 separate systems, not one island pipe. A main in the road does not guarantee a
          meter on your TMK. Catchment is owner-maintained; DWS does not recognize or regulate it; DOH
          does not certify a home tank as potable. Dual catchment and a meter is a backflow problem,
          not a clever redundancy. We verify with DWS against the TMK. I wrote that out here:{" "}
          <a href="/guides/county-water-vs-rainwater-catchment" className="text-coral border-b border-coral">
            county water vs catchment
          </a>
          .
        </p>
        <h2 className="font-display text-2xl text-coral mt-4">Insurance bindability</h2>
        <p>
          A pretty house in a hard zone is still a pretty house. It is not a bound policy. Lava is not
          hurricane and not flood. Most voluntary carriers are unwilling in USGS Zones 1–2; HPIA is
          residual market / last resort, with published limits that may not match rebuild cost. I will
          not say a listing is uninsurable. I will say we talk to a licensed producer, and we read HID,
          before you spend emotional money. Detail:{" "}
          <a href="/guides/lava-flow-hazard-zones-and-insurance" className="text-coral border-b border-coral">
            lava zones and insurance
          </a>
          .
        </p>
        <h2 className="font-display text-2xl text-coral mt-4">Lava zone is not a survey</h2>
        <p>
          USGS zones 1–9 (Wright et al., MF-2193, 1992) are long-term relative hazard for general
          planning. They are not a parcel line, not a current-eruption forecast, and not a “safe”
          stamp. Zone 1 is not twice Zone 2. Digital pins omit roughly a half-mile boundary (a quarter
          mile around Zone 1). I use the map at neighborhood scale. I do not pretend a GIS click is a
          surveyor.
        </p>
        <h2 className="font-display text-2xl text-coral mt-4">Overnight rental is not a listing caption</h2>
        <p>
          Hawaiʻi County is not Honolulu and it is not Maui. I will not tell you there is a “legal
          STVR” in Puna, in Hawaiian Paradise Park, or on A-1a. I will not tell you Hilo banned
          short-term rentals and Kona allows them. Those sentences travel well on the internet and they
          are how people buy the wrong land.
        </p>
        <p>
          County short-term rental rules are ordinance, permits, and enforcement — and they change. As
          of 27 August 2026 I could not retrieve the County ordinance PDFs (the County site was
          Cloudflare-blocked from the environment I work in). I am not going to invent permitted
          districts, fees, or NUC transfer rules to fill that gap. If overnight visitor use is why you
          are buying, we verify with County of Hawaiʻi Planning on the record for that TMK before you
          write.
        </p>
        <p>
          Two more things I will not blur: a State agricultural farm dwelling used for overnight stays
          is not a holiday-rental product on this island. And SMA — Special Management Area — is a
          separate coastal development permit. Being “near the ocean” does not tell you whether SMA
          applies, and SMA is not a vacation-rental license.
        </p>
        <p>
          If you want the house you saw, we can talk about the house. If you want the income you
          imagined, that is a different conversation, and it starts with Planning, not with me nodding
          at a kitchen.
        </p>
      </GuideArticle>
    </>
  )
}
