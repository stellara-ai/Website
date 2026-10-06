"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type WheelEvent,
} from "react"
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { AFTER_HOURS_LAYOUT_CLASSES, type CarouselLayout } from "./carousel-layout"
import type { Scene } from "./scenes"

const RESUME_AFTER_MS = 6000
const SPACING = 54
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)"

export type StoryControlLabels = {
  previous: string
  next: string
  /** Template with {current} and {total}. */
  progress: string
  illustrative?: string
}

export type StoryCarouselProps = {
  scenes: Scene[]
  ariaLabel: string
  controls: StoryControlLabels
  layout?: CarouselLayout
  className?: string
  autoplay?: boolean
  loop?: boolean
}

function wrapOffset(d: number, n: number) {
  return ((((d + n / 2) % n) + n) % n) - n / 2
}

function cardStyle(d: number, dragging: boolean, reduced: boolean): CSSProperties {
  const abs = Math.abs(d)
  const near = Math.min(abs, 1)
  const clamped = Math.max(-1, Math.min(1, d))
  const scale = 1 - Math.min(abs, 2) * 0.2
  const fade = abs <= 1.35 ? 1 - near * 0.45 : Math.max(0, 0.55 - (abs - 1.35) * 2)
  const duration = dragging || reduced ? "0ms" : "900ms"
  return {
    transform: `translateX(-50%) translateX(${d * SPACING}%) translateY(${-(1 - near) * 26}px) translateZ(${-abs * 120}px) rotateY(${-clamped * 16}deg) scale(${scale})`,
    filter: `saturate(${1 - near * 0.5})`,
    opacity: fade,
    zIndex: 30 - Math.round(abs * 10),
    transition: `transform ${duration} ${EASE}, filter ${duration} ${EASE}, opacity ${duration} ${EASE}`,
  }
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])
  return reduced
}

export function StoryCarousel({
  scenes,
  ariaLabel,
  controls,
  layout = "hero",
  className,
  autoplay = false,
  loop = false,
}: StoryCarouselProps) {
  const layoutClasses = AFTER_HOURS_LAYOUT_CLASSES[layout]
  const n = scenes.length
  const [current, setCurrent] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [inView, setInView] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [holding, setHolding] = useState(false)
  const reduced = usePrefersReducedMotion()

  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ startX: 0, startY: 0, active: false, moved: false })
  const wheel = useRef({ acc: 0, lockedUntil: 0 })
  const holdTimer = useRef<number | undefined>(undefined)

  const playing = autoplay && inView && !hovered && !holding && !dragging && !reduced
  const atStart = !loop && current === 0
  const atEnd = !loop && current === n - 1

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => () => window.clearTimeout(holdTimer.current), [])

  const holdAutoplay = useCallback(() => {
    if (!autoplay) return
    setHolding(true)
    window.clearTimeout(holdTimer.current)
    holdTimer.current = window.setTimeout(() => setHolding(false), RESUME_AFTER_MS)
  }, [autoplay])

  const goTo = useCallback(
    (target: number, fromUser = true) => {
      setCurrent(loop ? ((target % n) + n) % n : Math.max(0, Math.min(n - 1, target)))
      if (fromUser) holdAutoplay()
    },
    [n, loop, holdAutoplay],
  )

  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => goTo(current + 1, false), scenes[current].durationMs)
    return () => window.clearTimeout(timer)
  }, [playing, current, goTo, scenes])

  const cardWidth = () => {
    const card = stageRef.current?.querySelector<HTMLElement>("[data-sizer]")
    return card?.offsetWidth || 1
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return
    drag.current = { startX: e.clientX, startY: e.clientY, active: true, moved: false }
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d.active) return
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    if (!d.moved) {
      if (Math.abs(dx) < 6) return
      if (Math.abs(dy) > Math.abs(dx)) {
        d.active = false
        return
      }
      d.moved = true
      setDragging(true)
    }
    let offset = dx / (cardWidth() * (SPACING / 100))
    // Resist dragging past either end when the story does not loop.
    if (!loop && ((current === 0 && offset > 0) || (current === n - 1 && offset < 0))) offset *= 0.25
    setDragOffset(offset)
  }

  const endDrag = () => {
    const d = drag.current
    if (!d.active) return
    d.active = false
    if (d.moved) {
      let steps = Math.round(dragOffset)
      if (steps === 0 && Math.abs(dragOffset) > 0.15) steps = dragOffset > 0 ? 1 : -1
      goTo(current - steps)
    }
    setDragOffset(0)
    setDragging(false)
  }

  const onWheel = (e: WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
    const now = Date.now()
    if (now < wheel.current.lockedUntil) return
    wheel.current.acc += e.deltaX
    if (Math.abs(wheel.current.acc) > 60) {
      goTo(current + (wheel.current.acc > 0 ? 1 : -1))
      wheel.current = { acc: 0, lockedUntil: now + 650 }
    }
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault()
      goTo(current + 1)
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      goTo(current - 1)
    } else if (e.key === "Home") {
      e.preventDefault()
      goTo(0)
    } else if (e.key === "End") {
      e.preventDefault()
      goTo(n - 1)
    }
  }

  const position = current - dragOffset
  const scene = scenes[current]
  const progressText = controls.progress
    .replace("{current}", String(current + 1))
    .replace("{total}", String(n))

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      className={cn("w-full", className)}
    >
      <div
        ref={stageRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={() => {
          endDrag()
          setHovered(false)
        }}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.stopPropagation()
            drag.current.moved = false
          }
        }}
        className={
          "relative w-full touch-pan-y select-none overscroll-x-contain rounded-3xl outline-none [perspective:1800px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background " +
          (dragging ? "cursor-grabbing" : "cursor-grab")
        }
      >
        <div data-sizer aria-hidden="true" className={layoutClasses.sizer} />

        {scenes.map((s, i) => {
          const raw = i - position
          const d = loop ? wrapOffset(raw, n) : raw
          const isActive = i === current && !dragging
          const isCurrent = i === current
          // A card that only appears adjacent because of looping (e.g. the final
          // outcome peeking beside the opening scene) would spoil the story order.
          const wrapped = loop && Math.abs(d - raw) > 0.5
          const hidden = wrapped || Math.abs(d) > 1.4
          return (
            <div
              key={s.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${n}: ${s.title}`}
              aria-hidden={!isCurrent}
              onClick={isCurrent || hidden ? undefined : () => goTo(i)}
              className={layoutClasses.card + " " + (hidden ? "pointer-events-none" : isCurrent ? "" : "cursor-pointer")}
              style={wrapped ? { ...cardStyle(d, dragging, reduced), opacity: 0 } : cardStyle(d, dragging, reduced)}
            >
              {/* Shadow lives outside the article because its clip-path would clip box-shadow. */}
              <div
                aria-hidden="true"
                className={
                  "ah-lift pointer-events-none absolute inset-0 rounded-[1.75rem] transition-opacity duration-700 " +
                  (isCurrent ? "opacity-100" : "opacity-0")
                }
              />
              <article
                className={
                  "ah-card relative isolate flex h-full flex-col gap-4 overflow-hidden rounded-[1.75rem] p-3.5 text-left text-foreground [clip-path:inset(0_round_1.75rem)] transition-shadow duration-700 sm:p-4 " +
                  s.tone
                }
              >
                <header className="flex items-center justify-between gap-2 px-1.5 pt-1">
                  <span className="flex min-w-0 items-center gap-2 text-xs font-medium text-muted-foreground">
                    <span className="size-1.5 shrink-0 rounded-full bg-scene" aria-hidden="true" />
                    <span className="truncate">{s.step}</span>
                  </span>
                  <span className="shrink-0 font-mono text-xs font-medium tabular-nums text-foreground">{s.time}</span>
                </header>

                <div className={layoutClasses.stage}>{s.visual(isActive)}</div>

                <div className="flex flex-col gap-1.5 px-1.5 pb-1.5">
                  <h3
                    className={
                      "text-balance font-display text-xl font-medium leading-tight tracking-tight text-foreground sm:text-2xl " +
                      (isActive ? "ah-reveal" : "")
                    }
                    style={{ "--ah-delay": "120ms" } as CSSProperties}
                  >
                    {s.headline}
                  </h3>
                  <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              </article>
            </div>
          )
        })}
      </div>

      <div className="mx-auto mt-6 flex w-full max-w-sm items-center justify-between gap-4">
        <CarouselButton label={controls.previous} disabled={atStart} onClick={() => goTo(current - 1)}>
          <CaretLeftIcon weight="fill" className="size-4" aria-hidden="true" />
        </CarouselButton>

        <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <div className="flex w-full items-center gap-1.5" aria-hidden="true">
            {scenes.map((s, i) => (
              <button
                key={s.id}
                type="button"
                tabIndex={-1}
                onClick={() => goTo(i)}
                className="group flex h-4 flex-1 items-center"
              >
                <span
                  className={cn(
                    "h-1 w-full rounded-full transition-colors duration-500",
                    i === current ? "bg-brand" : i < current ? "bg-brand/40" : "bg-border group-hover:bg-muted-foreground/40",
                  )}
                />
              </button>
            ))}
          </div>
          <p className="text-xs font-medium tabular-nums text-muted-foreground">{progressText}</p>
        </div>

        <CarouselButton label={controls.next} disabled={atEnd} onClick={() => goTo(current + 1)}>
          <CaretRightIcon weight="fill" className="size-4" aria-hidden="true" />
        </CarouselButton>
      </div>

      {controls.illustrative && (
        <p className="mt-3 text-center text-xs text-muted-foreground">{controls.illustrative}</p>
      )}

      <p className="sr-only" aria-live={playing ? "off" : "polite"}>
        {`${progressText}, ${scene.time}: ${scene.title}. ${scene.summary}`}
      </p>
    </div>
  )
}

function CarouselButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-[background-color,border-color,opacity,transform] hover:border-brand/50 hover:bg-brand-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95 disabled:pointer-events-none disabled:opacity-35"
    >
      {children}
    </button>
  )
}
