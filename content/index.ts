import type { Locale, SiteContent } from "./schema"
import { en } from "./en"
import { es } from "./es"

const dictionaries: Record<Locale, SiteContent> = { en, es }

/** Returns only the dictionary for the requested locale so a single language ships per route. */
export function getContent(locale: Locale): SiteContent {
  return dictionaries[locale]
}

export type { Locale, SiteContent }
