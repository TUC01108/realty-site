import type { IntentBand, Stage } from "@/lib/types"
import { stageLabels } from "@/lib/brand"

export function IntentBadge({ band, score }: { band: IntentBand; score?: number }) {
  const cls =
    band === "hot"
      ? "bg-coral text-paper"
      : band === "warm"
        ? "bg-ink text-paper"
        : "bg-sand text-ink/70"
  return (
    <span className={`inline-flex rounded-sm px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${cls}`}>
      {band}
      {typeof score === "number" ? ` ${score}` : ""}
    </span>
  )
}

export function StageBadge({ stage }: { stage: Stage }) {
  return (
    <span className="inline-flex rounded-sm border hairline px-2 py-0.5 text-[11px] uppercase tracking-wide text-ink/70">
      {stageLabels[stage]}
    </span>
  )
}

export function TypeMark({ type }: { type: "seller" | "buyer" }) {
  return (
    <span className="inline-flex rounded-sm bg-sand px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-ink/80">
      {type}
    </span>
  )
}
