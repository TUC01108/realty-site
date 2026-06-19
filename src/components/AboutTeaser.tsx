import Link from "next/link";

export default function AboutTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-6 lg:px-8 py-20 lg:py-28 grid gap-12 lg:grid-cols-2 items-center">
      <div className="aspect-[4/5] w-full bg-line/60 rounded-sm flex items-center justify-center text-ink/40 text-sm">
        [Agent headshot or lifestyle photo]
      </div>
      <div>
        <p className="eyebrow">Meet [Agent Name]</p>
        <h2 className="font-display text-3xl lg:text-4xl mt-3">
          Your trusted real estate advisor in [Market Area]
        </h2>
        <p className="mt-5 text-ink/70 leading-relaxed">
          [Two to three sentences of agent bio — background, specialty,
          philosophy. Pull directly from the PDF copy once it arrives, or we
          can draft something together.]
        </p>
        <Link
          href="/about"
          className="mt-6 inline-block text-sm font-medium text-evergreen border-b border-evergreen pb-0.5 hover:text-brass hover:border-brass transition-colors"
        >
          Learn more about [Agent Name]
        </Link>
      </div>
    </section>
  );
}
