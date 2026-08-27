import type { MetadataRoute } from "next"
import { GUIDES } from "@/data/guides"
import { NEIGHBORHOODS } from "@/data/neighborhoods"
import { absUrl } from "@/lib/schema"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absUrl("/about"), changeFrequency: "monthly", priority: 0.9 },
    { url: absUrl("/areas"), changeFrequency: "monthly", priority: 0.8 },
    { url: absUrl("/guides"), changeFrequency: "monthly", priority: 0.8 },
    { url: absUrl("/contact"), changeFrequency: "monthly", priority: 0.6 },
    { url: absUrl("/home-search"), changeFrequency: "monthly", priority: 0.5 },
    { url: absUrl("/valuation"), changeFrequency: "monthly", priority: 0.5 },
    { url: absUrl("/blog"), changeFrequency: "weekly", priority: 0.4 },
  ]

  const districts = NEIGHBORHOODS.map((n) => ({
    url: absUrl(`/areas/${n.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  const guides = GUIDES.map((g) => ({
    url: absUrl(`/guides/${g.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }))

  return [...staticRoutes, ...districts, ...guides]
}
