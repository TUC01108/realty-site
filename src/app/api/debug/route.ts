import { NextResponse } from "next/server";

// TEMPORARY DIAGNOSTIC ENDPOINT — remove after confirming email works
// Visit /api/debug in your browser to check env var status
export async function GET() {
  const key = process.env.RESEND_API_KEY;
  return NextResponse.json({
    hasKey: !!key,
    keyLength: key?.length ?? 0,
    keyPrefix: key ? key.slice(0, 6) + "..." : "missing",
  });
}
