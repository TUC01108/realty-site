import { notFound } from "next/navigation"
import Link from "next/link"
import { addNote, setStage, updateLeadFields } from "@/actions/desk"
import { CopyButton } from "@/components/desk/CopyButton"
import { DocRow } from "@/components/desk/DocRow"
import { IntentBadge, StageBadge, TypeMark } from "@/components/desk/badges"
import { areaOptions, getArea } from "@/lib/areas"
import {
  financingLabels,
  occupancyLabels,
  sourceLabels,
  stageLabels,
  timelineLabels,
  wastewaterLabels,
  waterLabels,
} from "@/lib/brand"
import { packetProgress } from "@/lib/documents"
import { formatWhen, money, relativeDue, telHref, mailtoHref } from "@/lib/format"
import { dealPrice, gci, sellerNetEstimate, weightedGci } from "@/lib/revenue"
import { getStore } from "@/lib/store"
import { buyerFirstText, buyerMatchesEmail, sellerFirstText, sellerNetEmail } from "@/lib/templates"
import type { Stage } from "@/lib/types"

const stages: Stage[] = ["new", "contacted", "qualified", "active", "under_contract", "closed", "lost"]

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const store = await getStore()
  const lead = store.leads.find((l) => l.id === id)
  if (!lead) notFound()
  const activities = store.activities.filter((a) => a.leadId === id)
  const area = getArea(lead.areaSlug)
  const progress = packetProgress(lead.documents)
  const net = lead.type === "seller" ? sellerNetEstimate(lead) : null
  const firstText = lead.type === "seller" ? sellerFirstText(lead) : buyerFirstText(lead)
  const emailTpl =
    lead.type === "seller"
      ? sellerNetEmail(lead, store.settings.agentName)
      : buyerMatchesEmail(lead, store.settings.agentName)

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <div className="grid gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <TypeMark type={lead.type} />
            <StageBadge stage={lead.stage} />
            <IntentBadge band={lead.intentBand} score={lead.intentScore} />
            {lead.isSample ? <span className="text-[11px] text-ink/40">Sample file</span> : null}
          </div>
          <h1 className="mt-2 font-display text-3xl text-coral">{lead.name}</h1>
          <p className="mt-1 text-sm text-ink/60">
            {area.name}
            {lead.address ? ` · ${lead.address}` : ""} · {sourceLabels[lead.source]}
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            {telHref(lead.phone) ? (
              <a className="text-coral hover:underline" href={telHref(lead.phone)}>
                {lead.phone}
              </a>
            ) : null}
            {mailtoHref(lead.email, emailTpl.subject) ? (
              <a className="text-coral hover:underline" href={mailtoHref(lead.email, emailTpl.subject, emailTpl.body)}>
                {lead.email}
              </a>
            ) : null}
          </div>
        </div>

        <section className="rounded-sm bg-paper p-4 ring-1 ring-line">
          <h2 className="text-sm font-medium">Why this is {lead.intentBand}</h2>
          <ul className="mt-2 grid gap-1 text-sm text-ink/60">
            {lead.scoreReasons.map((r) => (
              <li key={r}>• {r}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm">
            Next: {lead.nextAction} <span className="text-ink/50">({relativeDue(lead.nextActionAt)})</span>
          </p>
        </section>

        <section className="rounded-sm bg-paper p-4 ring-1 ring-line">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-xl">First outreach</h2>
            <CopyButton text={firstText} label="Copy text" />
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm text-ink/70">{firstText}</p>
          <div className="mt-4 flex items-center justify-between gap-2">
            <p className="text-sm font-medium">{emailTpl.subject}</p>
            <CopyButton text={`${emailTpl.subject}\n\n${emailTpl.body}`} label="Copy email" />
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm text-ink/70">{emailTpl.body}</p>
        </section>

        <section className="rounded-sm bg-paper p-4 ring-1 ring-line">
          <h2 className="font-display text-xl">Log a touch</h2>
          <form action={addNote} className="mt-3 grid gap-3">
            <input type="hidden" name="id" value={lead.id} />
            <select name="activityType" defaultValue="call" className="h-10 w-40 border hairline bg-paper px-2 text-sm">
              <option value="call">Call</option>
              <option value="sms">Text</option>
              <option value="email">Email</option>
              <option value="note">Note</option>
            </select>
            <textarea name="body" required placeholder="What happened, what they said, next step." className="min-h-24 border hairline bg-paper px-2 py-2 text-sm" />
            <button type="submit" className="w-fit rounded-sm bg-coral px-4 py-2 text-sm text-paper">
              Save to file
            </button>
          </form>
          <ol className="mt-6 grid gap-3">
            {activities.map((a) => (
              <li key={a.id} className="border-t hairline pt-3 text-sm">
                <p className="eyebrow text-ink/40">
                  {a.type} · {formatWhen(a.createdAt)}
                </p>
                <p className="mt-1 whitespace-pre-wrap">{a.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-sm bg-paper p-4 ring-1 ring-line">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">Packet {progress.percent}%</h2>
            <Link href={`/desk/leads/${lead.id}/packet`} className="text-sm text-coral hover:underline">
              Open printable packet
            </Link>
          </div>
          <ul className="mt-2">
            {lead.documents.map((doc) => (
              <DocRow key={doc.id} leadId={lead.id} doc={doc} />
            ))}
          </ul>
        </section>

        <section className="rounded-sm bg-paper p-4 ring-1 ring-line">
          <h2 className="font-display text-xl">File details</h2>
          <form action={updateLeadFields} className="mt-4 grid gap-4 sm:grid-cols-2">
            <input type="hidden" name="id" value={lead.id} />
            <input type="hidden" name="type" value={lead.type} />
            <input type="hidden" name="source" value={lead.source} />
            <Text name="name" label="Name" defaultValue={lead.name} />
            <Text name="phone" label="Phone" defaultValue={lead.phone} />
            <Text name="email" label="Email" defaultValue={lead.email} />
            <Text name="address" label="Address" defaultValue={lead.address} />
            <label className="grid gap-1.5 text-sm">
              Area
              <select name="areaSlug" defaultValue={lead.areaSlug} className="h-10 border hairline bg-paper px-2">
                {areaOptions.map((o) => (
                  <option key={o.slug} value={o.slug}>
                    {o.name}
                  </option>
                ))}
              </select>
            </label>
            <Sel name="timeline" label="Timeline" value={lead.timeline} opts={timelineLabels} />
            <Sel name="occupancy" label="Occupancy" value={lead.occupancy} opts={occupancyLabels} />
            <Sel name="financing" label="Financing" value={lead.financing} opts={financingLabels} />
            <Sel name="water" label="Water" value={lead.water} opts={waterLabels} />
            <Sel name="wastewater" label="Wastewater" value={lead.wastewater} opts={wastewaterLabels} />
            <Text name="estimatedValue" label="Estimated value" defaultValue={lead.estimatedValue ? String(lead.estimatedValue) : ""} />
            <Text name="listPrice" label="List price" defaultValue={lead.listPrice ? String(lead.listPrice) : ""} />
            <Text name="contractPrice" label="Contract price" defaultValue={lead.contractPrice ? String(lead.contractPrice) : ""} />
            <Text name="commissionRate" label="Side commission rate" defaultValue={String(lead.commissionRate)} />
            <Text name="nextAction" label="Next action" defaultValue={lead.nextAction} />
            <label className="grid gap-1.5 text-sm sm:col-span-2">
              Motivation
              <textarea name="motivation" defaultValue={lead.motivation} className="min-h-20 border hairline bg-paper px-2 py-2" />
            </label>
            <div className="sm:col-span-2">
              <button type="submit" className="rounded-sm bg-coral px-4 py-2 text-sm text-paper">
                Save file
              </button>
            </div>
          </form>
        </section>
      </div>

      <aside className="grid h-fit gap-4 lg:sticky lg:top-20">
        <div className="rounded-sm bg-coral p-4 text-paper">
          <p className="eyebrow text-paper/70">Money</p>
          <p className="mt-1 font-display text-3xl">{money(dealPrice(lead))}</p>
          <p className="mt-2 text-sm text-paper/80">
            Side GCI {money(gci(lead))} · weighted {money(weightedGci(lead))}
          </p>
          {net ? <p className="mt-2 text-sm text-paper/80">Rough seller net {money(net.net)}.</p> : null}
        </div>
        <form action={setStage} className="rounded-sm bg-paper p-4 ring-1 ring-line">
          <p className="text-sm font-medium">Stage</p>
          <input type="hidden" name="id" value={lead.id} />
          <select name="stage" defaultValue={lead.stage} className="mt-2 h-10 w-full border hairline bg-paper px-2 text-sm">
            {stages.map((s) => (
              <option key={s} value={s}>
                {stageLabels[s]}
              </option>
            ))}
          </select>
          <button type="submit" className="mt-3 w-full rounded-sm border hairline py-2 text-sm">
            Move stage
          </button>
        </form>
      </aside>
    </div>
  )
}

function Text({ name, label, defaultValue }: { name: string; label: string; defaultValue?: string }) {
  return (
    <label className="grid gap-1.5 text-sm">
      {label}
      <input name={name} defaultValue={defaultValue} className="h-10 border hairline bg-paper px-2" />
    </label>
  )
}

function Sel({ name, label, value, opts }: { name: string; label: string; value: string; opts: Record<string, string> }) {
  return (
    <label className="grid gap-1.5 text-sm">
      {label}
      <select name={name} defaultValue={value} className="h-10 border hairline bg-paper px-2">
        {Object.entries(opts).map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  )
}
