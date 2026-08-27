"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { logoutDesk } from "@/actions/desk"

const items = [
  { href: "/desk", label: "Today" },
  { href: "/desk/pipeline", label: "Pipeline" },
  { href: "/desk/leads", label: "Leads" },
  { href: "/desk/documents", label: "Packets" },
  { href: "/desk/playbook", label: "Playbook" },
  { href: "/desk/settings", label: "Settings" },
]

export default function DeskNav() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-40 border-b hairline bg-paper/95 backdrop-blur print:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/desk" className="shrink-0 font-display text-lg text-coral">
          Yordana&apos;s desk
        </Link>
        <nav className="flex flex-1 items-center gap-1 overflow-x-auto text-sm">
          {items.map((item) => {
            const active =
              item.href === "/desk"
                ? pathname === "/desk"
                : pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "rounded-sm bg-coral px-3 py-1.5 text-paper whitespace-nowrap"
                    : "rounded-sm px-3 py-1.5 text-ink/60 whitespace-nowrap hover:bg-sand"
                }
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="hidden items-center gap-3 sm:flex">
          <Link href="/" className="text-sm text-ink/50 hover:text-ink">
            Public site
          </Link>
          <form action={logoutDesk}>
            <button type="submit" className="rounded-sm border hairline px-3 py-1.5 text-sm hover:bg-sand">
              Lock
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
