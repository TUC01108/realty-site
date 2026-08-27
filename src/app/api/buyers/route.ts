import { NextRequest, NextResponse } from "next/server";
import { ingestPublicLead } from "@/lib/leads";
import type { Financing, PropertyUse, Timeline } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, areaSlug, timeline, financing, propertyUse, budgetMax, relocatingFrom, motivation } = body;
    if (!name || (!email && !phone)) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const created = await ingestPublicLead({
      type: "buyer",
      source: "buyer_match",
      name,
      email: email || "",
      phone: phone || "",
      areaSlug: areaSlug || "island",
      timeline: (["asap", "30_days", "90_days", "6_months", "browsing"].includes(timeline) ? timeline : "90_days") as Timeline,
      financing: (["cash", "pre_approved", "pre_qualified", "not_yet"].includes(financing) ? financing : "not_yet") as Financing,
      propertyUse: (["primary", "second_home", "investment", "land", "unknown"].includes(propertyUse) ? propertyUse : "unknown") as PropertyUse,
      budgetMax: budgetMax ? Number(String(budgetMax).replace(/[^0-9.]/g, "")) : null,
      relocatingFrom: relocatingFrom || "",
      motivation: motivation || "",
    });

    return NextResponse.json({ ok: true, band: created.band, score: created.score });
  } catch (err) {
    console.error("Buyer match error:", err);
    return NextResponse.json({ error: "Failed to save inquiry" }, { status: 500 });
  }
}
