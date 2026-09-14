import type { Locale } from "@/content/schema"

export const LOCALES: Locale[] = ["en", "es"]
export const DEFAULT_LOCALE: Locale = "en"

/** Cookie that stores an explicit, manual language choice. Manual always wins over detection. */
export const LOCALE_COOKIE = "stellara_locale"
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "en" || value === "es"
}

/** Resolve a locale from an Accept-Language header, defaulting to English. */
export function detectLocaleFromHeader(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE
  const primary = acceptLanguage.split(",")[0]?.trim().toLowerCase() ?? ""
  return primary.startsWith("es") ? "es" : DEFAULT_LOCALE
}

export function htmlLang(locale: Locale): string {
  return locale
}
