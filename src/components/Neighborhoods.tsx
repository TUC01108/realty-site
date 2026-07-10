import Image from "next/image";
import Link from "next/link";
import { NEIGHBORHOODS } from "@/data/neighborhoods";

export default function Neighborhoods() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <h2 className="font-display text-coral text-3xl lg:text-4xl">Explore Life Across the Big Island</h2>
      </div>
      <div className="mt-10 flex flex-col">
        {NEIGHBORHOODS.map(area => (
          <Link key={area.slug} href={`/areas/${area.slug}`} className="group relative h-40 sm:h-48 border-t hairline first:border-t-0 overflow-hidden block">
            <Image src={`/images/neighborhoods/${area.slug}.jpg`} alt={area.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
          </Link>
        ))}
      </div>
    </section>
  );
}
