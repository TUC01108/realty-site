import ContactCTA from "@/components/ContactCTA";
import BlogTeaser from "@/components/BlogTeaser";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Contact Yordana | Your Big Island Real Estate",
  description: "Reach out to Yordana Bolanos Salas — your trusted Hawai\'i Island REALTOR® with Coldwell Banker Island Properties. Call, email, or fill out the form and she\'ll follow up personally.",
  alternates: { canonical: "https://www.yourbigislandrealestate.com/contact" },
};
export default function ContactPage() { return (<><ContactCTA /><BlogTeaser /></>); }
