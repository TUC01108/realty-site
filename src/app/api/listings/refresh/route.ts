import { NextResponse } from "next/server";
import { refreshListingFeed } from "@/lib/listings/feed";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET is not set, so scheduled refresh is disabled." },
      { status: 503 },
    );
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const feed = await refreshListingFeed();
    return NextResponse.json({
      ok: true,
      sourceId: feed.sourceId,
      fetchedAt: feed.fetchedAt,
      count: feed.listings.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Refresh failed.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
