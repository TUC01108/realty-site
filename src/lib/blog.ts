export type BlogPost = { title: string; summary: string; published: string; url: string; thumbnail?: string; };
const FEED_URL = "https://yourbigislandrealestate.blogspot.com/feeds/posts/default?alt=json";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractThumbnail(entry: any): string | undefined {
  const content: string = entry?.content?.$t ?? entry?.summary?.$t ?? "";
  const match = content.match(/<img[^>]+src="([^"]+)"/i);
  return match?.[1];
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPost(entry: any): BlogPost {
  const links: { rel: string; href: string }[] = entry.link ?? [];
  const url = links.find((l) => l.rel === "alternate")?.href ?? "#";
  const rawSummary: string = entry?.summary?.$t ?? entry?.content?.$t ?? "";
  const summary = rawSummary.replace(/<[^>]+>/g, "").trim().slice(0, 200);
  return { title: entry?.title?.$t ?? "Untitled", summary: summary ? summary + (summary.length >= 200 ? "…" : "") : "", published: entry?.published?.$t ?? "", url, thumbnail: extractThumbnail(entry) };
}
export async function fetchBlogPosts(max = 10): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${FEED_URL}&max-results=${max}`, { next: { revalidate: 600 } });
    if (!res.ok) return [];
    const json = await res.json();
    return (json?.feed?.entry ?? []).map(toPost);
  } catch { return []; }
}
export function formatDate(iso: string): string {
  if (!iso) return "";
  try { return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }); }
  catch { return ""; }
}
