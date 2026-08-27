import Link from "next/link"
import { getStore } from "@/lib/store"
import { PipelineBoard } from "@/components/desk/PipelineBoard"

export default async function PipelinePage() {
  const store = await getStore()
  const lost = store.leads.filter((l) => l.stage === "lost")
  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-coral">Pipeline</h1>
          <p className="text-sm text-ink/60">Do not park Hot files in New overnight.</p>
        </div>
        <Link href="/desk/leads/new" className="rounded-sm bg-coral px-4 py-2 text-sm font-medium text-paper">
          Add a lead
        </Link>
      </div>
      <PipelineBoard leads={store.leads} />
      {lost.length > 0 ? (
        <p className="text-xs text-ink/50">{lost.length} lost file(s) hidden from the board.</p>
      ) : null}
    </div>
  )
}
