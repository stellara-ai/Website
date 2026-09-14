import type { Metadata } from "next"
import type { Locale } from "@/content/schema"
import { getContent } from "@/content"
import { absoluteUrl, pathFor, type PageId } from "@/lib/routes"

/**
 * Builds page metadata with canonical + hreflang alternates so each localized
 * route points cleanly at its counterpart. `home` uses the marketing meta copy;
 * legal pages derive their title from the localized page content.
 */
export function buildMetadata(id: PageId, locale: Locale): Metadata {
  const content = getContent(locale)
  const canonical = absoluteUrl(pathFor(id, locale))

  const languages: Record<string, string> = {
    en: absoluteUrl(pathFor(id, "en")),
    es: absoluteUrl(pathFor(id, "es")),
    "x-default": absoluteUrl(pathFor(id, "en")),
  }

  if (id === "home") {
    return {
      title: { absolute: content.meta.title },
      description: content.meta.description,
      alternates: { canonical, languages },
      openGraph: {
        type: "website",
        locale: locale === "es" ? "es_US" : "en_US",
        url: canonical,
        siteName: "Stellara",
        title: content.meta.ogTitle,
        description: content.meta.ogDescription,
      },
      twitter: {
        card: "summary_large_image",
        title: content.meta.ogTitle,
        description: content.meta.ogDescription,
      },
    }
  }

  const page = content[id]
  return {
    title: page.title,
    description: content.meta.description,
    alternates: { canonical, languages },
    openGraph: {
      type: "website",
      locale: locale === "es" ? "es_US" : "en_US",
      url: canonical,
      siteName: "Stellara",
      title: `${page.title} | Stellara`,
      description: content.meta.description,
    },
  }
}
