import ContactCTA from "@/components/ContactCTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Yordana | Your Big Island Real Estate",
  description:
    "Reach out to Yordana Bolanos Salas, your trusted Hawai'i Island real estate advisor. Coldwell Banker Island Properties.",
};

export default function ContactPage() {
  return <ContactCTA />;
}
