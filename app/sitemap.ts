import type { MetadataRoute } from "next"
import { absoluteUrl, pathFor, type PageId } from "@/lib/routes"

export default function sitemap(): MetadataRoute.Sitemap {
  const ids: PageId[] = ["home", "privacy", "terms"]
  const now = new Date()

  return ids.map((id) => ({
    url: absoluteUrl(pathFor(id, "en")),
    lastModified: now,
    changeFrequency: id === "home" ? "monthly" : "yearly",
    priority: id === "home" ? 1 : 0.4,
    alternates: {
      languages: {
        en: absoluteUrl(pathFor(id, "en")),
        es: absoluteUrl(pathFor(id, "es")),
      },
    },
  }))
}
