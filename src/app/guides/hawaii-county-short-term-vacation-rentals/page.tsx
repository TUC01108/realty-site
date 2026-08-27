import type { Metadata } from "next"
import GuideArticle from "@/components/GuideArticle"
import JsonLd from "@/components/JsonLd"
import { getGuide } from "@/data/guides"
import { absUrl } from "@/lib/schema"

const guide = getGuide("hawaii-county-short-term-vacation-rentals")!

export const metadata: Metadata = {
  title: guide.htmlTitle,
  description: guide.description,
  alternates: { canonical: `/guides/${guide.slug}` },
}

const sources = [
  {
    label: "County of Hawaiʻi Planning — Short-term vacation rentals (Ord. 2018-114 / Bill 108, Rule 23)",
    href: "https://www.planning.hawaiicounty.gov/resources/short-term-vacation-rentals",
  },
]

export default function StvrPage() {
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
          { href: "/guides/dont-buy-the-house-you-see", label: "Don’t buy the house you see" },
          { href: "/guides/county-water-vs-rainwater-catchment", label: "County water vs rainwater catchment" },
          { href: "/guides/lava-flow-hazard-zones-and-insurance", label: "Lava-flow hazard zones and insurance" },
        ]}
      >
        <p>
          If you are buying on Hawaiʻi Island because a listing looks like a vacation rental, stop.
          Hawaiʻi County is not Honolulu and it is not Maui. The ordinance does not name Puna, Hilo, or
          A-1a. I will not tell you a lot is a legal STVR because of the neighborhood on the MLS. I will
          not tell you Hilo banned it and Kona allowed it. CC&amp;Rs that ban short-term rental still
          apply even if zoning would otherwise allow the use.
        </p>
        <p>
          This is first-person orientation from a Realtor, not legal advice, and not a map of how to
          operate. Hawaiʻi County Code Chapter 25 (the compilation I am working from was updated 5 August
          2026), Ordinance 2018-114 (Bill 108), and Planning Department Rule 23 are the file. Planning
          wins on a specific TMK: East Hawaiʻi 808-961-8288, West Hawaiʻi 808-323-4770.
        </p>

        <h2 className="font-display text-2xl text-coral mt-4">What Chapter 25 calls an STVR</h2>
        <p>
          Chapter 25’s STVR is an <strong>unhosted</strong> dwelling: the owner or operator does not
          reside on the building site, no more than five bedrooms for rent on that site, rented for
          thirty consecutive days or less, with a reachable person in Hawaiʻi County — reachable by
          phone within one hour, able to be on-site within three. That is not a hosted, owner-occupied
          spare-room product. I will not treat it as one.
        </p>

        <h2 className="font-display text-2xl text-coral mt-4">New STVR is a zoning district, not a town name</h2>
        <p>
          Permitted districts for a <em>new</em> STVR: V, CG, and CV. Residential or commercial only if
          the parcel is in a General Plan Resort or Resort Node. RM multifamily in a CPR. RS, RD, and CN
          only in a General Plan Resort or Resort Node. Agriculture is not a permitted STVR use. A State
          agricultural farm dwelling used for overnight stays is not a holiday-rental product on this
          island.
        </p>
        <p>
          Registration is not permission. The one-time registration fee — Planning’s packet lists $500 —
          never creates zoning permission. Advertising must show a registration or NUC number;
          advertising is treated as prima facie operation.
        </p>

        <h2 className="font-display text-2xl text-coral mt-4">NUC was a closed window</h2>
        <p>
          A Nonconforming Use Certificate was only for STVRs operating outside permitted districts
          before 1 April 2019. The application window closed 30 September 2019. There are no new NUCs.
        </p>
        <p>
          Annual renewal is $250. Late renewal is forfeiture. The code does not say a NUC transfers on
          sale. A new owner notifies the director; the registration continues subject to termination by
          the new owner. Display a current NUC. “Grandfathered” without a current, displayed certificate
          is a story, not a file.
        </p>
        <p>
          On State Land Use Agricultural District lots, Rule 23-3 is the limit I will actually say:
          the NUC path was for State Ag single-family lots existing before 4 June 1976. A dwelling
          operated as an STVR on a lot created on or after that date in State Ag cannot register. I am
          not going to workshop how to get around that.
        </p>

        <h2 className="font-display text-2xl text-coral mt-4">What I will not tell you</h2>
        <ul className="list-disc pl-5 grid gap-2">
          <li>That a vacation rental is legal because of a neighborhood name, Hawaiian Paradise Park, A-1a, or the MLS caption.</li>
          <li>That you can put a new STVR on Agriculture, or that Puna is a permitted-STVR district by name.</li>
          <li>That a NUC “conveys” with the house like a water meter.</li>
          <li>That hosted or owner-occupied use is a Chapter 25 STVR.</li>
        </ul>
        <p>
          SMA — Special Management Area — is a separate coastal development permit. It is not an STVR
          license. If overnight visitor use is why you are buying, we call Planning on that TMK before
          you write. The code changes; I would rather lose the showing than write the wrong use into an
          offer.
        </p>
      </GuideArticle>
    </>
  )
}
