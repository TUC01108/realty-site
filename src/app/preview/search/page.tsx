import type { Metadata } from "next";
import SearchExperience from "@/components/listings/SearchExperience";
import { getListingFeed } from "@/lib/listings/feed";

export const metadata: Metadata = {
  title: "Listing preview",
  alternates: { canonical: "https://www.yourbigislandrealestate.com/preview/search" },
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default async function PreviewSearchPage() {
  const feed = await getListingFeed();
  return <SearchExperience feed={feed} />;
}
