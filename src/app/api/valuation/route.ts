import { NextRequest, NextResponse } from "next/server";
import { sendValuationEmails } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, phone, address, propertyType, notes } = data;

    if (!name || !email || !phone || !address || !propertyType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await sendValuationEmails({
      name,
      email,
      phone,
      address,
      propertyType,
      notes: notes || "",
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Valuation form error:", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
