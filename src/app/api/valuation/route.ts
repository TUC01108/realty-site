import { NextRequest, NextResponse } from "next/server";
import { sendValuationEmails } from "@/lib/email";
export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, address, propertyType, notes } = await req.json();
    if (!name || !email || !phone) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    await sendValuationEmails({ name, email, phone, address: address||"", propertyType: propertyType||"Not specified", notes: notes||"" });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Valuation form error:", JSON.stringify(err));
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
