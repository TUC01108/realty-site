import Link from "next/link"
import { setStage } from "@/actions/desk"
import { IntentBadge, TypeMark } from "@/components/desk/badges"
import { stageHints, stageLabels } from "@/lib/brand"
import { money, relativeDue } from "@/lib/format"
import { dealPrice, gci } from "@/lib/revenue"
import { getArea } from "@/lib/areas"
import type { Lead, Stage } from "@/lib/types"

const columns: Stage[] = ["new", "contacted", "qualified", "active", "under_contract", "closed"]

function nextStage(stage: Stage): Stage | null {
  const i = columns.indexOf(stage)
  if (i === -1 || i === columns.length - 1) return null
  return columns[i + 1]
}

export function PipelineBoard({ leads }: { leads: Lead[] }) {
  const open = leads.filter((l) => l.stage !== "lost")
  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {columns.map((stage) => {
        const col = open.filter((l) => l.stage === stage)
        return (
          <section key={stage} className="w-[260px] shrink-0 rounded-sm bg-paper p-2 ring-1 ring-line">
            <header className="mb-2 px-1">
              <div className="flex items-baseline justify-between">
                <h2 className="text-sm font-medium">{stageLabels[stage]}</h2>
                <span className="text-xs text-ink/50">{col.length}</span>
              </div>
              <p className="text-[11px] leading-snug text-ink/50">{stageHints[stage]}</p>
            </header>
            <div className="grid gap-2">
              {col.length === 0 ? (
                <p className="rounded-sm border border-dashed border-line px-3 py-6 text-center text-xs text-ink/40">
                  Empty
                </p>
              ) : (
                col.map((lead) => {
                  const nxt = nextStage(lead.stage)
                  return (
                    <article
                      key={lead.id}
                      className={`rounded-sm bg-sand p-3 ${lead.intentBand === "hot" ? "ring-1 ring-coral/50" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/desk/leads/${lead.id}`} className="font-medium leading-tight hover:text-coral">
                          {lead.name}
                        </Link>
                        <TypeMark type={lead.type} />
                      </div>
                      <p className="mt-1 text-xs text-ink/50">
                        {getArea(lead.areaSlug).name}
                        {dealPrice(lead) ? ` · ${money(dealPrice(lead))}` : ""}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-1">
                        <IntentBadge band={lead.intentBand} score={lead.intentScore} />
                        <span className="text-[11px] text-ink/50">GCI {money(gci(lead))}</span>
                      </div>
                      <p className="mt-2 text-[11px] text-ink/50">
                        {lead.nextAction} · {relativeDue(lead.nextActionAt)}
                      </p>
                      {nxt ? (
                        <form action={setStage} className="mt-2">
                          <input type="hidden" name="id" value={lead.id} />
                          <input type="hidden" name="stage" value={nxt} />
                          <button type="submit" className="text-[11px] text-coral hover:underline">
                            Advance to {stageLabels[nxt]}
                          </button>
                        </form>
                      ) : null}
                    </article>
                  )
                })
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}
