import { NextRequest, NextResponse } from "next/server";
import { sendContactEmails } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, phone, message } = data;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Sending contact emails for:", name, email);
    await sendContactEmails({ name, email, phone, message: message || "" });
    console.log("Contact emails sent successfully");

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", JSON.stringify(err));
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
