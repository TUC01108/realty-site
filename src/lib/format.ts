const honolulu = "Pacific/Honolulu"

export function money(n: number | null | undefined, fallback = "—") {
  if (n === null || n === undefined || Number.isNaN(n)) return fallback
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n)
}

export function moneyShort(n: number) {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `$${Math.round(n / 1_000)}k`
  return money(n)
}

export function percent(n: number) {
  return `${Math.round(n * 1000) / 10}%`
}

export function formatWhen(iso: string | null | undefined) {
  if (!iso) return "—"
  return new Date(iso).toLocaleString("en-US", {
    timeZone: honolulu,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function formatDay(iso: string | null | undefined) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-US", {
    timeZone: honolulu,
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function relativeDue(iso: string | null) {
  if (!iso) return "No follow-up set"
  const due = new Date(iso).getTime()
  const now = Date.now()
  const deltaH = Math.round((due - now) / (1000 * 60 * 60))
  if (deltaH < -24) return `${Math.abs(Math.round(deltaH / 24))}d overdue`
  if (deltaH < 0) return "Overdue"
  if (deltaH < 4) return "Due now"
  if (deltaH < 24) return `Due in ${deltaH}h`
  return `Due in ${Math.round(deltaH / 24)}d`
}

export function isOverdue(iso: string | null) {
  if (!iso) return false
  return new Date(iso).getTime() < Date.now()
}

export function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "")
  return digits ? `tel:${digits}` : undefined
}

export function smsHref(phone: string, body?: string) {
  const digits = phone.replace(/[^\d+]/g, "")
  if (!digits) return undefined
  return body ? `sms:${digits}?&body=${encodeURIComponent(body)}` : `sms:${digits}`
}

export function mailtoHref(email: string, subject?: string, body?: string) {
  if (!email) return undefined
  const q = new URLSearchParams()
  if (subject) q.set("subject", subject)
  if (body) q.set("body", body)
  const qs = q.toString()
  return `mailto:${email}${qs ? `?${qs}` : ""}`
}

export function id(prefix: string) {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`
}

export function parseMoney(value: FormDataEntryValue | null) {
  if (value === null || value === "") return null
  const n = Number(String(value).replace(/[^0-9.]/g, ""))
  return Number.isFinite(n) && n > 0 ? n : null
}

export function expectedGci(price: number | null, rate: number) {
  if (!price) return 0
  return Math.round(price * rate)
}
