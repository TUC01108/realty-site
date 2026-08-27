import { redirect } from "next/navigation"
import type { ReactNode } from "react"
import DeskNav from "@/components/desk/DeskNav"
import { isDeskAuthed } from "@/lib/auth"

export default async function DeskLayout({ children }: { children: ReactNode }) {
  if (!(await isDeskAuthed())) redirect("/desk/login")
  return (
    <div className="flex min-h-full flex-col">
      <DeskNav />
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">{children}</div>
    </div>
  )
}
