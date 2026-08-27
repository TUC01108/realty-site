import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/SiteShell";
import JsonLd from "@/components/JsonLd";
import { brand } from "@/lib/brand";
import { localBusinessJsonLd, personJsonLd } from "@/lib/schema";

const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], weight: ["400","500","600","700"] });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"], weight: ["400","500","600"] });

export const metadata: Metadata = {
  metadataBase: new URL(brand.siteUrl),
  title: {
    default: "Yordana Bolanos Salas | Hilo & Big Island Real Estate",
    template: "%s | Yordana Bolanos Salas",
  },
  description: brand.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: brand.siteUrl,
    siteName: brand.name,
    title: "Yordana Bolanos Salas | Hilo & Big Island Real Estate",
    description: brand.description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <JsonLd data={personJsonLd()} />
        <JsonLd data={localBusinessJsonLd()} />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
