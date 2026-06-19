const PLACEHOLDER_LISTINGS = [
  { id: 1, address: "[123 Example St, City, ST]", price: "$0,000,000", beds: 0, baths: 0 },
  { id: 2, address: "[456 Sample Ave, City, ST]", price: "$0,000,000", beds: 0, baths: 0 },
  { id: 3, address: "[789 Demo Ln, City, ST]", price: "$0,000,000", beds: 0, baths: 0 },
];

export default function FeaturedListings() {
  return (
    <section className="bg-line/30 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="eyebrow">Featured Properties</p>
            <h2 className="font-display text-3xl lg:text-4xl mt-3">
              Current listings
            </h2>
          </div>
        </div>

        {/*
          IDX NOTE: This grid is a layout placeholder. Once the IDX
          vendor (iHomefinder / IDX Broker / Trestle) is wired up, replace
          PLACEHOLDER_LISTINGS with the live feed, or drop the vendor's
          embed/widget directly into this section.
        */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {PLACEHOLDER_LISTINGS.map((listing) => (
            <div key={listing.id} className="bg-paper rounded-sm overflow-hidden">
              <div className="aspect-[4/3] bg-line/60 flex items-center justify-center text-ink/40 text-sm">
                [Listing photo]
              </div>
              <div className="p-5">
                <p className="font-display text-xl">{listing.price}</p>
                <p className="text-sm text-ink/60 mt-1">{listing.address}</p>
                <p className="text-xs text-ink/50 mt-3">
                  {listing.beds} bd &middot; {listing.baths} ba
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
