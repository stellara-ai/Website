"use client"

import { useEffect, useRef, useState, type ComponentType } from "react"
import {
  ArrowRightIcon,
  CalendarBlankIcon,
  CalendarCheckIcon,
  ChatCircleTextIcon,
  ChatsCircleIcon,
  CheckCircleIcon,
  CheckIcon,
  CheckSquareIcon,
  FunnelIcon,
  RobotIcon,
  SquaresFourIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr"
import type { SiteContent } from "@/content/schema"
import { StellaraSymbol } from "@/components/brand/stellara-logo"
import { cn } from "@/lib/utils"

type Section = SiteContent["measurableWork"]
type Tone = "purple" | "done" | "teal" | "work" | "stuck"
type IconType = ComponentType<{ className?: string; weight?: "regular" | "bold" | "fill" | "duotone" }>

const TONES: Record<Tone, { text: string; bg: string; tint: string; fill: string; stroke: string }> = {
  purple: { text: "text-status-purple", bg: "bg-status-purple", tint: "bg-status-purple-tint", fill: "fill-status-purple-tint", stroke: "stroke-status-purple" },
  done: { text: "text-status-done", bg: "bg-status-done", tint: "bg-status-done-tint", fill: "fill-status-done-tint", stroke: "stroke-status-done" },
  teal: { text: "text-status-teal", bg: "bg-status-teal", tint: "bg-status-teal-tint", fill: "fill-status-teal-tint", stroke: "stroke-status-teal" },
  work: { text: "text-status-work", bg: "bg-status-work", tint: "bg-status-work-tint", fill: "fill-status-work-tint", stroke: "stroke-status-work" },
  stuck: { text: "text-status-stuck", bg: "bg-status-stuck", tint: "bg-status-stuck-tint", fill: "fill-status-stuck-tint", stroke: "stroke-status-stuck" },
}

const NAV_ICONS: IconType[] = [
  SquaresFourIcon,
  ChatsCircleIcon,
  CalendarBlankIcon,
  FunnelIcon,
  CheckSquareIcon,
  RobotIcon,
]
const KPI_ICONS: IconType[] = [ChatCircleTextIcon, CalendarCheckIcon, CheckCircleIcon, WarningCircleIcon]
const KPI_TONES: Tone[] = ["purple", "done", "teal", "work"]
const SOURCE_TONES: Tone[] = ["purple", "teal", "done", "work"]
const STATUS_TONES: Tone[] = ["done", "purple", "teal", "stuck"]
const TICK_MS = 3200

function useInView<T extends Element>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting) setSeen(true)
      },
      { threshold: 0.2 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, inView, seen }
}

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0)
  const from = useRef(0)

  useEffect(() => {
    if (!active) return
    const start = performance.now()
    const origin = from.current
    let frame = 0
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / 900)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(origin + (target - origin) * eased))
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(frame)
      from.current = target
    }
  }, [target, active])

  return value
}

export function DashboardSim({ section }: { section: Section }) {
  const copy = section.dashboard
  const { ref, inView, seen } = useInView<HTMLDivElement>()

  const [kpis, setKpis] = useState(() => section.monthMetrics.map((metric) => Number.parseInt(metric.value, 10) || 0))
  const [deltas, setDeltas] = useState(() => section.monthMetrics.map(() => 0))
  const [sources, setSources] = useState(() => copy.sources.map((source) => source.value))
  const [growth, setGrowth] = useState(copy.growth)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = window.setInterval(() => setTick((t) => t + 1), TICK_MS)
    return () => window.clearInterval(id)
  }, [inView])

  useEffect(() => {
    if (tick === 0) return
    const kpiIndex = tick % 3
    setKpis((prev) => prev.map((v, i) => (i === kpiIndex ? v + 1 : v)))
    setDeltas((prev) => prev.map((v, i) => (i === kpiIndex ? v + 1 : v)))
    setSources((prev) => prev.map((v, i) => (i === tick % prev.length ? v + 1 : v)))
    setGrowth((prev) => prev.map((v, i) => (i === prev.length - 1 ? v + 1 : v)))
  }, [tick])

  const eventIndex = tick % copy.events.length

  return (
    <div ref={ref} className="overflow-hidden rounded-2xl border border-border bg-surface-alt">
      <div className="flex">
        <Sidebar copy={copy} />

        <div className="flex min-w-0 flex-1 flex-col gap-4 p-3 sm:p-5 lg:p-6">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <StellaraSymbol className="h-7 lg:hidden" />
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">{copy.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {section.briefFirm} <span aria-hidden="true">·</span> {section.briefTime}
                </p>
              </div>
            </div>
            <div
              className="flex min-w-0 items-center gap-2 rounded-full bg-card px-3 py-1.5 text-xs sm:max-w-[55%]"
              aria-hidden="true"
            >
              <span className="relative flex size-2 shrink-0">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-status-done opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-status-done" />
              </span>
              <span className="shrink-0 font-semibold uppercase tracking-[0.08em] text-status-done">{copy.live}</span>
              <span
                key={eventIndex}
                className="truncate text-muted-foreground animate-in fade-in slide-in-from-bottom-1 duration-500"
              >
                {copy.events[eventIndex]}
              </span>
            </div>
          </header>

          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {section.monthMetrics.map((metric, index) => (
              <KpiCard
                key={metric.label}
                label={metric.label}
                value={kpis[index]}
                delta={deltas[index]}
                todayLabel={copy.todayLabel}
                tone={KPI_TONES[index % KPI_TONES.length]}
                Icon={KPI_ICONS[index % KPI_ICONS.length]}
                active={seen}
              />
            ))}
          </dl>

          <div className="grid gap-3 lg:grid-cols-5">
            <Panel title={copy.sourceTitle} className="lg:col-span-3">
              <SourceBars labels={copy.sources.map((s) => s.label)} values={sources} active={seen} />
            </Panel>
            <Panel title={copy.statusTitle} className="lg:col-span-2">
              <StatusDonut data={copy.statuses} totalLabel={copy.statusTotal} active={seen} />
            </Panel>
          </div>

          <div className="grid gap-3 lg:grid-cols-5">
            <Panel title={copy.growthTitle} meta={copy.growthPeriod} className="lg:col-span-3">
              <GrowthChart values={growth} active={seen} />
            </Panel>
            <Panel title={copy.activityTitle} className="lg:col-span-2">
              <ul className="flex flex-col divide-y divide-border">
                {section.items.map((item) => {
                  const needsStaff = item.tone === "handoff"
                  return (
                    <li key={item.label} className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0">
                      <span
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-lg text-base font-semibold tabular-nums",
                          needsStaff ? "bg-status-work-tint text-status-work" : "bg-status-done-tint text-status-done",
                        )}
                      >
                        {item.count}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-snug text-foreground">{item.label}</p>
                        <p
                          className={cn(
                            "mt-0.5 flex items-center gap-1 text-xs font-medium",
                            needsStaff ? "text-status-work" : "text-status-done",
                          )}
                        >
                          {needsStaff ? (
                            <ArrowRightIcon weight="bold" className="size-3 shrink-0" aria-hidden="true" />
                          ) : (
                            <CheckIcon weight="bold" className="size-3 shrink-0" aria-hidden="true" />
                          )}
                          <span className="truncate">{needsStaff ? item.action : section.doneStatus}</span>
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  )
}

function Sidebar({ copy }: { copy: Section["dashboard"] }) {
  return (
    <aside className="hidden w-52 shrink-0 flex-col gap-5 border-r border-border bg-card p-4 lg:flex" aria-hidden="true">
      <div className="flex items-center gap-2 px-2">
        <StellaraSymbol className="h-7" />
        <span className="text-lg font-semibold tracking-tight text-foreground">
          stellara<span className="text-sm text-brand">.law</span>
        </span>
      </div>
      <ul className="flex flex-col gap-0.5">
        {copy.nav.map((label, index) => {
          const Icon = NAV_ICONS[index] ?? SquaresFourIcon
          const active = index === 0
          return (
            <li
              key={label}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm",
                active ? "bg-brand-tint font-semibold text-foreground" : "text-muted-foreground",
              )}
            >
              <Icon className={cn("size-4 shrink-0", active && "text-brand")} weight={active ? "fill" : "regular"} />
              <span className="truncate">{label}</span>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

function Panel({
  title,
  meta,
  className,
  children,
}: {
  title: string
  meta?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section className={cn("flex min-w-0 flex-col gap-4 rounded-xl bg-card p-4 sm:p-5", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        {meta ? <p className="text-xs text-muted-foreground">{meta}</p> : null}
      </div>
      {children}
    </section>
  )
}

function KpiCard({
  label,
  value,
  delta,
  todayLabel,
  tone,
  Icon,
  active,
}: {
  label: string
  value: number
  delta: number
  todayLabel: string
  tone: Tone
  Icon: IconType
  active: boolean
}) {
  const shown = useCountUp(value, active)
  const t = TONES[tone]

  return (
    <div className="relative flex flex-col-reverse gap-2 overflow-hidden rounded-xl bg-card p-4">
      <span className={cn("absolute inset-x-0 top-0 h-1", t.bg)} aria-hidden="true" />
      <dd className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-3xl font-semibold tabular-nums tracking-tight text-foreground sm:text-4xl">{shown}</span>
        {delta > 0 ? (
          <span
            key={delta}
            className={cn(
              "rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums animate-in fade-in zoom-in-90 duration-300",
              t.tint,
              t.text,
            )}
          >
            +{delta} {todayLabel}
          </span>
        ) : null}
      </dd>
      <dt className="flex items-center justify-between gap-2 pt-1">
        <span className="text-sm leading-snug text-muted-foreground">{label}</span>
        <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-lg", t.tint, t.text)} aria-hidden="true">
          <Icon className="size-4" weight="bold" />
        </span>
      </dt>
    </div>
  )
}

function SourceBars({ labels, values, active }: { labels: string[]; values: number[]; active: boolean }) {
  const max = Math.max(...values) * 1.15

  return (
    <div className="flex h-44 items-stretch gap-3 sm:gap-6" role="img" aria-label={labels.map((l, i) => `${l}: ${values[i]}`).join(", ")}>
      {values.map((value, index) => {
        const t = TONES[SOURCE_TONES[index % SOURCE_TONES.length]]
        return (
          <div key={labels[index]} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <div className="flex w-full flex-1 flex-col items-center justify-end gap-1">
              <span className={cn("text-xs font-semibold tabular-nums", t.text)}>{value}</span>
              <div
                className={cn("w-full max-w-14 rounded-t-md transition-[height] duration-700 ease-out", t.bg)}
                style={{ height: active ? `${(value / max) * 100}%` : "0%", transitionDelay: `${index * 90}ms` }}
              />
            </div>
            <span className="w-full truncate text-center text-xs text-muted-foreground" title={labels[index]}>
              {labels[index]}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function StatusDonut({
  data,
  totalLabel,
  active,
}: {
  data: { label: string; value: number }[]
  totalLabel: string
  active: boolean
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const shownTotal = useCountUp(total, active)
  let offset = 0

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row lg:flex-col xl:flex-row">
      <div className="relative size-36 shrink-0">
        <svg viewBox="0 0 36 36" className="size-full -rotate-90" aria-hidden="true">
          <circle cx="18" cy="18" r="15.9155" fill="none" strokeWidth="4.5" className="stroke-border" />
          {data.map((d, index) => {
            const pct = (d.value / total) * 100
            const gap = 1.2
            const dash = Math.max(0, pct - gap)
            const segment = (
              <circle
                key={d.label}
                cx="18"
                cy="18"
                r="15.9155"
                fill="none"
                strokeWidth="4.5"
                strokeLinecap="round"
                className={TONES[STATUS_TONES[index % STATUS_TONES.length]].stroke}
                strokeDasharray={active ? `${dash} ${100 - dash}` : `0 100`}
                strokeDashoffset={-offset}
                style={{ transition: "stroke-dasharray 900ms ease-out", transitionDelay: `${index * 120}ms` }}
              />
            )
            offset += pct
            return segment
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold tabular-nums tracking-tight text-foreground">{shownTotal}</span>
          <span className="text-[11px] text-muted-foreground">{totalLabel}</span>
        </div>
      </div>
      <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-1">
        {data.map((d, index) => {
          const t = TONES[STATUS_TONES[index % STATUS_TONES.length]]
          return (
            <li key={d.label} className="flex items-center gap-2 text-sm">
              <span className={cn("size-2.5 shrink-0 rounded-full", t.bg)} aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate text-muted-foreground">{d.label}</span>
              <span className="font-semibold tabular-nums text-foreground">{d.value}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function GrowthChart({ values, active }: { values: number[]; active: boolean }) {
  const max = Math.max(...values) * 1.2
  const points = values.map((v, i) => [(i / (values.length - 1)) * 100, 100 - (v / max) * 100] as const)
  const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ")
  const area = `${line} L100,100 L0,100 Z`
  const [lastX, lastY] = points[points.length - 1]

  return (
    <div
      className="relative h-44"
      role="img"
      aria-label={values.join(", ")}
    >
      {[0, 25, 50, 75].map((top) => (
        <span key={top} className="absolute inset-x-0 border-t border-dashed border-border" style={{ top: `${top}%` }} aria-hidden="true" />
      ))}
      <div
        className="absolute inset-0 transition-[clip-path] duration-1000 ease-out"
        style={{ clipPath: active ? "inset(0 0 0 0)" : "inset(0 100% 0 0)" }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="size-full overflow-visible">
          <path d={area} className="fill-status-purple-tint transition-[d] duration-700" />
          <path
            d={line}
            fill="none"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className="stroke-status-purple transition-[d] duration-700"
          />
        </svg>
      </div>
      <span
        className={cn(
          "absolute flex size-3 -translate-x-1/2 -translate-y-1/2 transition-[top,opacity] duration-700",
          active ? "opacity-100" : "opacity-0",
        )}
        style={{ left: `${lastX}%`, top: `${lastY}%` }}
        aria-hidden="true"
      >
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-status-purple opacity-50 motion-reduce:hidden" />
        <span className="relative inline-flex size-3 rounded-full border-2 border-card bg-status-purple" />
      </span>
    </div>
  )
}
