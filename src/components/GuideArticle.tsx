import Link from "next/link"
import type { ReactNode } from "react"
import type { Guide, GuideSource } from "@/data/guides"

export default function GuideArticle({
  guide,
  children,
  sources,
  related,
}: {
  guide: Guide
  children: ReactNode
  sources: GuideSource[]
  related?: { href: string; label: string }[]
}) {
  return (
    <article>
      <header className="bg-sand py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <p className="eyebrow text-coral">{guide.eyebrow}</p>
          <h1 className="font-display text-coral text-4xl sm:text-5xl mt-3 leading-tight">
            {guide.title}
          </h1>
          <p className="mt-4 text-sm text-ink/50">
            From Yordana Bolanos Salas, RS-88323, Hilo. Not legal, insurance, or engineering advice.
          </p>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid gap-6 text-ink/80 leading-relaxed text-[0.975rem]">{children}</div>
        <section className="mt-14 pt-8 border-t hairline">
          <p className="eyebrow text-coral">Sources</p>
          <ul className="mt-4 grid gap-3 text-sm">
            {sources.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-coral border-b border-coral pb-0.5 hover:text-coral-dark hover:border-coral-dark"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-ink/50 leading-relaxed">
            I cite these so you can read the same pages I do. If a number or a rule has moved, the source is the authority.
          </p>
        </section>
        {related && related.length > 0 ? (
          <section className="mt-10">
            <p className="eyebrow text-coral">Keep reading</p>
            <ul className="mt-4 grid gap-2 text-sm">
              {related.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="text-coral border-b border-coral pb-0.5 hover:text-coral-dark">
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </article>
  )
}
