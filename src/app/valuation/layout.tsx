import type { Metadata } from "next"
import { brand } from "@/lib/brand"

export const metadata: Metadata = {
  title: "What Is My Home Worth?",
  description: `Request a home valuation from ${brand.agentName}, ${brand.license}, ${brand.brokerage} in Hilo. This is a conversation, not an automated estimate.`,
  alternates: { canonical: "/valuation" },
}

export default function ValuationLayout({ children }: { children: React.ReactNode }) {
  return children
}
