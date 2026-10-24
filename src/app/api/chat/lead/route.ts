import { NextRequest, NextResponse } from "next/server";
import { sendChatLeadEmails } from "@/lib/email";
import { readJsonBody } from "@/lib/http";
import { parseChatLead } from "@/lib/leads";

export async function POST(req: NextRequest) {
  try {
    const body = await readJsonBody(req);
    if (!body) {
      return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
    }
    const parsed = parseChatLead(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    if (parsed.spam) {
      console.info("Chat lead suppressed by honeypot.");
      return NextResponse.json({ ok: true });
    }
    await sendChatLeadEmails(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Chat lead error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
