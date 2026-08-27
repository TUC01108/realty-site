import Link from "next/link"
import { getStore } from "@/lib/store"
import { packetProgress } from "@/lib/documents"
import { money } from "@/lib/format"
import { dealPrice } from "@/lib/revenue"
import { TypeMark } from "@/components/desk/badges"
import { getArea } from "@/lib/areas"
import { stageLabels } from "@/lib/brand"

export default async function PacketsIndex() {
  const store = await getStore()
  const leads = store.leads.filter((l) => l.stage !== "lost")
  return (
    <div className="grid gap-4">
      <div>
        <h1 className="font-display text-3xl text-coral">Packets</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink/60">
          Official HAR forms stay at the brokerage. These packets gather facts and a checklist so Yordana is not rebuilding a file from texts.
        </p>
      </div>
      <ul className="grid gap-3">
        {leads.map((lead) => {
          const p = packetProgress(lead.documents)
          return (
            <li key={lead.id}>
              <Link href={`/desk/leads/${lead.id}/packet`} className="block rounded-sm bg-paper p-4 ring-1 ring-line hover:ring-coral/40">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{lead.name}</span>
                    <TypeMark type={lead.type} />
                    <span className="text-xs text-ink/50">{stageLabels[lead.stage]}</span>
                  </div>
                  <span className="text-sm text-ink/50">{p.percent}%</span>
                </div>
                <p className="mt-1 text-sm text-ink/60">
                  {getArea(lead.areaSlug).name}
                  {lead.address ? ` · ${lead.address}` : ""} · {money(dealPrice(lead))}
                </p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-sm bg-sand">
                  <div className="h-full bg-coral" style={{ width: `${p.percent}%` }} />
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
