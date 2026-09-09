import type { Metadata } from "next";
import Hero from "@/components/Hero";
import BuySellConnect from "@/components/BuySellConnect";
import AboutTeaser from "@/components/AboutTeaser";
import WelcomeVideo from "@/components/WelcomeVideo";
import BrandBanner from "@/components/BrandBanner";
import Neighborhoods from "@/components/Neighborhoods";
import ContactCTA from "@/components/ContactCTA";

export const metadata: Metadata = {
  title: "Your Big Island Real Estate | Yordana Bolanos Salas, REALTOR®",
  description:
    "Meaningful journeys in buying and selling homes across Hawai'i Island. Work with Yordana Bolanos Salas, your trusted Coldwell Banker REALTOR® serving all nine Big Island districts.",
  alternates: { canonical: "https://www.yourbigislandrealestate.com" },
  openGraph: {
    title: "Your Big Island Real Estate | Yordana Bolanos Salas",
    description: "Meaningful journeys in buying and selling homes across Hawai'i Island.",
    url: "https://www.yourbigislandrealestate.com",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <BuySellConnect />
      <AboutTeaser />
      <WelcomeVideo />
      <BrandBanner />
      <Neighborhoods />
      <ContactCTA />
    </>
  );
}
