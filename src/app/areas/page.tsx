import Image from "next/image";
import Link from "next/link";
import { NEIGHBORHOODS } from "@/data/neighborhoods";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore the Big Island | Your Big Island Real Estate",
  description: "Discover life across Hawai'i Island's nine unique districts.",
};

export default function AreasPage() {
  return (
    <>
      <section className="bg-sand py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <p className="eyebrow text-coral">Areas We Serve</p>
          <h1 className="font-display text-coral text-4xl sm:text-5xl lg:text-6xl mt-3 max-w-2xl">Explore Life Across the Big Island</h1>
          <p className="mt-6 text-ink/70 max-w-xl leading-relaxed">Hawai&apos;i Island is unlike anywhere else in the world — nine distinct districts, each with its own character, climate, and community.</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {NEIGHBORHOODS.map(area => (
            <Link key={area.slug} href={`/areas/${area.slug}`} className="group block">
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden">
                <Image src={`/images/neighborhoods/${area.slug}.jpg`} alt={area.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-ink/20 group-hover:bg-ink/10 transition-colors" />
              </div>
              <div className="mt-4">
                <h2 className="font-display text-xl text-ink group-hover:text-coral transition-colors">{area.name}</h2>
                <p className="mt-1 text-sm text-ink/60 line-clamp-2">{area.description}</p>
                <div className="mt-3 flex gap-4 text-xs text-ink/50">
                  <span>{area.medianPrice}</span><span>·</span><span>{area.density} density</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
