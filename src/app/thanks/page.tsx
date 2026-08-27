import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mahalo" };

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; type?: string }>
}) {
  const { error, type } = await searchParams;
  const selling = type === "seller";

  if (error) {
    return (
      <section className="mx-auto max-w-xl px-6 py-24">
        <p className="eyebrow text-coral">Almost there</p>
        <h1 className="font-display text-4xl text-coral mt-2">We need a name and a way to reach you</h1>
        <p className="mt-4 text-ink/70">Please go back and add a phone number or email so Yordana can follow up.</p>
        <Link href="/contact" className="mt-8 inline-block rounded-sm bg-coral px-6 py-3 text-sm font-medium text-paper hover:bg-coral-dark">
          Return to contact
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-xl px-6 py-24">
      <p className="eyebrow text-coral">Received</p>
      <h1 className="font-display text-4xl text-coral mt-2">Mahalo — she has this.</h1>
      <p className="mt-4 text-ink/70">
        {selling
          ? "Yordana will review the property and follow up with a valuation conversation, usually within a day."
          : "Yordana will review what you are looking for and follow up personally."}
      </p>
      <Link href="/" className="mt-8 inline-block rounded-sm bg-coral px-6 py-3 text-sm font-medium text-paper hover:bg-coral-dark">
        Back to the site
      </Link>
    </section>
  );
}
