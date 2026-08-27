import { setDocStatus } from "@/actions/desk"
import { docStatusLabels } from "@/lib/documents"
import type { DocStatus, DocumentItem } from "@/lib/types"

const statuses: DocStatus[] = ["pending", "prepared", "sent", "signed", "filed", "not_needed"]

export function DocRow({ leadId, doc }: { leadId: string; doc: DocumentItem }) {
  return (
    <li className="grid gap-2 border-b hairline py-3 last:border-0 sm:grid-cols-[1fr_200px] sm:items-start">
      <div>
        <p className="font-medium">{doc.name}</p>
        <p className="text-xs text-ink/50">{doc.category}</p>
        <p className="mt-1 text-sm text-ink/60">{doc.why}</p>
        {doc.notes ? <p className="mt-1 text-xs">{doc.notes}</p> : null}
      </div>
      <form action={setDocStatus} className="flex items-center gap-2">
        <input type="hidden" name="leadId" value={leadId} />
        <input type="hidden" name="docId" value={doc.id} />
        <select name="status" defaultValue={doc.status} className="h-9 w-full border hairline bg-paper px-2 text-sm">
          {statuses.map((s) => (
            <option key={s} value={s}>
              {docStatusLabels[s]}
            </option>
          ))}
        </select>
        <button type="submit" className="text-xs text-coral underline-offset-2 hover:underline">
          Save
        </button>
      </form>
    </li>
  )
}
