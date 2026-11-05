import { phoneHref } from "@/lib/listings/broker";
import type { ListingOffice } from "@/lib/listings/types";

export default function ListingOfficeBlock({ office, compact = false }: { office: ListingOffice; compact?: boolean }) {
  const text = compact ? "text-sm" : "text-base";
  return (
    <div>
      <p className="eyebrow text-ink/70">Listing firm</p>
      <p className={`mt-2 font-medium text-ink ${text}`}>{office.name}</p>
      <p className={`mt-1 text-ink ${text}`}>
        <a className="underline decoration-line underline-offset-2" href={phoneHref(office.phone)}>{office.phone}</a>
      </p>
      {office.email && (
        <p className={`mt-1 break-all text-ink ${text}`}>
          <a className="underline decoration-line underline-offset-2" href={`mailto:${office.email}`}>{office.email}</a>
        </p>
      )}
    </div>
  );
}
