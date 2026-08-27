import Image from "next/image";
import Link from "next/link";
import { NEIGHBORHOODS } from "@/data/neighborhoods";

export default function Neighborhoods() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <h2 className="font-display text-coral text-3xl lg:text-4xl">Explore Life Across the Big Island</h2>
        <p className="mt-3 text-ink/65 max-w-2xl text-sm leading-relaxed">
          Nine districts. Click through for water, lava context, and who it actually fits — not a
          brochure.
        </p>
      </div>
      <div className="mt-10 flex flex-col">
        {NEIGHBORHOODS.map((area) => (
          <Link
            key={area.slug}
            href={`/areas/${area.slug}`}
            className="group relative h-40 sm:h-48 border-t hairline first:border-t-0 overflow-hidden block"
          >
            <Image
              src={`/images/neighborhoods/${area.slug}.jpg`}
              alt={area.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-ink/25 group-hover:bg-ink/10 transition-colors" />
            <p className="absolute bottom-4 left-6 lg:left-8 font-display text-paper text-2xl sm:text-3xl [text-shadow:0_1px_8px_rgba(0,0,0,0.55)]">
              {area.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
