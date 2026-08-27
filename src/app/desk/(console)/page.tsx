import Link from "next/link"
import { getStore } from "@/lib/store"
import { pipelineStats, gci, dealPrice, weightedGci } from "@/lib/revenue"
import { money, relativeDue, isOverdue } from "@/lib/format"
import { IntentBadge, TypeMark } from "@/components/desk/badges"
import { getArea } from "@/lib/areas"
import { packetProgress } from "@/lib/documents"

export default async function DeskHome() {
  const store = await getStore()
  const stats = pipelineStats(store.leads, store.settings)
  const active = store.leads.filter((l) => !["closed", "lost"].includes(l.stage))
  const due = active
    .filter((l) => l.nextActionAt)
    .sort((a, b) => (a.nextActionAt || "").localeCompare(b.nextActionAt || ""))
  const hot = active.filter((l) => l.intentBand === "hot")
  const escrow = active.filter((l) => l.stage === "under_contract")

  return (
    <div className="grid gap-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-coral">{store.settings.agentName}</p>
          <h1 className="font-display text-3xl text-coral sm:text-4xl">Work the files that pay.</h1>
        </div>
        <Link href="/desk/leads/new" className="rounded-sm bg-coral px-4 py-2 text-sm font-medium text-paper hover:bg-coral-dark">
          Add a lead
        </Link>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Weighted pipeline GCI" value={money(stats.weighted)} hint="Probability × expected commission" />
        <Stat
          label="Closed GCI (in desk)"
          value={money(stats.closedGci)}
          hint={`${stats.monthsPaid} months of Cursor ${store.settings.cursorPlan === "ultra" ? "Ultra" : "Pro"} covered`}
        />
        <Stat label="Hot files still open" value={String(stats.hotCount)} hint="Call these before anything else" />
        <Stat
          label="Cursor burn"
          value={`${money(stats.monthly)}/mo`}
          hint={
            stats.closedGci >= store.settings.ultraPrice
              ? "Ultra is mathematically fine."
              : `Need more closed GCI to justify Ultra this month`
          }
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl">Follow-ups</h2>
          <ul className="mt-3 divide-y divide-line rounded-sm bg-paper ring-1 ring-line">
            {due.length === 0 ? (
              <li className="p-4 text-sm text-ink/50">No dated follow-ups.</li>
            ) : (
              due.slice(0, 8).map((lead) => (
                <li key={lead.id}>
                  <Link href={`/desk/leads/${lead.id}`} className="flex items-start justify-between gap-3 p-4 hover:bg-sand">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{lead.name}</span>
                        <TypeMark type={lead.type} />
                        <IntentBadge band={lead.intentBand} />
                      </div>
                      <p className="mt-1 text-sm text-ink/60">{lead.nextAction}</p>
                    </div>
                    <span className={`shrink-0 text-xs ${isOverdue(lead.nextActionAt) ? "text-coral" : "text-ink/50"}`}>
                      {relativeDue(lead.nextActionAt)}
                    </span>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-2xl">Escrow packets</h2>
          <ul className="mt-3 divide-y divide-line rounded-sm bg-paper ring-1 ring-line">
            {escrow.length === 0 ? (
              <li className="p-4 text-sm text-ink/50">Nothing in escrow.</li>
            ) : (
              escrow.map((lead) => {
                const progress = packetProgress(lead.documents)
                return (
                  <li key={lead.id}>
                    <Link href={`/desk/leads/${lead.id}/packet`} className="block p-4 hover:bg-sand">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{lead.name}</span>
                        <span className="text-sm text-ink/50">{progress.percent}%</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-sm bg-sand">
                        <div className="h-full bg-coral" style={{ width: `${progress.percent}%` }} />
                      </div>
                    </Link>
                  </li>
                )
              })
            )}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl">Hot, still open</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {hot.length === 0 ? (
            <p className="text-sm text-ink/50">No Hot files. Share /valuation today.</p>
          ) : (
            hot.map((lead) => (
              <Link key={lead.id} href={`/desk/leads/${lead.id}`} className="rounded-sm bg-paper p-4 ring-1 ring-coral/30 hover:ring-coral">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{lead.name}</span>
                  <IntentBadge band={lead.intentBand} score={lead.intentScore} />
                </div>
                <p className="mt-1 text-sm text-ink/60">
                  {getArea(lead.areaSlug).name} · {lead.motivation || lead.nextAction}
                </p>
                <p className="mt-2 text-xs text-ink/50">
                  {money(dealPrice(lead))} · GCI {money(gci(lead))} · weighted {money(weightedGci(lead))}
                </p>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-sm bg-paper p-4 ring-1 ring-line">
      <p className="eyebrow text-ink/50">{label}</p>
      <p className="mt-1 font-display text-2xl text-coral">{value}</p>
      <p className="mt-1 text-xs text-ink/50">{hint}</p>
    </div>
  )
}
