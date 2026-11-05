import { DISPLAY_BROKER } from "@/lib/listings/broker";
import type { ListingSourceId } from "@/lib/listings/types";

export function PreviewBanner({ sourceId }: { sourceId: ListingSourceId }) {
  const sample = sourceId === "sample";
  return (
    <div className="bg-coral text-paper">
      <div className="mx-auto max-w-6xl px-6 py-3 lg:px-8">
        <p className="text-sm font-medium">{sample ? "Preview, sample listings" : "Listing search preview"}</p>
        <p className="mt-1 text-sm leading-relaxed text-paper/90">
          {sample
            ? "These properties are fictional samples for review. Hawaii Information Service data is not connected, and this page is not in the public menu."
            : "This search is still off the public menu. Confirm the IDX logo, disclaimer, and broker approval before linking it."}
        </p>
      </div>
    </div>
  );
}

export function DisplayBroker() {
  return (
    <div className="border-b hairline bg-sand">
      <p className="mx-auto max-w-6xl px-6 py-3 text-sm leading-relaxed text-ink lg:px-8">
        <span className="font-medium">Displayed by {DISPLAY_BROKER.brokerage}.</span>{" "}
        {DISPLAY_BROKER.agent}, {DISPLAY_BROKER.license}. {DISPLAY_BROKER.street}, {DISPLAY_BROKER.cityLine}.{" "}
        <a className="underline decoration-line underline-offset-2" href={DISPLAY_BROKER.phoneHref}>{DISPLAY_BROKER.phone}</a>
        {" · "}
        <a className="underline decoration-line underline-offset-2" href={`mailto:${DISPLAY_BROKER.email}`}>{DISPLAY_BROKER.email}</a>
      </p>
    </div>
  );
}

export function IdxNotice({ sourceId }: { sourceId: ListingSourceId }) {
  return (
    <div className="border-t hairline bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-start lg:px-8">
        <div className="flex h-16 w-40 shrink-0 items-center justify-center rounded-sm border border-dashed border-ink/40 bg-sand text-sm font-medium text-ink">
          IDX logo
        </div>
        <div className="text-sm leading-relaxed text-ink">
          <p className="font-medium">IDX logo and disclaimer placeholder</p>
          <p className="mt-1">
            Put the Hawaii Information Service IDX logo in this box when the license is issued, and replace this paragraph with the disclaimer HIS requires.
            {sourceId === "sample" ? " These samples are not offers to sell real property." : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
