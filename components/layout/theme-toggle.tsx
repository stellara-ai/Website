"use client"

import { MonitorIcon, MoonIcon, SunIcon } from "@phosphor-icons/react"
import type { SiteContent } from "@/content/schema"
import { useTheme, type Theme } from "@/components/providers/theme-provider"
import { cn } from "@/lib/utils"

export function ThemeToggle({ content, className }: { content: SiteContent; className?: string }) {
  const { theme, setTheme } = useTheme()

  const options: { value: Theme; label: string; icon: typeof SunIcon }[] = [
    { value: "system", label: content.common.themeSystem, icon: MonitorIcon },
    { value: "light", label: content.common.themeLight, icon: SunIcon },
    { value: "dark", label: content.common.themeDark, icon: MoonIcon },
  ]

  return (
    <div
      role="group"
      aria-label={content.common.themeLabel}
      className={cn("inline-flex items-center rounded-md border border-border p-0.5", className)}
    >
      {options.map((option) => {
        const Icon = option.icon
        const active = theme === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            aria-pressed={active}
            title={option.label}
            className={cn(
              "grid size-7 place-items-center rounded-[5px] transition-colors",
              active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon weight="fill" className="size-3.5" />
            <span className="sr-only">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
