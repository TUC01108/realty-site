import type { Metadata } from "next"
import Link from "next/link"
import { GUIDES } from "@/data/guides"

export const metadata: Metadata = {
  title: "Hawaiʻi Island answers: water, lava, insurance",
  description:
    "From Yordana Bolanos Salas, RS-88323, Hilo: county water vs catchment, lava-flow hazard zones and insurance, and what a listing photo will not tell you.",
  alternates: { canonical: "/guides" },
}

export default function GuidesIndex() {
  return (
    <>
      <section className="bg-sand py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <p className="eyebrow text-coral">From Hilo</p>
          <h1 className="font-display text-coral text-4xl sm:text-5xl mt-3">
            What I tell people before they write an offer on Hawaiʻi Island
          </h1>
          <p className="mt-6 text-ink/70 leading-relaxed">
            These pages have sources. They are not legal advice, not an insurance quote, and not a
            promise about any TMK.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-6 lg:px-8 py-16 grid gap-10">
        {GUIDES.map((g) => (
          <article key={g.slug}>
            <p className="eyebrow text-coral">{g.eyebrow}</p>
            <h2 className="font-display text-2xl mt-2">
              <Link href={`/guides/${g.slug}`} className="hover:text-coral transition-colors">
                {g.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-ink/65 leading-relaxed">{g.description}</p>
            <Link
              href={`/guides/${g.slug}`}
              className="mt-4 inline-block text-sm font-medium text-coral border-b border-coral pb-0.5 hover:text-coral-dark"
            >
              Read the guide
            </Link>
          </article>
        ))}
      </section>
    </>
  )
}
