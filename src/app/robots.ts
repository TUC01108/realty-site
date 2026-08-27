import type { MetadataRoute } from "next"
import { brand } from "@/lib/brand"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/desk", "/desk/", "/api/", "/api"],
    },
    sitemap: `${brand.siteUrl}/sitemap.xml`,
    host: brand.siteUrl,
  }
}
