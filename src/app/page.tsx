import type { Metadata } from "next";
import Hero from "@/components/Hero";
import BuySellConnect from "@/components/BuySellConnect";
import AboutTeaser from "@/components/AboutTeaser";
import WelcomeVideo from "@/components/WelcomeVideo";
import BrandBanner from "@/components/BrandBanner";
import Neighborhoods from "@/components/Neighborhoods";
import ContactCTA from "@/components/ContactCTA";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: {
    absolute: brand.documentTitle,
  },
  description: brand.description,
  alternates: { canonical: "/" },
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
