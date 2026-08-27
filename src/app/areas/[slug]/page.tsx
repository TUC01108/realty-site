import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { NEIGHBORHOODS } from "@/data/neighborhoods"
import type { Metadata } from "next"
import { brand } from "@/lib/brand"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return NEIGHBORHOODS.map((n) => ({ slug: n.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const area = NEIGHBORHOODS.find((n) => n.slug === slug)
  if (!area) return {}
  return {
    title: `${area.name}, Hawaiʻi Island — living here`,
    description: `${area.lede} From ${brand.agentName}, ${brand.license}, Hilo.`,
    alternates: { canonical: `/areas/${area.slug}` },
  }
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params
  const area = NEIGHBORHOODS.find((n) => n.slug === slug)
  if (!area) notFound()

  return (
    <>
      <section className="relative h-64 sm:h-80 lg:h-96">
        <Image src={`/images/neighborhoods/${area.slug}.jpg`} alt={area.name} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-ink/30" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto max-w-6xl w-full px-6 lg:px-8 pb-8">
            <p className="eyebrow text-paper/80">Hawaiʻi Island · living here</p>
            <h1 className="font-display text-4xl sm:text-5xl text-paper mt-1">{area.name}</h1>
            <p className="mt-2 max-w-2xl text-paper/90 text-sm sm:text-base">{area.lede}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 lg:px-8 py-14 lg:py-20 grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-5 text-ink/80 leading-relaxed">
          {area.living.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
          <p className="text-sm text-ink/55">
            I am {brand.agentName}, {brand.license}. This is district-level orientation from Hilo, not a
            parcel report.
          </p>
        </div>
        <aside className="flex flex-col gap-8">
          <div>
            <p className="eyebrow text-coral">Water</p>
            <p className="mt-3 text-sm text-ink/70 leading-relaxed">{area.water}</p>
            <div className="border-t hairline mt-6" />
          </div>
          <div>
            <p className="eyebrow text-coral">Lava context</p>
            <p className="mt-3 text-sm text-ink/70 leading-relaxed">{area.lava}</p>
            <div className="border-t hairline mt-6" />
          </div>
          <div>
            <p className="eyebrow text-coral">Who it fits</p>
            <p className="mt-3 text-sm text-ink/70 leading-relaxed">{area.whoItFits}</p>
          </div>
          <Link href="/guides" className="text-sm font-medium text-coral border-b border-coral pb-0.5 self-start hover:text-coral-dark">
            Guides on water, lava, and insurance
          </Link>
        </aside>
      </section>

      <section className="grid sm:grid-cols-2 gap-1 mx-auto max-w-6xl px-6 lg:px-8 pb-16 lg:pb-20">
        {[1, 2].map((n) => (
          <div key={n} className="relative aspect-[4/3] rounded-sm overflow-hidden">
            <Image
              src={`/images/neighborhoods/${area.slug}-detail-${n}.jpeg`}
              alt={`${area.name} scenery`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </section>

      <section className="bg-coral text-paper">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-16 lg:py-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <p className="eyebrow text-paper/80">Considering {area.name}?</p>
            <h2 className="font-display text-3xl lg:text-4xl mt-2">Tell me how you live. Then we look at listings.</h2>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link href="/home-search" className="rounded-sm bg-paper px-6 py-3 text-sm font-medium text-coral hover:bg-transparent hover:text-paper border border-paper transition-colors">
              Buyer match
            </Link>
            <Link href="/contact" className="rounded-sm border border-paper px-6 py-3 text-sm font-medium hover:bg-paper hover:text-coral transition-colors">
              Contact Yordana
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 lg:px-8 py-16 lg:py-20">
        <p className="eyebrow text-coral">Explore more</p>
        <h2 className="font-display text-2xl lg:text-3xl mt-2 mb-8">Other Big Island districts</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {NEIGHBORHOODS.filter((n) => n.slug !== area.slug)
            .slice(0, 4)
            .map((n) => (
              <Link key={n.slug} href={`/areas/${n.slug}`} className="group relative aspect-[4/3] rounded-sm overflow-hidden block">
                <Image src={`/images/neighborhoods/${n.slug}.jpg`} alt={n.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-ink/30 group-hover:bg-ink/10 transition-colors" />
                <p className="absolute bottom-3 left-3 font-display text-paper text-lg [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">{n.name}</p>
              </Link>
            ))}
        </div>
        <Link href="/areas" className="mt-6 inline-block text-sm font-medium text-coral border-b border-coral pb-0.5 hover:text-coral-dark transition-colors">
          View all districts
        </Link>
      </section>
    </>
  )
}
