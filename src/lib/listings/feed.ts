import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { getListingSource } from "./source";
import { LISTING_REFRESH_SECONDS, type Listing, type ListingFeed } from "./types";

export const LISTING_CACHE_TAG = "listings";

async function loadListingFeed(): Promise<ListingFeed> {
  const source = getListingSource();
  const listings = await source.fetchActive();
  return {
    sourceId: source.id,
    fetchedAt: new Date().toISOString(),
    listings,
  };
}

// Time-based cache is the 12 hour ceiling. The cron route expires the tag
// sooner when the host allows a schedule at least that often.
export const getListingFeed = unstable_cache(loadListingFeed, ["listing-feed-v1"], {
  revalidate: LISTING_REFRESH_SECONDS,
  tags: [LISTING_CACHE_TAG],
});

export async function getListingById(id: string): Promise<{ listing: Listing; feed: ListingFeed } | null> {
  const feed = await getListingFeed();
  const listing = feed.listings.find((item) => item.id === id);
  if (!listing) return null;
  return { listing, feed };
}

export async function refreshListingFeed(): Promise<ListingFeed> {
  revalidateTag(LISTING_CACHE_TAG, { expire: 0 });
  revalidatePath("/preview", "layout");
  return getListingFeed();
}
