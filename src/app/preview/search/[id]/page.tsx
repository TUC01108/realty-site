import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BackToSearch from "@/components/listings/BackToSearch";
import ListingMap from "@/components/listings/ListingMap";
import ListingOfficeBlock from "@/components/listings/ListingOffice";
import PhotoGallery from "@/components/listings/PhotoGallery";
import { DISPLAY_BROKER } from "@/lib/listings/broker";
import { getListingById, getListingFeed } from "@/lib/listings/feed";
import { districtName, formatCount, formatListedDate, formatLot, formatPrice, listingAddress, tenureLabel } from "@/lib/listings/format";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const feed = await getListingFeed();
  return feed.listings.map((listing) => ({ id: listing.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const listingId = decodeURIComponent(id);
  return {
    title: `Sample listing ${listingId}`,
    description: "Fictional sample listing in the preview search. Not an MLS listing.",
    alternates: { canonical: `https://www.yourbigislandrealestate.com/preview/search/${listingId}` },
    robots: { index: false, follow: false, googleBot: { index: false, follow: false, noimageindex: true } },
  };
}

export default async function PreviewListingPage({ params }: Props) {
  const { id } = await params;
  const found = await getListingById(decodeURIComponent(id));
  if (!found) notFound();
  const { listing, feed } = found;
  const idLabel = feed.sourceId === "sample" ? "Sample id" : "MLS number";
  const facts: [string, string][] = [
    ["Type", listing.propertyType],
    ["District", districtName(listing.districtSlug)],
    ["Beds", listing.bedrooms == null ? "n/a" : formatCount(listing.bedrooms)],
    ["Baths", listing.bathrooms == null ? "n/a" : formatCount(listing.bathrooms)],
    ["Living area", listing.livingAreaSqFt == null ? "n/a" : `${listing.livingAreaSqFt.toLocaleString("en-US")} sq ft`],
    ["Lot", formatLot(listing.lotAcres)],
    ["Year built", listing.yearBuilt == null ? "n/a" : String(listing.yearBuilt)],
    ["Land tenure", tenureLabel(listing.tenure)],
    ["Lava zone", listing.lavaZone == null ? "Not in feed" : `Zone ${listing.lavaZone}`],
    ["Listed", listing.listedAt ? formatListedDate(listing.listedAt) : "Not in feed"],
    [idLabel, listing.mlsNumber ?? listing.listingKey],
  ];

  return (
    <article className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-10">
      <BackToSearch />
      <p className="mt-6 font-display text-4xl text-ink">{formatPrice(listing.price)}</p>
      <h1 className="mt-2 text-lg text-ink">{listingAddress(listing)}</h1>
      <p className="mt-2 text-sm text-ink">
        {districtName(listing.districtSlug)}
        {listing.districtSlug && (
          <>
            {" · "}
            <Link href={`/areas/${listing.districtSlug}`} className="text-coral underline decoration-line underline-offset-2">
              District guide
            </Link>
          </>
        )}
      </p>
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
        <PhotoGallery listing={listing} />
        <div className="flex flex-col gap-8">
          <dl className="grid grid-cols-2 gap-x-6">
            {facts.map(([label, value]) => (
              <div key={label} className="border-t hairline py-3">
                <dt className="eyebrow text-ink/70">{label}</dt>
                <dd className="mt-1 text-base text-ink">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="text-sm leading-relaxed text-ink">
            USGS lava-flow hazard zones run from 1, the highest hazard, to 9, the lowest.
          </p>
          <ListingOfficeBlock office={listing.office} />
          <div className="rounded-sm border border-line p-4">
            <p className="text-base font-medium text-ink">Displayed by {DISPLAY_BROKER.brokerage}</p>
            <p className="mt-1 text-base text-ink">{DISPLAY_BROKER.agent}, {DISPLAY_BROKER.license}</p>
            <p className="mt-1 text-base text-ink">{DISPLAY_BROKER.street}, {DISPLAY_BROKER.cityLine}</p>
            <p className="mt-1 text-base text-ink">
              <a className="underline" href={DISPLAY_BROKER.phoneHref}>{DISPLAY_BROKER.phone}</a>
            </p>
          </div>
          <Link href="/contact" className="inline-block rounded-sm bg-coral px-5 py-3 text-center text-sm font-medium text-paper">
            Talk with Yordana about a real search
          </Link>
        </div>
      </div>
      <p className="mt-10 max-w-3xl text-base leading-relaxed text-ink">{listing.publicRemarks}</p>
      <div className="mt-8 h-80 overflow-hidden rounded-sm border border-line">
        <ListingMap
          listings={[listing]}
          selectedId={listing.id}
          fitToken={listing.id}
          layoutKey="detail"
          focusNonce={0}
        />
      </div>
    </article>
  );
}
