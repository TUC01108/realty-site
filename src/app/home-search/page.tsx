import type { Metadata } from "next";
import BuyerMatchForm from "@/components/BuyerMatchForm";

export const metadata: Metadata = { title: "Home Search" };

export default function HomeSearchPage() {
  return (
    <>
      <section className="bg-sand">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-16 lg:py-24">
          <p className="eyebrow text-coral">Buyer match</p>
          <h1 className="font-display text-coral text-4xl lg:text-5xl mt-3">Tell Yordana what you are looking for</h1>
          <p className="mt-6 text-ink/70 max-w-2xl">
            MLS/IDX search is coming. Until then, this is the fastest way to get a real match on Hawaiʻi Island — district, timeline, budget, and how you will use the home. Hot inquiries get a same-day call.
          </p>
        </div>
      </section>
      <section className="bg-sand pb-20">
        <div className="mx-auto max-w-xl px-6 lg:px-8">
          <BuyerMatchForm />
        </div>
      </section>
    </>
  );
}
