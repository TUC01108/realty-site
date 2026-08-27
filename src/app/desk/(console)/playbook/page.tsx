import { getStore } from "@/lib/store"
import { playbook } from "@/lib/templates"
import { pipelineStats } from "@/lib/revenue"
import { money } from "@/lib/format"
import { brand } from "@/lib/brand"

export default async function PlaybookPage() {
  const store = await getStore()
  const stats = pipelineStats(store.leads, store.settings)
  return (
    <div className="mx-auto grid max-w-3xl gap-8">
      <div>
        <h1 className="font-display text-3xl text-coral">How this pays for itself</h1>
        <p className="mt-3 text-ink/70">
          Cursor Pro is {money(store.settings.proPrice)}/month. Ultra is {money(store.settings.ultraPrice)}/month.
          One listing or buyer side on a {brand.island} home routinely covers that for a year.
        </p>
        <div className="mt-4 rounded-sm bg-paper p-4 text-sm ring-1 ring-line">
          <p>
            Closed GCI in the desk: <strong>{money(stats.closedGci)}</strong>
          </p>
          <p className="mt-1">
            Weighted pipeline: <strong>{money(stats.weighted)}</strong>
          </p>
        </div>
      </div>
      <div className="grid gap-4">
        {playbook.map((item) => (
          <article key={item.id} className="rounded-sm bg-paper p-5 ring-1 ring-line">
            <p className="eyebrow text-ink/50">
              {item.effort} · {item.revenue}
            </p>
            <h2 className="mt-1 font-display text-2xl">{item.title}</h2>
            <p className="mt-2 text-sm text-ink/60">{item.why}</p>
            <ol className="mt-3 grid gap-1 text-sm">
              {item.steps.map((step, i) => (
                <li key={step}>
                  {i + 1}. {step}
                </li>
              ))}
            </ol>
          </article>
        ))}
      </div>
    </div>
  )
}
