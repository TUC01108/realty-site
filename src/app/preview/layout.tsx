import type { Metadata } from "next";
import { DisplayBroker, IdxNotice, PreviewBanner } from "@/components/listings/Compliance";
import { getListingFeed } from "@/lib/listings/feed";

export const revalidate = 43200;

export const metadata: Metadata = {
  title: "Listing preview",
  description: "Preview of fictional sample listings. This page is not indexed.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default async function PreviewLayout({ children }: { children: React.ReactNode }) {
  const feed = await getListingFeed();
  return (
    <div>
      <PreviewBanner sourceId={feed.sourceId} />
      <DisplayBroker />
      {children}
      <IdxNotice sourceId={feed.sourceId} />
    </div>
  );
}
