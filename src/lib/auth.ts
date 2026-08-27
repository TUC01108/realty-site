import { cookies } from "next/headers"
import { deskCookieName, deskPinFallback } from "./brand"

export function getDeskPin() {
  if (process.env.DESK_PIN) return process.env.DESK_PIN
  if (process.env.VERCEL || process.env.NODE_ENV === "production") return ""
  return deskPinFallback
}

export async function isDeskAuthed() {
  const jar = await cookies()
  return jar.get(deskCookieName)?.value === "ok"
}
