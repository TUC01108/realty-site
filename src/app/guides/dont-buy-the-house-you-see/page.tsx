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
  {
    label: "County of Hawaiʻi Planning — Short-term vacation rentals (Ord. 2018-114 / Bill 108, Rule 23)",
    href: "https://www.planning.hawaiicounty.gov/resources/short-term-vacation-rentals",
  },
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
          Hawaiʻi County is not Honolulu and it is not Maui. The ordinance does not name Puna, Hilo, or
          A-1a. I will not tell you a lot is a legal STVR because of the neighborhood on the MLS. I will
          not tell you Hilo banned it and Kona allows it. CC&amp;Rs that ban short-term rental still apply
          even if zoning would otherwise allow the use.
        </p>
        <p>
          Hawaiʻi County Code Chapter 25, as implemented by Ordinance 2018-114 (Bill 108) and Planning
          Department Rule 23, is the file. Chapter 25’s STVR is an <strong>unhosted</strong> dwelling: the
          owner or operator does not reside on the building site, no more than five bedrooms for rent on
          that site, rented for thirty consecutive days or less, with a reachable person in Hawaiʻi County
          (reachable by phone within one hour, able to be on-site within three). That is not a hosted,
          owner-occupied spare-room product, and I will not treat it as one.
        </p>
        <p>
          New STVR is a zoning-district question, not a district-name question. Permitted districts for a
          new STVR include V, CG, and CV; residential or commercial only where the General Plan maps
          Resort or Resort Node; RM multifamily in a CPR; RS, RD, and CN only in a General Plan Resort or
          Resort Node. Agriculture is not a permitted STVR use. A State agricultural farm dwelling used
          for overnight stays is not a holiday-rental product on this island.
        </p>
        <p>
          Registration is not permission. The one-time registration fee (Planning’s packet still lists
          $500) never creates zoning permission. Advertising must show a registration or NUC number;
          advertising is treated as prima facie operation.
        </p>
        <p>
          Nonconforming Use Certificates were a closed door, not a path I can open. NUC was for STVRs
          operating outside permitted districts before 1 April 2019; Rule 23 required those applications
          by late September 2019. There are no new NUCs. Annual renewal is $250; late renewal is
          forfeiture. The code does not say a NUC “transfers” on sale. A new owner notifies the director;
          the registration continues subject to termination by the new owner. Display a current NUC.
          “Grandfathered” without a current, displayed certificate is a story, not a file.
        </p>
        <p>
          Rule 23-3 is blunt about State Ag: a dwelling operated as an STVR on a lot created on or after
          4 June 1976 in the State Land Use Agricultural District is excluded from being registered. I
          am not going to workshop how to get around that.
        </p>
        <p>
          SMA — Special Management Area — is a separate coastal development permit. Being near the ocean
          does not tell you whether SMA applies, and SMA is not a vacation-rental license.
        </p>
        <p>
          If overnight visitor use is why you are buying, we verify with County of Hawaiʻi Planning on
          that TMK before you write — East Hawaiʻi 808-961-8288, West Hawaiʻi 808-323-4770. This is not
          legal advice, and it is not a map of how to operate. The code changes; Planning wins.
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
