import { NextRequest, NextResponse } from "next/server";
import { sendValuationEmails } from "@/lib/email";
import { ingestPublicLead } from "@/lib/leads";
import type { Occupancy, Timeline } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, address, propertyType, notes, timeline, occupancy, motivation } = body;
    if (!name || !email || !phone) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const created = await ingestPublicLead({
      type: "seller",
      source: "valuation",
      name,
      email,
      phone,
      areaSlug: "island",
      address: address || "",
      timeline: (["asap", "30_days", "90_days", "6_months", "browsing"].includes(timeline) ? timeline : "90_days") as Timeline,
      occupancy: (["owner", "tenant", "vacant", "unknown"].includes(occupancy) ? occupancy : "unknown") as Occupancy,
      motivation: motivation || notes || "",
      notes: [propertyType, notes].filter(Boolean).join(" · "),
    });

    try {
      await sendValuationEmails({
        name,
        email,
        phone,
        address: address || "",
        propertyType: propertyType || "Not specified",
        notes: `${motivation || notes || ""}\nIntent ${created.score} (${created.band})`.trim(),
      });
    } catch (err) {
      console.error("Valuation email failed; lead still saved:", err);
    }

    return NextResponse.json({ ok: true, band: created.band, score: created.score });
  } catch (err) {
    console.error("Valuation form error:", JSON.stringify(err));
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
