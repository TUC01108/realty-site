import Image from "next/image"
import Link from "next/link"
import { NEIGHBORHOODS } from "@/data/neighborhoods"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nine Districts of Hawaiʻi Island | Hilo Realtor",
  description:
    "What it is like to live in North Kohala, South Kohala, North Kona, South Kona, Hāmākua, Puna, Kaʻū, North Hilo, and South Hilo — from Yordana Bolanos Salas in Hilo.",
  alternates: { canonical: "/areas" },
}

export default function AreasPage() {
  return (
    <>
      <section className="bg-sand py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <p className="eyebrow text-coral">Hawaiʻi Island</p>
          <h1 className="font-display text-coral text-4xl sm:text-5xl lg:text-6xl mt-3 max-w-3xl">
            Nine districts. Nine ways to live here.
          </h1>
          <p className="mt-6 text-ink/70 max-w-xl leading-relaxed">
            Water, rain, drive time, and lava context change by district — sometimes by neighborhood. I
            work from Hilo. These pages are how I talk about living in each place.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {NEIGHBORHOODS.map((area) => (
            <Link key={area.slug} href={`/areas/${area.slug}`} className="group block">
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden">
                <Image
                  src={`/images/neighborhoods/${area.slug}.jpg`}
                  alt={area.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-ink/20 group-hover:bg-ink/10 transition-colors" />
              </div>
              <div className="mt-4">
                <h2 className="font-display text-xl text-ink group-hover:text-coral transition-colors">{area.name}</h2>
                <p className="mt-1 text-sm text-ink/60 line-clamp-2">{area.lede}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
