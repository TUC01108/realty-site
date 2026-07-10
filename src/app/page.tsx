import Hero from "@/components/Hero";
import BuySellConnect from "@/components/BuySellConnect";
import AboutTeaser from "@/components/AboutTeaser";
import WelcomeVideo from "@/components/WelcomeVideo";
import BrandBanner from "@/components/BrandBanner";
import Neighborhoods from "@/components/Neighborhoods";
import Testimonials from "@/components/Testimonials";
import ContactCTA from "@/components/ContactCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <BuySellConnect />
      <AboutTeaser />
      <WelcomeVideo />
      <BrandBanner />
      <Neighborhoods />
      <Testimonials />
      <ContactCTA />
    </>
  );
}
