import { notFound } from "next/navigation"
import { DocRow } from "@/components/desk/DocRow"
import { PrintButton } from "@/components/desk/PrintButton"
import { getArea } from "@/lib/areas"
import { occupancyLabels, timelineLabels, wastewaterLabels, waterLabels } from "@/lib/brand"
import { packetProgress } from "@/lib/documents"
import { formatDay, money } from "@/lib/format"
import { dealPrice, sellerNetEstimate } from "@/lib/revenue"
import { getStore } from "@/lib/store"

export default async function PacketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const store = await getStore()
  const lead = store.leads.find((l) => l.id === id)
  if (!lead) notFound()
  const area = getArea(lead.areaSlug)
  const progress = packetProgress(lead.documents)
  const net = lead.type === "seller" ? sellerNetEstimate(lead) : null
  const s = store.settings
  const rows = [
    ["Client", lead.name],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["Type", lead.type],
    ["Property", lead.address || "—"],
    ["Area", area.name],
    ["Timeline", timelineLabels[lead.timeline]],
    ["Occupancy", occupancyLabels[lead.occupancy]],
    ["Water", waterLabels[lead.water]],
    ["Wastewater", wastewaterLabels[lead.wastewater]],
    ["Price in file", money(dealPrice(lead))],
    ["Agent", s.agentName],
    ["Brokerage", s.brokerage],
    ["License", s.license || "—"],
  ]

  return (
    <article className="mx-auto max-w-3xl">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow text-coral">Working packet · not a HAR form</p>
          <h1 className="mt-1 font-display text-3xl text-coral">
            {lead.type === "seller" ? "Listing" : "Buyer"} packet · {lead.name}
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            Prepared {formatDay(new Date().toISOString())} · {progress.percent}% started. Transfer these facts into official brokerage / HAR documents.
          </p>
        </div>
        <PrintButton />
      </header>
      <section className="mt-8 overflow-hidden rounded-sm ring-1 ring-line">
        <table className="w-full text-sm">
          <tbody>
            {rows.map(([k, v]) => (
              <tr key={k} className="border-b hairline last:border-0">
                <th className="w-40 bg-sand px-3 py-2 text-left font-medium">{k}</th>
                <td className="bg-paper px-3 py-2">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {net ? (
        <section className="mt-6 rounded-sm bg-sand p-4">
          <h2 className="font-display text-2xl">Draft seller net</h2>
          <ul className="mt-2 grid gap-1 text-sm">
            <li>Price {money(net.price)}</li>
            <li>Commission placeholder {money(net.commission)}</li>
            <li>Closing placeholder {money(net.closing)}</li>
            {net.cesspool ? <li>Cesspool placeholder {money(net.cesspool)}</li> : null}
            <li className="font-medium">Estimated net {money(net.net)}</li>
          </ul>
        </section>
      ) : null}
      <section className="mt-8">
        <h2 className="font-display text-2xl">Document checklist</h2>
        <ul className="mt-2 rounded-sm bg-paper px-4 ring-1 ring-line">
          {lead.documents.map((doc) => (
            <DocRow key={doc.id} leadId={lead.id} doc={doc} />
          ))}
        </ul>
      </section>
    </article>
  )
}
