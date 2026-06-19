import Hero from "@/components/Hero";
import AboutTeaser from "@/components/AboutTeaser";
import FeaturedListings from "@/components/FeaturedListings";
import Testimonials from "@/components/Testimonials";
import Neighborhoods from "@/components/Neighborhoods";
import ContactCTA from "@/components/ContactCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutTeaser />
      <FeaturedListings />
      <Neighborhoods />
      <Testimonials />
      <ContactCTA />
    </>
  );
}
