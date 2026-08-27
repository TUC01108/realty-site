"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function SiteShell({ children }: { children: ReactNode }) {
  const path = usePathname()
  if (path.startsWith("/desk")) {
    return <div className="flex min-h-full flex-col bg-sand">{children}</div>
  }
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
