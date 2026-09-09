import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Search Homes for Sale on the Big Island | Your Big Island Real Estate",
  description: "Browse homes, condos, and land for sale across Hawai\'i Island. Search by district, price, and property type. Contact Yordana Bolanos Salas to find your perfect Big Island property.",
  alternates: { canonical: "https://www.yourbigislandrealestate.com/home-search" },
};
export default function HomeSearchPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 lg:px-8 py-24 text-center">
      <p className="eyebrow text-coral">Coming Soon</p>
      <h1 className="font-display text-coral text-4xl lg:text-5xl mt-3">Home Search</h1>
      <p className="mt-6 text-ink/70 max-w-md mx-auto">Live MLS search is coming soon. In the meantime, contact Yordana directly — she&apos;ll find the perfect property for you.</p>
      <Link href="/contact" className="mt-8 inline-block rounded-sm bg-coral px-6 py-3 text-sm font-medium text-paper hover:bg-coral-dark transition-colors">Contact Yordana</Link>
    </section>
  );
}
