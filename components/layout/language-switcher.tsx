"use client"

import { usePathname, useRouter } from "next/navigation"
import type { Locale, SiteContent } from "@/content/schema"
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE } from "@/lib/locale"
import { equivalentPath } from "@/lib/routes"
import { track } from "@/lib/analytics"
import { cn } from "@/lib/utils"

const OPTIONS: { value: Locale; short: string }[] = [
  { value: "en", short: "EN" },
  { value: "es", short: "ES" },
]

export function LanguageSwitcher({ content, className }: { content: SiteContent; className?: string }) {
  const router = useRouter()
  const pathname = usePathname()

  function change(target: Locale) {
    if (target === content.locale) return
    document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`
    track("language_changed", { from: content.locale, to: target })
    const hash = typeof window !== "undefined" ? window.location.hash : ""
    // Both locales render the same layout in place, so keep the reader where they
    // are. Without scroll: false, Next resets to the top on this route change,
    // yanking the reader out of whatever section they were viewing.
    router.push(equivalentPath(pathname, target, hash), { scroll: false })
  }

  return (
    <div
      role="group"
      aria-label={content.common.languageLabel}
      className={cn("inline-flex items-center rounded-md border border-border p-0.5", className)}
    >
      {OPTIONS.map((option) => {
        const active = option.value === content.locale
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => change(option.value)}
            aria-pressed={active}
            className={cn(
              "rounded-[4px] px-2 py-1 text-xs font-medium transition-colors",
              active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.short}
            <span className="sr-only">
              {option.value === "en" ? ` — ${content.common.languageEnglish}` : ` — ${content.common.languageSpanish}`}
            </span>
          </button>
        )
      })}
    </div>
  )
}
