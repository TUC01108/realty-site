import Image from "next/image";
import Link from "next/link";

const CARDS = [
  { label: "Buy", href: "/home-search", image: "/images/buy-card.png" },
  { label: "Sell", href: "/valuation", image: "/images/sell-card.png" },
  { label: "Connect", href: "/contact", image: "/images/connect-card.png" },
];

export default function BuySellConnect() {
  return (
    <section className="mx-auto max-w-6xl px-6 lg:px-8 pb-16 lg:pb-24">
      <div className="font-display text-coral text-3xl lg:text-4xl leading-tight mb-4">
        Crafting Legacies,
        <br />
        One Home at a Time
      </div>
      <p className="text-ink/70 max-w-xl mb-10">
        Yordana is more than just an agent — she&apos;s a trusted partner in
        achieving your real estate dreams.
      </p>

      <div className="grid gap-1 sm:grid-cols-3">
        {CARDS.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group relative aspect-[4/3] flex items-end p-6 overflow-hidden"
          >
            <Image
              src={card.image}
              alt={card.label}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="relative font-display text-2xl text-paper [text-shadow:0_1px_8px_rgba(0,0,0,0.5)] group-hover:text-coral transition-colors">
              {card.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
