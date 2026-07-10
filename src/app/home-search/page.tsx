import type { Metadata } from "next";
export const metadata: Metadata = { title: "Home Search | Your Big Island Real Estate" };
export default function HomeSearchPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 lg:px-8 py-24 text-center">
      <p className="eyebrow text-coral">Coming Soon</p>
      <h1 className="font-display text-coral text-4xl lg:text-5xl mt-3">Home Search</h1>
      <p className="mt-6 text-ink/70 max-w-md mx-auto">MLS/IDX integration coming soon. In the meantime, contact Yordana directly and she&apos;ll find the perfect property for you.</p>
    </section>
  );
}
