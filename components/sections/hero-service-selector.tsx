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
    <div className="-mx-5 flex max-w-[100vw] justify-start overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:justify-center sm:px-0 [&::-webkit-scrollbar]:hidden">
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={handleKeyDown}
        className="mx-auto inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-card/70 p-1 shadow-soft backdrop-blur"
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
              onClick={() => onSelect(service.id)}
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-out active:scale-[0.97] sm:px-5",
                active
                  ? "bg-foreground text-background shadow-soft"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              {service.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
