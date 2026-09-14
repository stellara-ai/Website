"use client"

import { useEffect, useRef, useState } from "react"
import type { IndustryContent } from "@/content/schema"
import { getIndustryDemo, type DemoTone, type IndustryDemo } from "@/lib/industry-demos"
import { CountUp } from "@/components/util/count-up"
import { cn } from "@/lib/utils"

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const on = () => setReduced(mq.matches)
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [])
  return reduced
}

const TONE_DOT: Record<DemoTone, string> = {
  done: "bg-status-done",
  brand: "bg-brand",
  work: "bg-status-purple",
}

function Bars({ demo, reduced }: { demo: IndustryDemo; reduced: boolean }) {
  const [grown, setGrown] = useState(reduced)
  useEffect(() => {
    if (reduced) {
      setGrown(true)
      return
    }
    setGrown(false)
    const raf = requestAnimationFrame(() => setGrown(true))
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  const peak = Math.max(...demo.series)
  return (
    <div>
      <div className="label-mono mb-3 text-muted-foreground">{demo.seriesLabel}</div>
      <div className="flex h-24 items-end gap-1.5" aria-hidden="true">
        {demo.series.map((v, i) => (
          <div
            key={i}
            className={cn(
              "min-h-px flex-1 rounded-t-sm",
              i === demo.series.length - 1 ? "bg-brand" : "bg-brand/35",
            )}
            style={{
              height: grown ? `${Math.max((v / peak) * 100, 6)}%` : "0%",
              transition: reduced ? undefined : "height 0.7s cubic-bezier(0.22,1,0.36,1)",
              transitionDelay: reduced ? undefined : `${i * 60}ms`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

function Feed({ demo, reduced }: { demo: IndustryDemo; reduced: boolean }) {
  const [shown, setShown] = useState(reduced)
  useEffect(() => {
    if (reduced) {
      setShown(true)
      return
    }
    setShown(false)
    const raf = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  return (
    <ul className="flex flex-col gap-2.5">
      {demo.feed.map((item, i) => (
        <li
          key={item.title}
          className="flex items-start gap-3 rounded-lg border border-border bg-background/50 px-3.5 py-2.5"
          style={{
            opacity: shown ? 1 : 0,
            transform: shown ? "translateY(0)" : "translateY(8px)",
            transition: reduced ? undefined : "opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)",
            transitionDelay: reduced ? undefined : `${300 + i * 130}ms`,
          }}
        >
          <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", TONE_DOT[item.tone])} aria-hidden="true" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-foreground">{item.title}</span>
            <span className="block truncate text-xs text-muted-foreground">{item.meta}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}

export function IndustriesShowcase({ content }: { content: IndustryContent & { locale: string } }) {
  const { industries, locale } = content
  const [activeId, setActiveId] = useState(industries[0]?.id ?? "")
  const reduced = usePrefersReducedMotion()
  const panelRef = useRef<HTMLDivElement | null>(null)

  const active = industries.find((i) => i.id === activeId) ?? industries[0]
  const demo = getIndustryDemo(activeId, locale)

  return (
    <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
      {/* Selector rail */}
      <div
        role="tablist"
        aria-label={content.title}
        className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0"
      >
        {industries.map((industry, i) => {
          const isActive = industry.id === activeId
          return (
            <button
              key={industry.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(industry.id)}
              className={cn(
                "group flex shrink-0 items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors lg:w-full",
                isActive
                  ? "border-brand/40 bg-brand/10 text-foreground"
                  : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "font-mono text-xs tabular-nums",
                  isActive ? "text-brand" : "text-muted-foreground/70",
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="whitespace-nowrap text-sm font-medium lg:whitespace-normal">{industry.name}</span>
            </button>
          )
        })}
      </div>

      {/* Live dashboard panel */}
      <div
        ref={panelRef}
        className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-7"
      >
        {demo && active && (
          <div key={activeId}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">{active.name}</h3>
                <p className="mt-1 max-w-md text-pretty text-sm text-muted-foreground">{demo.tagline}</p>
              </div>
              <span className="label-mono flex shrink-0 items-center gap-2 rounded-full border border-border px-2.5 py-1 text-muted-foreground">
                <span className="size-1.5 rounded-full bg-muted-foreground/50" aria-hidden="true" />
                {content.demoLabel}
              </span>
            </div>

            {/* KPIs */}
            <div className="mt-6 grid grid-cols-3 gap-4 border-y border-border py-5">
              {demo.kpis.map((kpi, i) => (
                <div key={kpi.label}>
                  <CountUp
                    value={`${kpi.prefix ?? ""}${kpi.decimals ? kpi.value.toFixed(kpi.decimals) : kpi.value}${kpi.suffix ?? ""}`}
                    className={cn(
                      "block font-mono tabular-nums tracking-tight",
                      i === 0 ? "text-3xl font-semibold text-brand sm:text-4xl" : "text-2xl font-semibold text-foreground",
                    )}
                  />
                  <div className="label-mono mt-1.5 leading-tight text-muted-foreground">{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* Chart + feed */}
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <Bars demo={demo} reduced={reduced} />
              <Feed demo={demo} reduced={reduced} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
