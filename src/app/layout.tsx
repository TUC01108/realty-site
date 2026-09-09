import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import ChatWidget from "@/components/ChatWidget";

const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], weight: ["400","500","600","700"] });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"], weight: ["400","500","600"] });

const SITE_URL = "https://www.yourbigislandrealestate.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Your Big Island Real Estate | Yordana Bolanos Salas",
    template: "%s | Your Big Island Real Estate",
  },
  description:
    "Yordana Bolanos Salas is a trusted Coldwell Banker REALTOR® on Hawai'i Island. Helping buyers, sellers, and investors across all nine Big Island districts. RS-88323.",
  keywords: [
    "Big Island real estate","Hawaii homes for sale","Hilo real estate agent",
    "Kona real estate","Hawaii REALTOR","Coldwell Banker Hawaii","Hawai'i Island homes",
    "buy home Big Island","sell home Hawaii","Yordana Bolanos Salas",
  ],
  authors: [{ name: "Yordana Bolanos Salas" }],
  creator: "Yordana Bolanos Salas",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Your Big Island Real Estate",
    title: "Your Big Island Real Estate | Yordana Bolanos Salas",
    description: "Meaningful journeys in buying and selling homes across Hawai'i Island. Coldwell Banker Island Properties. RS-88323.",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "Aerial view of Waipio Valley, Hawai'i Island" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Big Island Real Estate | Yordana Bolanos Salas",
    description: "Meaningful journeys in buying and selling homes across Hawai'i Island.",
    images: ["/images/og-image.jpg"],
  },
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <JsonLd />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
