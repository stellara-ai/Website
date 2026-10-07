"use client"

import { useRef, type KeyboardEvent } from "react"
import type { HeroService, HeroServiceId } from "@/content/schema"
import { cn } from "@/lib/utils"

export function heroServiceTabId(id: HeroServiceId) {
  return `hero-service-tab-${id}`
}

export const HERO_SERVICE_PANEL_ID = "hero-service-panel"

export function HeroServiceSelector({
  services,
  selected,
  onSelect,
  label,
}: {
  services: HeroService[]
  selected: HeroServiceId
  onSelect: (id: HeroServiceId) => void
  label: string
}) {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const keys = ["ArrowRight", "ArrowLeft", "Home", "End"]
    if (!keys.includes(event.key)) return
    event.preventDefault()
    const current = services.findIndex((s) => s.id === selected)
    let next = current
    if (event.key === "ArrowRight") next = (current + 1) % services.length
    if (event.key === "ArrowLeft") next = (current - 1 + services.length) % services.length
    if (event.key === "Home") next = 0
    if (event.key === "End") next = services.length - 1
    const nextId = services[next].id
    onSelect(nextId)
    tabRefs.current[nextId]?.focus()
  }

  return (
    <div className="-mx-5 -my-6 flex max-w-[100vw] justify-start overflow-x-auto px-5 py-6 [scrollbar-width:none] sm:-mx-6 sm:justify-center sm:px-6 [&::-webkit-scrollbar]:hidden">
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={handleKeyDown}
        className="mx-auto inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-card p-2 shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(0,0,0,0.45)] dark:ring-1 dark:ring-border"
      >
        {services.map((service) => {
          const active = service.id === selected
          return (
            <button
              key={service.id}
              ref={(el) => {
                tabRefs.current[service.id] = el
              }}
              id={heroServiceTabId(service.id)}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={HERO_SERVICE_PANEL_ID}
              tabIndex={active ? 0 : -1}
              data-service-theme={service.id}
              onClick={() => onSelect(service.id)}
              className={cn(
                "inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] sm:px-5",
                active
                  ? "bg-brand-tint text-foreground ring-1 ring-inset ring-brand/30"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "size-1.5 shrink-0 rounded-full transition-colors",
                  active ? "bg-brand" : "bg-muted-foreground/40",
                )}
              />
              {service.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
