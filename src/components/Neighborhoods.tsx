import Link from "next/link";
import { NEIGHBORHOODS } from "@/data/neighborhoods";

export default function Neighborhoods() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <h2 className="font-display text-coral text-3xl lg:text-4xl">
          Explore Life Across the Big Island
        </h2>
      </div>

      <div className="mt-10 flex flex-col">
        {NEIGHBORHOODS.map((area) => (
          <Link
            key={area.slug}
            href={`/areas/${area.slug}`}
            className="group relative h-40 sm:h-48 border-t hairline first:border-t-0 flex items-center justify-center overflow-hidden"
          >
            {/* PHOTO NOTE: each district uses its own real landscape photo in the PDF */}
            <span className="absolute inset-0 flex items-center justify-center bg-ink/5 text-ink/30 text-xs">
              [{area.name} landscape photo]
            </span>
            <span className="relative font-display text-2xl text-paper [text-shadow:0_1px_10px_rgba(0,0,0,0.6)] group-hover:text-coral transition-colors">
              {area.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
