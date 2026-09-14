import type { Locale } from "@/content/schema"

/**
 * Stable page identifiers map to locale-specific paths so each English page
 * has a direct Spanish equivalent even when the translated slug differs.
 */
export type PageId = "home" | "privacy" | "terms"

const PATHS: Record<PageId, Record<Locale, string>> = {
  home: { en: "/", es: "/es" },
  privacy: { en: "/privacy", es: "/es/privacidad" },
  terms: { en: "/terms", es: "/es/terminos" },
}

/** Reverse lookup: every known path resolves to its page id and locale. */
const PATH_LOOKUP: Record<string, { id: PageId; locale: Locale }> = (() => {
  const lookup: Record<string, { id: PageId; locale: Locale }> = {}
  for (const id of Object.keys(PATHS) as PageId[]) {
    for (const locale of Object.keys(PATHS[id]) as Locale[]) {
      lookup[PATHS[id][locale]] = { id, locale }
    }
  }
  return lookup
})()

export function pathFor(id: PageId, locale: Locale): string {
  return PATHS[id][locale]
}

export function resolvePath(pathname: string): { id: PageId; locale: Locale } | null {
  const normalized = pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname
  return PATH_LOOKUP[normalized] ?? null
}

/**
 * Given the current pathname, return the equivalent path in the target locale,
 * preserving any in-page hash. Unknown paths fall back to the locale home.
 */
export function equivalentPath(pathname: string, target: Locale, hash = ""): string {
  const resolved = resolvePath(pathname)
  const base = resolved ? pathFor(resolved.id, target) : pathFor("home", target)
  return hash ? `${base}${hash}` : base
}

export function localeFromPathname(pathname: string): Locale {
  const resolved = resolvePath(pathname)
  if (resolved) return resolved.locale
  return pathname === "/es" || pathname.startsWith("/es/") ? "es" : "en"
}

/** Absolute URL builder used for canonical, hreflang, sitemap, and OG metadata. */
export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "https://stellara.ai"
  return raw.replace(/\/$/, "")
}

export function absoluteUrl(path: string): string {
  return `${siteUrl()}${path === "/" ? "" : path}` || siteUrl()
}
