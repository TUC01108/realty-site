import type { MetadataRoute } from "next";
import { NEIGHBORHOODS } from "@/data/neighborhoods";

const BASE = "https://www.yourbigislandrealestate.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const static_pages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/areas`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/valuation`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/home-search`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
  ];

  const area_pages: MetadataRoute.Sitemap = NEIGHBORHOODS.map((n) => ({
    url: `${BASE}/areas/${n.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...static_pages, ...area_pages];
}
