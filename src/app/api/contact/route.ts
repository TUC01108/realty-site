import { NextRequest, NextResponse } from "next/server";
import { sendContactEmails } from "@/lib/email";
import { ingestPublicLead } from "@/lib/leads";
import type { LeadType } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message, interest } = await req.json();
    if (!name || !email || !phone) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const type: LeadType = interest === "sell" ? "seller" : "buyer";
    const created = await ingestPublicLead({
      type,
      source: "referral",
      name,
      email,
      phone,
      areaSlug: "island",
      timeline: "90_days",
      motivation: message || "",
      notes: message || "",
    });

    try {
      await sendContactEmails({ name, email, phone, message: message || "" });
    } catch (err) {
      console.error("Contact email failed; lead still saved:", err);
    }

    return NextResponse.json({ ok: true, band: created.band, score: created.score });
  } catch (err) {
    console.error("Contact form error:", JSON.stringify(err));
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
