import { NextRequest, NextResponse } from "next/server";
import { sendContactEmails } from "@/lib/email";
export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message } = await req.json();
    if (!name||!email||!phone) return NextResponse.json({ error:"Missing required fields" }, { status:400 });
    await sendContactEmails({ name, email, phone, message: message||"" });
    return NextResponse.json({ ok:true });
  } catch(err) { console.error("Contact error:", err); return NextResponse.json({ error:"Failed" }, { status:500 }); }
}