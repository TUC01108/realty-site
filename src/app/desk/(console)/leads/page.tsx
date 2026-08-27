import Link from "next/link"
import { getStore } from "@/lib/store"
import { IntentBadge, StageBadge, TypeMark } from "@/components/desk/badges"
import { getArea } from "@/lib/areas"
import { formatWhen, money, relativeDue } from "@/lib/format"
import { dealPrice } from "@/lib/revenue"
import { sourceLabels } from "@/lib/brand"

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; band?: string }>
}) {
  const q = await searchParams
  const store = await getStore()
  let leads = store.leads
  if (q.type === "seller" || q.type === "buyer") leads = leads.filter((l) => l.type === q.type)
  if (q.band) leads = leads.filter((l) => l.intentBand === q.band)

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-coral">Leads</h1>
          <p className="text-sm text-ink/50">{leads.length} files</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Filter href="/desk/leads" active={!q.type && !q.band} label="All" />
          <Filter href="/desk/leads?type=seller" active={q.type === "seller"} label="Sellers" />
          <Filter href="/desk/leads?type=buyer" active={q.type === "buyer"} label="Buyers" />
          <Filter href="/desk/leads?band=hot" active={q.band === "hot"} label="Hot" />
          <Link href="/desk/leads/new" className="rounded-sm bg-coral px-3 py-1 text-sm text-paper">
            Add
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto rounded-sm bg-paper ring-1 ring-line">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b hairline text-xs text-ink/50">
            <tr>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Intent</th>
              <th className="px-3 py-2 font-medium">Stage</th>
              <th className="px-3 py-2 font-medium">Area</th>
              <th className="px-3 py-2 font-medium">Price</th>
              <th className="px-3 py-2 font-medium">Follow-up</th>
              <th className="px-3 py-2 font-medium">In</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b hairline last:border-0">
                <td className="px-3 py-2.5">
                  <Link href={`/desk/leads/${lead.id}`} className="font-medium hover:text-coral">
                    {lead.name}
                  </Link>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <TypeMark type={lead.type} />
                    <span className="text-[11px] text-ink/50">{sourceLabels[lead.source]}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <IntentBadge band={lead.intentBand} score={lead.intentScore} />
                </td>
                <td className="px-3 py-2.5">
                  <StageBadge stage={lead.stage} />
                </td>
                <td className="px-3 py-2.5 text-ink/60">{getArea(lead.areaSlug).name}</td>
                <td className="px-3 py-2.5">{money(dealPrice(lead))}</td>
                <td className="px-3 py-2.5 text-ink/60">{relativeDue(lead.nextActionAt)}</td>
                <td className="px-3 py-2.5 text-ink/60">{formatWhen(lead.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Filter({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={active ? "rounded-sm bg-coral px-3 py-1 text-sm text-paper" : "rounded-sm bg-sand px-3 py-1 text-sm text-ink/60"}
    >
      {label}
    </Link>
  )
}
