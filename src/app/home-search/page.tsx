import type { Metadata } from "next";
import ListingAlertForm from "@/components/ListingAlertForm";

export const metadata: Metadata = {
  title: "Home Search",
  description:
    "Tell me what you're looking for and I'll send you matching listings. Share districts, budget, property type, lava zone, and timeline with Yordana Bolanos Salas.",
  alternates: { canonical: "https://www.yourbigislandrealestate.com/home-search" },
  openGraph: {
    title: "Home Search | Your Big Island Real Estate",
    description: "Tell me what you're looking for and I'll send you matching listings.",
    url: "https://www.yourbigislandrealestate.com/home-search",
  },
};

export default function HomeSearchPage() {
  return (
    <section className="bg-sand py-16 lg:py-20">
      <div className="mx-auto max-w-xl px-6 lg:px-8">
        <p className="eyebrow text-coral">Home Search</p>
        <h1 className="mt-3 font-display text-4xl text-coral lg:text-5xl">Tell me what you&apos;re looking for</h1>
        <p className="mt-4 leading-relaxed text-ink/70">
          I&apos;ll send you matching listings. Live MLS search is not on the site yet, so this request comes straight to me.
        </p>
        <ListingAlertForm />
      </div>
    </section>
  );
}
