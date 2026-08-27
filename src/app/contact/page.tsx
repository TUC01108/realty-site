import ContactCTA from "@/components/ContactCTA";
import BlogTeaser from "@/components/BlogTeaser";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Contact Yordana Bolanos Salas in Hilo" },
  description:
    "Write to Yordana Bolanos Salas, RS-88323, Realtor with Coldwell Banker Island Properties, 101 Hualalai Street, Hilo, HI 96720.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <ContactCTA />
      <BlogTeaser />
    </>
  );
}
