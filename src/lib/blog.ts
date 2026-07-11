export type BlogPost = {
  title: string;
  summary: string;
  published: string;
  url: string;
  thumbnail?: string;
};

const FEED_URL =
  "https://yourbigislandrealestate.blogspot.com/feeds/posts/default?alt=json&max-results=20";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractThumbnail(entry: any): string | undefined {
  // Blogger embeds images in the content — grab the first img src
  const content: string = entry?.content?.$t ?? entry?.summary?.$t ?? "";
  const match = content.match(/<img[^>]+src="([^"]+)"/i);
  return match?.[1];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPost(entry: any): BlogPost {
  const links: { rel: string; href: string }[] = entry.link ?? [];
  const url =
    links.find((l) => l.rel === "alternate")?.href ??
    links.find((l) => l.href?.includes("blogspot"))?.href ??
    "#";

  const rawSummary: string = entry?.summary?.$t ?? entry?.content?.$t ?? "";
  // Strip HTML tags for the excerpt
  const summary = rawSummary.replace(/<[^>]+>/g, "").trim().slice(0, 200);

  return {
    title: entry?.title?.$t ?? "Untitled",
    summary: summary ? summary + (summary.length >= 200 ? "…" : "") : "",
    published: entry?.published?.$t ?? "",
    url,
    thumbnail: extractThumbnail(entry),
  };
}

export async function fetchBlogPosts(max = 20): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${FEED_URL}&max-results=${max}`, {
      // Revalidate every 10 minutes so new posts show up promptly
      next: { revalidate: 600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const entries = json?.feed?.entry ?? [];
    return entries.map(toPost);
  } catch {
    return [];
  }
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}
