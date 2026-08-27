import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import WelcomeVideo from "@/components/WelcomeVideo"
import JsonLd from "@/components/JsonLd"
import { brand } from "@/lib/brand"
import { personJsonLd } from "@/lib/schema"
import { GUIDES } from "@/data/guides"
import { NEIGHBORHOODS } from "@/data/neighborhoods"

export const metadata: Metadata = {
  title: { absolute: "Yordana Bolanos Salas, RS-88323 | Meet the Hilo Realtor" },
  description:
    "Yordana Bolanos Salas, RS-88323, Realtor with Coldwell Banker Island Properties at 101 Hualalai Street, Hilo, HI 96720. English, Spanish, and Portuguese.",
  alternates: { canonical: "/about" },
}

export default function AboutPage() {
  return (
    <>
      <JsonLd data={personJsonLd()} />
      <section className="bg-sand">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-16 lg:py-24 grid gap-12 lg:grid-cols-2 items-start">
          <div className="relative aspect-[4/5] w-full rounded-sm overflow-hidden">
            <Image
              src="/images/headshot.png"
              alt="Yordana Bolanos Salas, Realtor in Hilo, Hawaiʻi Island"
              fill
              priority
              className="object-cover"
            />
          </div>
          <div>
            <p className="eyebrow text-coral">Meet Yordana</p>
            <h1 className="font-display text-coral text-4xl sm:text-5xl mt-3 leading-tight">
              Yordana Bolanos Salas
            </h1>
            <p className="mt-3 text-sm text-ink/70">
              {brand.jobTitle} · {brand.license} · {brand.brokerage}
            </p>
            <p className="mt-1 text-sm text-ink/70">{brand.addressDisplay}</p>
            <p className="mt-1 text-sm text-ink/70">Languages: {brand.languages}</p>
            <p className="mt-6 text-ink/80 leading-relaxed">
              I am Yordana Bolanos Salas. I work from 101 Hualalai Street in Hilo, with Coldwell Banker
              Island Properties. If you found a Coldwell Banker page first, this is the same person — and
              this site is where I keep the record of how I actually work on Hawaiʻi Island.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="rounded-sm bg-coral px-6 py-3 text-sm font-medium text-paper hover:bg-coral-dark transition-colors"
              >
                Write to me
              </Link>
              <a
                href={brand.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm border border-coral px-6 py-3 text-sm font-medium text-coral hover:bg-coral hover:text-paper transition-colors"
              >
                Instagram {brand.instagramHandle}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 lg:px-8 py-16 lg:py-20 grid gap-6 text-ink/80 leading-relaxed">
        <h2 className="font-display text-3xl text-coral">How I got here</h2>
        <p>
          I spent more than 17 years in strategic sales, high-level negotiations, and international
          market development before I practiced real estate here. That work included building markets
          and leading market-entry work in Mexico and Australia — networks, agreements, and the long
          game, not a pitch deck.
        </p>
        <p>
          In Venezuela I served as Coordinator of the Department of Culture and represented the country
          in international forums and high-level meetings alongside heads of state and senior officials.
          That is protocol, discretion, and cultural intelligence. It is also why I do not confuse a
          warm conversation with a clean file.
        </p>
        <p>
          I have lived and worked internationally. I know what it is to relocate — to land in a new
          country with a family and a language and a set of assumptions that will not survive the first
          month. I speak English, Spanish, and Portuguese because that is how I live, not because a
          website needed a badge.
        </p>
        <p>
          On island I am a hula mom. I paddle. I paint. I practice Taoism. We spend time with family in
          nature. That is the life I am actually in while I walk listings in Hilo, Puna, Kona, and the
          districts between.
        </p>
        <p>
          I am a Realtor, license {brand.license}, with {brand.brokerage}. Strategy over transaction: I
          would rather tell you what you cannot see on the listing — water, insurance bindability, lava
          zone as a neighborhood fact, whether overnight use is even a legal question in Hawaiʻi County
          — than rush a showing because the photos were pretty.
        </p>
      </section>

      <WelcomeVideo />

      <section className="mx-auto max-w-6xl px-6 lg:px-8 py-16 lg:py-20">
        <p className="eyebrow text-coral">On this site</p>
        <h2 className="font-display text-3xl mt-2">Districts and answers I will actually stand behind</h2>
        <p className="mt-4 text-ink/70 max-w-2xl leading-relaxed">
          The nine judicial districts are not a brochure rack. Each page is what it is like to live
          there — water, lava context, who it fits — and when I do not have a verified fact, I say
          less.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          {NEIGHBORHOODS.map((n) => (
            <li key={n.slug}>
              <Link href={`/areas/${n.slug}`} className="text-coral border-b border-coral pb-0.5 hover:text-coral-dark">
                {n.name}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="mt-10 grid gap-3 text-sm">
          {GUIDES.map((g) => (
            <li key={g.slug}>
              <Link href={`/guides/${g.slug}`} className="text-coral border-b border-coral pb-0.5 hover:text-coral-dark">
                {g.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
