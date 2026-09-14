"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ArrowRight,
  Check,
  Wrench,
  Briefcase,
  HeartPulse,
  Scale,
  Building2,
  ShoppingCart,
  Landmark,
  Boxes,
  ChevronDown,
  type LucideIcon,
} from "lucide-react"
import type { SiteContent, IndustryItem } from "@/content/schema"
import { ActionButton } from "@/components/ui/action"
import { StellaraField } from "@/components/util/stellara-field"
import { track } from "@/lib/analytics"

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])
  return reduced
}

const AVATAR_COLORS = ["bg-status-purple", "bg-status-done", "bg-status-work", "bg-brand", "bg-status-stuck"]
// Ordered lifecycle each row advances through: Scoped -> Building -> Live.
const PHASES = [
  { tone: "bg-brand", label: "Scoped" },
  { tone: "bg-status-work", label: "Building" },
  { tone: "bg-status-done", label: "Live" },
] as const

type RowState = { phase: number; progress: number }

const INITIAL_ROW: RowState = { phase: 0, progress: 10 }

// Per-niche visual identity: a unique icon + accent color so each board reads distinctly.
type IndustryStyle = { icon: LucideIcon; solid: string }
const INDUSTRY_STYLE: Record<string, IndustryStyle> = {
  home: { icon: Wrench, solid: "bg-brand" },
  professional: { icon: Briefcase, solid: "bg-status-purple" },
  healthcare: { icon: HeartPulse, solid: "bg-status-done" },
  legal: { icon: Scale, solid: "bg-status-stuck" },
  property: { icon: Building2, solid: "bg-status-work" },
  ecommerce: { icon: ShoppingCart, solid: "bg-brand-strong" },
  government: { icon: Landmark, solid: "bg-brand" },
  other: { icon: Boxes, solid: "bg-status-purple" },
}
const FALLBACK_STYLE: IndustryStyle = { icon: Boxes, solid: "bg-brand" }
const styleFor = (id: string) => INDUSTRY_STYLE[id] ?? FALLBACK_STYLE

// Highest-value categories surfaced first; the rest live behind a "More" toggle.
// This only affects display order — the underlying data model is untouched.
const PRIORITY_IDS = ["home", "professional", "healthcare", "property"]
const VISIBLE_PILLS = 4

export function Hero({ content }: { content: SiteContent }) {
  const { hero } = content
  const industries = content.industries.industries
  const [index, setIndex] = useState(0)
  const [activeIndustry, setActiveIndustry] = useState(0)
  const [showAllIndustries, setShowAllIndustries] = useState(false)

  // Display order: priority categories first, then the remainder in data order.
  // Each entry keeps its real index so board-deck sync and selection stay intact.
  const orderedIndustries = useMemo(() => {
    const withIndex = industries.map((industry, i) => ({ industry, i }))
    const priority = PRIORITY_IDS.map((id) => withIndex.find((x) => x.industry.id === id)).filter(
      (x): x is { industry: IndustryItem; i: number } => Boolean(x),
    )
    const rest = withIndex.filter((x) => !PRIORITY_IDS.includes(x.industry.id))
    return [...priority, ...rest]
  }, [industries])

  const hasMoreIndustries = orderedIndustries.length > VISIBLE_PILLS
  const shownIndustries = useMemo(() => {
    if (showAllIndustries) return orderedIndustries
    const base = orderedIndustries.slice(0, VISIBLE_PILLS)
    // Keep the active pill visible even if it lives beyond the collapsed set.
    if (!base.some((x) => x.i === activeIndustry)) {
      const act = orderedIndustries.find((x) => x.i === activeIndustry)
      if (act) base.push(act)
    }
    return base
  }, [orderedIndustries, showAllIndustries, activeIndustry])

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % hero.rotatingWords.length)
    }, 2200)
    return () => window.clearInterval(timer)
  }, [hero.rotatingWords.length])

  const word = hero.rotatingWords[index]
  const active = industries[activeIndustry] ?? industries[0]

  const labels = useMemo(() => active.flow.slice(0, 5), [active])
  const rowCount = labels.length

  const [states, setStates] = useState<RowState[]>(() => labels.map(() => ({ ...INITIAL_ROW })))
  const reduced = useReducedMotion()

  // Reset the simulation whenever the selected industry changes.
  useEffect(() => {
    if (reduced) {
      setStates(labels.map(() => ({ phase: 2, progress: 100 })))
    } else {
      setStates(labels.map(() => ({ ...INITIAL_ROW })))
    }
  }, [labels, reduced])

  // Drive the "agent working through the backlog" progression.
  useEffect(() => {
    if (reduced || rowCount === 0) return
    const tick = window.setInterval(() => {
      setStates((prev) => {
        const next = prev.map((r) => ({ ...r }))
        const i = next.findIndex((r) => !(r.phase === 2 && r.progress >= 100))
        if (i === -1) return prev
        const r = next[i]
        r.progress += 9
        if (r.progress >= 100) {
          if (r.phase < 2) {
            r.phase += 1
            r.progress = r.phase === 2 ? 100 : 8
          } else {
            r.progress = 100
          }
        }
        return next
      })
    }, 240)
    return () => window.clearInterval(tick)
  }, [rowCount, reduced])

  const allDone = states.length > 0 && states.every((r) => r.phase === 2 && r.progress >= 100)

  // Once the whole board is Live, pause and replay.
  useEffect(() => {
    if (reduced || !allDone) return
    const reset = window.setTimeout(() => {
      setStates(labels.map(() => ({ ...INITIAL_ROW })))
    }, 2200)
    return () => window.clearTimeout(reset)
  }, [allDone, labels, reduced])

  const rows = labels.map((label, i) => {
    const state = states[i] ?? INITIAL_ROW
    return {
      label,
      status: PHASES[state.phase],
      avatar: AVATAR_COLORS[i % AVATAR_COLORS.length],
      progress: state.progress,
    }
  })

  const doneCount = states.filter((r) => r.phase === 2 && r.progress >= 100).length

  const selectIndustry = (i: number) => {
    setActiveIndustry(i)
    track("hero_industry_selected", { industry: industries[i]?.id })
  }

  return (
    <section className="relative overflow-hidden bg-background">
      <StellaraField />
      <div className="container-editorial relative">
        <div className="grid grid-cols-1 items-center gap-12 pb-14 pt-6 md:pb-20 md:pt-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8">
          {/* Left: message */}
          <div className="hero-load min-w-0 max-w-2xl">
            <p className="hero-kicker mb-5">{hero.origin}</p>
            <h1 className="text-balance text-[clamp(1.7rem,6.5vw,2.6rem)] font-normal leading-[1.18] tracking-monday text-foreground sm:text-6xl md:text-[4.25rem]">
              {hero.headlinePrefix}{" "}
              <span className="relative inline align-baseline sm:inline-grid sm:items-baseline sm:align-bottom sm:[&>*]:col-start-1 sm:[&>*]:row-start-1">
                {/* Sizer: at sm+ every word is stacked so the box is always as wide as the
                    longest word, preventing reflow of the trailing text. On mobile the sizer
                    is removed (display:none) so the phrase flows naturally and never overflows. */}
                {hero.rotatingWords.map((w) => (
                  <span key={w} aria-hidden="true" className="hidden whitespace-nowrap sm:inline sm:invisible">
                    {w}
                  </span>
                ))}
                <span key={word} className="word-rotate whitespace-nowrap text-brand">
                  {word}
                </span>
              </span>{" "}
              {hero.headlineSuffix}
            </h1>

            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">{hero.description}</p>

            {/* Interactive demonstration control — visually demoted so it supports,
                rather than competes with, the headline and CTAs. */}
            <div className="mt-8">
              <p className="mb-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {hero.industryLabel}
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                {shownIndustries.map(({ industry, i }) => {
                  const selected = i === activeIndustry
                  return (
                    <button
                      key={industry.id}
                      type="button"
                      onClick={() => selectIndustry(i)}
                      aria-pressed={selected}
                      className={
                        "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-all " +
                        (selected
                          ? "border-brand/50 bg-brand-tint text-brand"
                          : "border-border bg-card text-foreground hover:border-brand/40")
                      }
                    >
                      {selected && <Check className="size-3" aria-hidden="true" />}
                      {industry.name}
                    </button>
                  )
                })}
                {hasMoreIndustries && (
                  <button
                    type="button"
                    onClick={() => setShowAllIndustries((v) => !v)}
                    aria-expanded={showAllIndustries}
                    className="inline-flex items-center gap-0.5 rounded-full px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showAllIndustries ? hero.industryLess : hero.industryMore}
                    <ChevronDown
                      className={"size-3 transition-transform " + (showAllIndustries ? "rotate-180" : "")}
                      aria-hidden="true"
                    />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ActionButton
                variant="primary"
                size="lg"
                onClick={() => {
                  track("hero_cta_selected", { cta: "primary" })
                  scrollToId("explorer")
                }}
              >
                {hero.primaryCta}
                <ArrowRight className="size-4" />
              </ActionButton>
              <ActionButton
                variant="outline"
                size="lg"
                onClick={() => {
                  track("hero_cta_selected", { cta: "secondary" })
                  scrollToId("work")
                }}
              >
                {hero.secondaryCta}
              </ActionButton>
            </div>

            <p className="mt-4 text-sm font-medium text-muted-foreground">{hero.credibility}</p>
          </div>

          {/* Right: a rolodeck of boards. All boards persist and animate between depth slots. */}
          <div className="hero-load-board corner-ticks relative min-w-0 p-3 pb-12 sm:p-4 sm:pb-14">
            <div className="relative w-full">
              {/* Invisible sizer holds the stack open to the live board's height. */}
              <div aria-hidden="true" className="invisible">
                <LiveBoard
                  active={active}
                  rows={rows}
                  allDone={allDone}
                  doneCount={doneCount}
                  rowCount={rowCount}
                  observation={hero.observation}
                />
              </div>

              {industries.map((ind, i) => {
                const n = industries.length
                const slot = (i - activeIndustry + n) % n
                const isFront = slot === 0
                return (
                  <div
                    key={ind.id}
                    className={"absolute inset-0 transition-all duration-500 ease-out will-change-transform " + slotClass(slot)}
                    aria-hidden={!isFront}
                  >
                    {isFront ? (
                      <LiveBoard
                        active={active}
                        rows={rows}
                        allDone={allDone}
                        doneCount={doneCount}
                        rowCount={rowCount}
                        observation={hero.observation}
                      />
                    ) : (
                      <button
                        type="button"
                        tabIndex={slot > 2 ? -1 : 0}
                        onClick={() => selectIndustry(i)}
                        aria-label={`Show ${ind.name}`}
                        className="block w-full text-left"
                      >
                        <GhostBoard industry={ind} />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Depth slot -> transform/opacity. The deck fans straight DOWN and scales in (centered),
// so the front board's width and right edge never shift between niches. Deep slots tuck out of sight.
function slotClass(slot: number) {
  switch (slot) {
    case 0:
      return "z-30 origin-top translate-y-0 scale-100 opacity-100"
    case 1:
      return "z-20 origin-top translate-y-[5%] scale-[0.955] opacity-70"
    case 2:
      return "z-10 origin-top translate-y-[10%] scale-[0.91] opacity-40"
    default:
      return "z-0 pointer-events-none origin-top translate-y-[10%] scale-[0.91] opacity-0"
  }
}

type BoardRow = {
  label: string
  status: { tone: string; label: string }
  avatar: string
  progress: number
}

// The foreground, live-animating board for the active niche.
function LiveBoard({
  active,
  rows,
  allDone,
  doneCount,
  rowCount,
  observation,
}: {
  active: IndustryItem
  rows: BoardRow[]
  allDone: boolean
  doneCount: number
  rowCount: number
  observation: string
}) {
  const style = styleFor(active.id)
  const Icon = style.icon

  return (
    <div className="rounded-3xl border border-border bg-card p-4 shadow-float sm:p-5">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={
              "flex size-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition-colors duration-500 " +
              style.solid
            }
            aria-hidden="true"
          >
            <Icon className="size-5" />
          </span>
          <p className="truncate text-sm font-bold text-foreground">{active.name}</p>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
          <span
            className={"size-1.5 rounded-full " + (allDone ? "bg-status-done" : "animate-pulse bg-brand")}
            aria-hidden="true"
          />
          {doneCount}/{rowCount}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-3 px-1 pb-2 text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground">
        <span>Workflow</span>
        <span className="text-right">Owner</span>
        <span className="text-center">Status</span>
        <span className="text-right">Load</span>
      </div>

      <div className="space-y-2">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-3 rounded-xl border border-border bg-background px-3 py-3"
          >
            <div className="flex items-center gap-2.5 truncate">
              <span
                className={"h-6 w-1.5 shrink-0 rounded-full transition-colors duration-500 " + row.status.tone}
                aria-hidden="true"
              />
              <span className="truncate text-sm font-semibold text-foreground">{row.label}</span>
            </div>
            <span
              className={
                "flex size-6 items-center justify-center rounded-full text-[0.65rem] font-bold text-white " + row.avatar
              }
              aria-hidden="true"
            >
              {String.fromCharCode(65 + i)}
            </span>
            <span
              className={
                "flex w-20 items-center justify-center rounded-md px-2 py-1 text-[0.7rem] font-bold text-white transition-colors duration-500 " +
                row.status.tone
              }
            >
              <span key={row.status.label} className="status-pop">
                {row.status.label}
              </span>
            </span>
            <div className="flex w-14 items-center gap-1.5">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={"h-full rounded-full transition-all duration-300 ease-linear " + row.status.tone}
                  style={{ width: `${row.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating agent chip */}
      <div className="mt-4 flex items-center gap-3 rounded-2xl bg-ink p-3 text-ink-foreground">
        <span
          className={
            "relative flex size-9 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white transition-colors duration-500 " +
            style.solid
          }
        >
          S
          {!allDone && (
            <span
              className="absolute -right-0.5 -top-0.5 size-3 animate-ping rounded-full bg-status-done"
              aria-hidden="true"
            />
          )}
          <span
            className={
              "absolute -right-0.5 -top-0.5 size-3 rounded-full border-2 border-ink " +
              (allDone ? "bg-status-done" : "bg-status-work")
            }
            aria-hidden="true"
          />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{observation}</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[0.7rem] font-bold tabular-nums">
          {allDone ? (
            <Check className="size-3.5 text-status-done" aria-hidden="true" />
          ) : (
            <span className="size-1.5 animate-pulse rounded-full bg-status-done" aria-hidden="true" />
          )}
          {doneCount}/{rowCount}
        </span>
      </div>
    </div>
  )
}

// A dimmed, static board sitting behind the front one in the deck.
function GhostBoard({ industry }: { industry: IndustryItem }) {
  const style = styleFor(industry.id)
  const Icon = style.icon
  return (
    <div className="rounded-3xl border border-border bg-card p-4 shadow-float sm:p-5">
      <div className="flex items-center gap-2.5 border-b border-border pb-3">
        <span
          className={"flex size-9 shrink-0 items-center justify-center rounded-xl text-white " + style.solid}
          aria-hidden="true"
        >
          <Icon className="size-5" />
        </span>
        <span className="truncate text-sm font-bold text-foreground">{industry.name}</span>
      </div>
      <div className="mt-4 space-y-2">
        {industry.flow.slice(0, 5).map((ex, i) => (
          <div key={ex} className="flex items-center gap-2.5 rounded-xl border border-border bg-background px-3 py-3">
            <span className={"h-6 w-1.5 shrink-0 rounded-full " + style.solid} aria-hidden="true" />
            <span className="h-2 rounded-full bg-muted" style={{ width: `${64 - i * 9}%` }} aria-hidden="true" />
          </div>
        ))}
      </div>
      <div className="mt-4 h-14 rounded-2xl bg-muted/60" aria-hidden="true" />
    </div>
  )
}
