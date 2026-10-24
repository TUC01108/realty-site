import { NextRequest, NextResponse } from "next/server";
import { sendListingAlertEmails } from "@/lib/email";
import { readJsonBody } from "@/lib/http";
import { parseListingAlert } from "@/lib/leads";

export async function POST(req: NextRequest) {
  try {
    const body = await readJsonBody(req);
    if (!body) {
      return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
    }
    const parsed = parseListingAlert(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    if (parsed.spam) {
      console.info("Listing request suppressed by honeypot.");
      return NextResponse.json({ ok: true });
    }
    await sendListingAlertEmails(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Listing alert error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
