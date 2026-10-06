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
    <div className="flex w-full justify-center">
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={handleKeyDown}
        className="grid w-full max-w-md grid-cols-2 gap-1.5 rounded-[1.75rem] bg-card p-1.5 shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(0,0,0,0.45)] dark:ring-1 dark:ring-border lg:inline-flex lg:w-auto lg:max-w-none lg:items-center lg:justify-center lg:gap-2 lg:rounded-full lg:p-2"
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
                "inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-full px-3 py-2 text-center text-sm font-medium leading-tight transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card active:scale-[0.97] motion-reduce:active:scale-100 lg:min-h-10 lg:whitespace-nowrap lg:px-5",
                active
                  ? "bg-brand text-brand-foreground shadow-soft"
                  : "text-muted-foreground hover:bg-brand-tint hover:text-foreground",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "size-1.5 shrink-0 rounded-full transition-colors",
                  active ? "bg-brand-foreground" : "bg-brand",
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
