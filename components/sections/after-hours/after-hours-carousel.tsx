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
import { ChevronLeft, ChevronRight } from "lucide-react"
import { SCENES } from "./scenes"

const RESUME_AFTER_MS = 6000
const SPACING = 54
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)"

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
    transform: `translateX(-50%) translateX(${d * SPACING}%) translateY(${-(1 - near) * 18}px) translateZ(${-abs * 120}px) rotateY(${-clamped * 16}deg) scale(${scale})`,
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

export function AfterHoursCarousel() {
  const n = SCENES.length
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

  const playing = inView && !hovered && !holding && !dragging && !reduced

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => () => window.clearTimeout(holdTimer.current), [])

  const holdAutoplay = useCallback(() => {
    setHolding(true)
    window.clearTimeout(holdTimer.current)
    holdTimer.current = window.setTimeout(() => setHolding(false), RESUME_AFTER_MS)
  }, [])

  const goTo = useCallback(
    (target: number, fromUser = true) => {
      setCurrent(((target % n) + n) % n)
      if (fromUser) holdAutoplay()
    },
    [n, holdAutoplay],
  )

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
    setDragOffset(dx / (cardWidth() * (SPACING / 100)))
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
    }
  }

  const position = current - dragOffset
  const scene = SCENES[current]

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="After hours: how Stellara handles a call when your office is closed"
      className="flex w-full flex-col gap-6"
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
        <div data-sizer aria-hidden="true" className="invisible mx-auto aspect-[4/5] w-[80%] sm:w-[62%]" />

        {SCENES.map((s, i) => {
          const d = wrapOffset(i - position, n)
          const isActive = i === current && !dragging
          const isCurrent = i === current
          // A card that only appears adjacent because of looping (e.g. the final
          // outcome peeking beside the opening scene) would spoil the story order.
          const wrapped = Math.abs(d - (i - position)) > 0.5
          const hidden = wrapped || Math.abs(d) > 1.4
          return (
            <div
              key={s.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}: ${s.title}`}
              aria-hidden={!isCurrent}
              onClick={isCurrent ? undefined : () => goTo(i)}
              className={
                "absolute left-1/2 top-0 aspect-[4/5] w-[70%] will-change-transform [transform-style:preserve-3d] sm:w-[62%] " +
                (hidden ? "pointer-events-none" : isCurrent ? "" : "cursor-pointer")
              }
              style={wrapped ? { ...cardStyle(d, dragging, reduced), opacity: 0 } : cardStyle(d, dragging, reduced)}
            >
              <article
                className={
                  "ah-card relative isolate flex h-full flex-col gap-4 overflow-hidden rounded-[1.75rem] p-3.5 text-foreground [clip-path:inset(0_round_1.75rem)] transition-shadow duration-700 sm:p-4 " +
                  s.tone +
                  (isCurrent ? " ah-glow" : "")
                }
              >
                <header className="flex items-center justify-between px-1.5 pt-1">
                  <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-scene" aria-hidden="true" />
                    {s.step}
                  </span>
                  <span className="font-mono text-xs font-medium tabular-nums text-foreground">{s.time}</span>
                </header>

                <div className="ah-stage relative isolate flex-1 overflow-hidden rounded-[1.25rem] [clip-path:inset(0_round_1.25rem)]">
                  {s.visual(isActive)}
                </div>

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

      <div className="mx-auto flex w-[70%] items-center gap-3 sm:w-[62%]">
        <button
          type="button"
          onClick={() => goTo(current - 1)}
          aria-label="Previous scene"
          className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-foreground/30"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>

        <div className="flex flex-1 items-start gap-1.5">
          {SCENES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to scene ${i + 1}: ${s.title}`}
              aria-current={i === current ? "step" : undefined}
              className="group flex flex-1 flex-col py-2 text-left"
            >
              <span className="relative h-1 w-full overflow-hidden rounded-full bg-border">
                {i < current && <span className="ah-progress-fill absolute inset-0" />}
                {i === current && (
                  <span
                    key={`${current}-${reduced}`}
                    className={"ah-progress-fill absolute inset-0 " + (reduced ? "" : "ah-progress")}
                    style={
                      {
                        "--ah-duration": `${s.durationMs}ms`,
                        animationPlayState: playing ? "running" : "paused",
                      } as CSSProperties
                    }
                    onAnimationEnd={() => goTo(current + 1, false)}
                  />
                )}
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(current + 1)}
          aria-label="Next scene"
          className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-foreground/30"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>

      <p className="sr-only" aria-live={playing ? "off" : "polite"}>
        {`Scene ${current + 1} of ${n}, ${scene.time}: ${scene.title}. ${scene.summary}`}
      </p>
    </div>
  )
}
