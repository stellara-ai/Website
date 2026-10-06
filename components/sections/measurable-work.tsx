"use client"

import { useEffect, useRef, useState } from "react"
import { CalendarCheck, HeartPulse, Star, Timer, type LucideIcon } from "lucide-react"
import type { MeasurableWorkMetric, SiteContent } from "@/content/schema"
import { SectionHeading } from "@/components/sections/section-parts"
import { Chip } from "@/components/sections/stories/story-ui"
import { cn } from "@/lib/utils"

type Accent = "purple" | "done" | "teal" | "work"

const ACCENT: Record<Accent, { bar: string; text: string; tint: string }> = {
  purple: { bar: "bg-status-purple", text: "text-status-purple", tint: "bg-status-purple-tint" },
  done: { bar: "bg-status-done", text: "text-status-done", tint: "bg-status-done-tint" },
  teal: { bar: "bg-status-teal", text: "text-status-teal", tint: "bg-status-teal-tint" },
  work: { bar: "bg-status-work", text: "text-status-work", tint: "bg-status-work-tint" },
}

const TREND = [34, 48, 41, 58, 52, 66, 61, 77, 70, 86, 80, 94, 88, 100]
const ROTATE_MS = 2800

function useDashboardMotion() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [inView, setInView] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(media.matches)
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, inView, reduced }
}

function parseMetric(value: string) {
  const time = value.match(/^(\d+):(\d+)$/)
  if (time) return { target: Number(time[1]) * 60 + Number(time[2]), isTime: true }
  return { target: Number(value.replace(/[^\d.]/g, "")) || 0, isTime: false }
}

function formatMetric(amount: number, isTime: boolean) {
  if (!isTime) return Math.round(amount).toLocaleString("en-US")
  const total = Math.round(amount)
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`
}

function CountUp({ value, run, instant }: { value: string; run: boolean; instant: boolean }) {
  const { target, isTime } = parseMetric(value)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!run) return
    if (instant) {
      setProgress(1)
      return
    }
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / 1400, 1)
      setProgress(1 - Math.pow(1 - t, 3))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [run, instant])

  return (
    <>
      <span aria-hidden="true" className="tabular-nums">
        {formatMetric(target * progress, isTime)}
      </span>
      <span className="sr-only">{value}</span>
    </>
  )
}

function Card({
  className,
  style,
  children,
}: {
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  return (
    <div className={cn("rounded-2xl border border-border bg-background/70 p-4 sm:p-5", className)} style={style}>
      {children}
    </div>
  )
}

export function MeasurableWork({ content }: { content: SiteContent }) {
  const section = content.measurableWork
  const { ref, inView, reduced } = useDashboardMotion()
  const [active, setActive] = useState(0)

  const [handled, response, qualified, booked, followUps, treatment, reviews] = section.metrics
  const funnel: { metric: MeasurableWorkMetric; accent: Accent }[] = [
    { metric: handled, accent: "purple" },
    { metric: qualified, accent: "teal" },
    { metric: booked, accent: "work" },
  ]
  const funnelMax = parseMetric(handled.value).target || 1
  const tiles: { metric: MeasurableWorkMetric; accent: Accent; icon: LucideIcon }[] = [
    { metric: response, accent: "done", icon: Timer },
    { metric: followUps, accent: "purple", icon: CalendarCheck },
    { metric: treatment, accent: "teal", icon: HeartPulse },
    { metric: reviews, accent: "work", icon: Star },
  ]
  const handoffCount = section.attention.filter((item) => item.tone === "handoff").length
  const rotating = inView && !reduced

  useEffect(() => {
    if (!rotating) return
    const id = window.setInterval(() => setActive((i) => (i + 1) % section.attention.length), ROTATE_MS)
    return () => window.clearInterval(id)
  }, [rotating, section.attention.length])

  const grow = (delay: number) => ({
    transitionDelay: reduced ? "0ms" : `${delay}ms`,
  })

  return (
    <section id="measurement" className="scroll-mt-20 border-t border-border">
      <div className="container-editorial grid gap-12 py-20 md:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} description={section.description} />

        <div
          ref={ref}
          className={cn(
            "relative transition-all duration-700 ease-out motion-reduce:transition-none",
            inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
          )}
        >
          <div
            className="absolute inset-x-6 -bottom-3 h-full rounded-3xl border border-border bg-card/30"
            aria-hidden="true"
          />
          <div className="relative flex flex-col gap-3 rounded-3xl border border-border bg-card p-4 shadow-soft sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <p className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
                <span className="relative flex size-2.5" aria-hidden="true">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-status-done opacity-60 motion-reduce:animate-none" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-status-done" />
                </span>
                {section.reportLabel}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                  {section.periodLabel}
                </span>
                <span className="rounded-full border border-border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  {section.dashboardLabel}
                </span>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-5">
              <Card className="flex flex-col gap-4 md:col-span-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">{handled.label}</p>
                  <p className="mt-1.5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                    <CountUp value={handled.value} run={inView} instant={reduced} />
                  </p>
                </div>
                <div className="flex h-24 items-end gap-1.5" aria-hidden="true">
                  {TREND.map((height, index) => (
                    <span
                      key={index}
                      className={cn(
                        "flex-1 origin-bottom rounded-t-md transition-transform duration-700 ease-out motion-reduce:transition-none",
                        index === TREND.length - 1 ? "bg-status-purple" : "bg-status-purple/30",
                        inView ? "scale-y-100" : "scale-y-0",
                      )}
                      style={{ height: `${height}%`, ...grow(200 + index * 45) }}
                    />
                  ))}
                </div>
              </Card>

              <Card className="flex flex-col justify-center gap-4 md:col-span-2">
                {funnel.map(({ metric, accent }, index) => {
                  const share = Math.round((parseMetric(metric.value).target / funnelMax) * 100)
                  return (
                    <div key={metric.label} className="flex flex-col gap-1.5">
                      <div className="flex items-baseline justify-between gap-2 text-sm">
                        <span className="truncate text-muted-foreground">{metric.label}</span>
                        <span className="font-semibold text-foreground">
                          <CountUp value={metric.value} run={inView} instant={reduced} />
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                        <div
                          className={cn(
                            "h-full rounded-full transition-[width] duration-1000 ease-out motion-reduce:transition-none",
                            ACCENT[accent].bar,
                          )}
                          style={{ width: inView ? `${share}%` : "0%", ...grow(300 + index * 150) }}
                        />
                      </div>
                    </div>
                  )
                })}
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {tiles.map(({ metric, accent, icon: Icon }, index) => (
                <Card
                  key={metric.label}
                  className={cn(
                    "flex flex-col gap-3 transition-all duration-500 ease-out motion-reduce:transition-none",
                    inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                  )}
                  style={grow(450 + index * 90)}
                >
                  <span
                    className={cn("flex size-8 items-center justify-center rounded-lg", ACCENT[accent].tint, ACCENT[accent].text)}
                    aria-hidden="true"
                  >
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-2xl font-semibold tracking-tight text-foreground">
                      <CountUp value={metric.value} run={inView} instant={reduced} />
                    </p>
                    <p className="mt-1 text-xs leading-snug text-muted-foreground">{metric.label}</p>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">{section.attentionLabel}</p>
                <span className="flex size-6 items-center justify-center rounded-full bg-status-work text-xs font-semibold text-background">
                  {handoffCount}
                </span>
              </div>
              <ul className="flex flex-col gap-2">
                {section.attention.map((item, index) => {
                  const isActive = rotating && index === active
                  return (
                    <li
                      key={item.label}
                      className={cn(
                        "relative flex flex-col gap-2 overflow-hidden rounded-xl border p-3 transition-colors duration-300 sm:flex-row sm:items-center sm:justify-between",
                        isActive ? "border-brand/40 bg-brand-tint" : "border-border bg-card",
                      )}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{item.label}</p>
                        <p className="truncate text-xs text-muted-foreground">{item.meta}</p>
                      </div>
                      <Chip tone={item.tone} className="self-start sm:self-auto">
                        {item.status}
                      </Chip>
                      {isActive && (
                        <span
                          key={`sweep-${active}`}
                          className="mw-sweep absolute inset-x-0 bottom-0 h-0.5 bg-brand"
                          style={{ animationDuration: `${ROTATE_MS}ms` }}
                          aria-hidden="true"
                        />
                      )}
                    </li>
                  )
                })}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
