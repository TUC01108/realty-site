import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NEIGHBORHOODS } from "@/data/neighborhoods";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

// Tell Next.js which slugs to pre-render at build time
export async function generateStaticParams() {
  return NEIGHBORHOODS.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const area = NEIGHBORHOODS.find((n) => n.slug === slug);
  if (!area) return {};
  return {
    title: `${area.name} Real Estate | Your Big Island Real Estate`,
    description: area.description,
  };
}

function detailImagePath(slug: string, n: 1 | 2): string {
  return `/images/neighborhoods/${slug}-detail-${n}.jpeg`;
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params;
  const area = NEIGHBORHOODS.find((n) => n.slug === slug);
  if (!area) notFound();

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative h-64 sm:h-80 lg:h-96">
        <Image
          src={`/images/neighborhoods/${area.slug}.jpg`}
          alt={area.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/30" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto max-w-6xl w-full px-6 lg:px-8 pb-8">
            <p className="eyebrow text-paper/80">Hawai&apos;i Island</p>
            <h1 className="font-display text-4xl sm:text-5xl text-paper mt-1">
              {area.name}
            </h1>
          </div>
        </div>
      </section>

      {/* ── STATS + DESCRIPTION ── */}
      <section className="mx-auto max-w-6xl px-6 lg:px-8 py-14 lg:py-20 grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="text-ink/70 leading-relaxed">{area.description}</p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {/* Attractions */}
            <div>
              <p className="font-display text-coral text-2xl">
                Top Attractions
              </p>
              <ul className="mt-3 space-y-2">
                {area.topAttractions.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink/70">
                    <span className="text-coral mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Restaurants */}
            <div>
              <p className="font-display text-coral text-2xl">
                Top Restaurants
              </p>
              <ul className="mt-3 space-y-2">
                {area.topRestaurants.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink/70">
                    <span className="text-coral mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Stats sidebar */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="font-display text-coral text-3xl">{area.population}</p>
            <p className="eyebrow text-coral mt-1">Population</p>
          </div>
          <div className="border-t hairline" />
          <div>
            <p className="font-display text-coral text-3xl">{area.density}</p>
            <p className="eyebrow text-coral mt-1">Population Density</p>
          </div>
          <div className="border-t hairline" />
          <div>
            <p className="font-display text-coral text-3xl">{area.medianPrice}</p>
            <p className="eyebrow text-coral mt-1">Median Home Price</p>
          </div>
        </div>
      </section>

      {/* ── DETAIL PHOTOS ── */}
      <section className="grid sm:grid-cols-2 gap-1 mx-auto max-w-6xl px-6 lg:px-8 pb-16 lg:pb-20">
        <div className="relative aspect-[4/3] rounded-sm overflow-hidden">
          <Image
            src={detailImagePath(area.slug, 1)}
            alt={`${area.name} scenery`}
            fill
            className="object-cover"
          />
        </div>
        <div className="relative aspect-[4/3] rounded-sm overflow-hidden">
          <Image
            src={detailImagePath(area.slug, 2)}
            alt={`${area.name} landscape`}
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-coral text-paper">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-16 lg:py-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <p className="eyebrow text-paper/80">Ready to explore {area.name}?</p>
            <h2 className="font-display text-3xl lg:text-4xl mt-2">
              Let&apos;s find your home here
            </h2>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link
              href="/home-search"
              className="rounded-sm bg-paper px-6 py-3 text-sm font-medium text-coral hover:bg-transparent hover:text-paper border border-paper transition-colors"
            >
              Browse Listings
            </Link>
            <Link
              href="/contact"
              className="rounded-sm border border-paper px-6 py-3 text-sm font-medium hover:bg-paper hover:text-coral transition-colors"
            >
              Contact Yordana
            </Link>
          </div>
        </div>
      </section>

      {/* ── OTHER AREAS ── */}
      <section className="mx-auto max-w-6xl px-6 lg:px-8 py-16 lg:py-20">
        <p className="eyebrow text-coral">Explore More</p>
        <h2 className="font-display text-2xl lg:text-3xl mt-2 mb-8">
          Other Big Island districts
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {NEIGHBORHOODS.filter((n) => n.slug !== area.slug)
            .slice(0, 4)
            .map((n) => (
              <Link
                key={n.slug}
                href={`/areas/${n.slug}`}
                className="group relative aspect-[4/3] rounded-sm overflow-hidden block"
              >
                <Image
                  src={`/images/neighborhoods/${n.slug}.jpg`}
                  alt={n.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-ink/30 group-hover:bg-ink/10 transition-colors" />
                <p className="absolute bottom-3 left-3 font-display text-paper text-lg [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
                  {n.name}
                </p>
              </Link>
            ))}
        </div>
        <Link
          href="/areas"
          className="mt-6 inline-block text-sm font-medium text-coral border-b border-coral pb-0.5 hover:text-coral-dark hover:border-coral-dark transition-colors"
        >
          View all districts
        </Link>
      </section>
    </>
  );
}
