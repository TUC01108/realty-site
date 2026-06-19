import Link from "next/link";

const CARDS = [
  { label: "Buy", href: "/home-search" },
  { label: "Sell", href: "/valuation" },
  { label: "Connect", href: "/contact" },
];

export default function BuySellConnect() {
  return (
    <section className="mx-auto max-w-6xl px-6 lg:px-8 pb-16 lg:pb-24">
      <div className="flex items-start gap-6 mb-10">
        <div className="font-display text-coral text-3xl lg:text-4xl leading-tight">
          Crafting Legacies,
          <br />
          One Home at a Time
        </div>
      </div>
      <p className="text-ink/70 max-w-xl -mt-4 mb-10">
        Yordana is more than just an agent — she&apos;s a trusted partner in
        achieving your real estate dreams.
      </p>

      <div className="grid gap-1 sm:grid-cols-3">
        {CARDS.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group relative aspect-[4/3] bg-ink/5 flex items-end p-6 overflow-hidden"
          >
            {/* PHOTO NOTE: PDF uses a styled interior shot per card here */}
            <span className="absolute inset-0 flex items-center justify-center text-ink/30 text-xs">
              [Interior photo]
            </span>
            <span className="relative font-display text-2xl text-paper [text-shadow:0_1px_8px_rgba(0,0,0,0.5)] group-hover:text-coral transition-colors">
              {card.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
