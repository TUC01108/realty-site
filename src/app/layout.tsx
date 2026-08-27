import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/SiteShell";

const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], weight: ["400","500","600","700"] });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"], weight: ["400","500","600"] });

export const metadata: Metadata = {
  title: {
    default: "Your Big Island Real Estate | Yordana Bolanos Salas, Coldwell Banker",
    template: "%s | Your Big Island Real Estate",
  },
  description: "Meaningful journeys in buying and selling homes across Hawai'i Island, with Yordana Bolanos Salas, Coldwell Banker Island Properties.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}

