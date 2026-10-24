import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "What Is My Home Worth? | Free Big Island Home Valuation",
  description: "Get a free home valuation for your Hawai'i Island property. Yordana Bolanos Salas provides expert Comparative Market Analysis for sellers across all nine Big Island districts.",
  alternates: { canonical: "https://www.yourbigislandrealestate.com/valuation" },
  openGraph: {
    title: "Free Home Valuation | Your Big Island Real Estate",
    description: "Yordana Bolanos Salas reviews your Hawai'i Island property herself and emails a personal valuation within 24 hours.",
    url: "https://www.yourbigislandrealestate.com/valuation",
  },
};
export default function ValuationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
