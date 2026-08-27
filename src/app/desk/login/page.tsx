import { loginDesk } from "@/actions/desk"
import { brand, deskPinFallback } from "@/lib/brand"
import { getDeskPin, isDeskAuthed } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  if (await isDeskAuthed()) redirect("/desk")
  const { error } = await searchParams
  const pin = getDeskPin()
  const showHint = Boolean(!process.env.DESK_PIN && pin)

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col justify-center px-4 py-16">
      <p className="eyebrow text-coral">{brand.agentName}</p>
      <h1 className="mt-2 font-display text-4xl text-coral">Yordana&apos;s desk</h1>
      <p className="mt-3 text-sm text-ink/70">
        Private pipeline for leads from this site. Lock it on the phone she actually carries.
      </p>
      <form action={loginDesk} className="mt-8 grid gap-3">
        <label htmlFor="pin" className="eyebrow text-ink/60">
          Desk PIN
        </label>
        <input
          id="pin"
          name="pin"
          type="password"
          required
          autoFocus
          className="border-b border-ink/30 bg-transparent py-2 text-sm focus:border-coral focus:outline-none"
        />
        {error ? (
          <p className="text-sm text-coral">
            {pin ? "That PIN did not match." : "Set DESK_PIN in the host environment before using the desk."}
          </p>
        ) : null}
        {showHint ? (
          <p className="text-xs text-ink/50">
            Local default is <code>{deskPinFallback}</code>. Set DESK_PIN before this is public.
          </p>
        ) : null}
        <button type="submit" className="mt-2 rounded-sm bg-coral px-6 py-3 text-sm font-medium text-paper hover:bg-coral-dark">
          Open desk
        </button>
      </form>
    </main>
  )
}
