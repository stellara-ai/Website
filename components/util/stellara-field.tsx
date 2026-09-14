"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

/**
 * Stellara Field — a theme-aware background treatment.
 *
 * Dark mode: a sparse, mathematically irregular star field. Placement is a
 * jittered grid with dropout, points vary in size/opacity, a subset pulses,
 * drifts, and twinkles, the whole field slowly travels with parallax, and
 * nearby points occasionally connect with an ultra-thin line.
 *
 * Light mode: a very subtle animated engineering grid — a precise coordinate
 * plane at ~4.5% opacity. It is static until the pointer approaches, at which
 * point nearby intersections gently displace toward the pointer (a restrained
 * "gravitational" bend) with spring easing, then relax slowly. A few muted-gold
 * nodes mark interior intersections and respond when their neighborhood bends.
 *
 * Both modes honor prefers-reduced-motion by rendering a single static frame,
 * and the light-mode interaction is disabled on touch / coarse-pointer devices.
 */

type Point = {
  x: number
  y: number
  size: number
  alpha: number
  pulseFreq: number
  pulsePhase: number
  driftAmpX: number
  driftAmpY: number
  driftFreqX: number
  driftFreqY: number
  driftPhaseX: number
  driftPhaseY: number
  parallax: number
}

type Pair = [number, number]

type Connection = {
  pair: Pair
  start: number
  duration: number
}

type Twinkle = {
  index: number
  start: number
  duration: number
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.trim().replace("#", "")
  if (h.length === 3) {
    return [
      parseInt(h[0] + h[0], 16),
      parseInt(h[1] + h[1], 16),
      parseInt(h[2] + h[2], 16),
    ]
  }
  return [
    parseInt(h.slice(0, 2), 16) || 255,
    parseInt(h.slice(2, 4), 16) || 255,
    parseInt(h.slice(4, 6), 16) || 255,
  ]
}

// Small deterministic PRNG so a given size yields a stable, non-repeating field.
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function StellaraField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const host = canvas.parentElement
    if (!host) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduceMedia = window.matchMedia("(prefers-reduced-motion: reduce)")
    const coarseMedia = window.matchMedia("(hover: none), (pointer: coarse)")

    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0
    let raf = 0
    let running = false
    let visible = true

    // "stars" for dark mode, "grid" for light mode — chosen from theme tokens.
    let mode: "stars" | "grid" = "stars"

    // ---- Star-field state (dark mode) --------------------------------------
    let points: Point[] = []
    let pairs: Pair[] = []
    let connections: Connection[] = []
    let nextSpawn = 0
    let twinkles: Twinkle[] = []
    let nextTwinkle = 0

    // Field-wide "travel" drift, in px/ms, scaled per point by its parallax.
    const TRAVEL_VX = 0.0052
    const TRAVEL_VY = -0.0021

    // ---- Engineering-grid state (light mode) -------------------------------
    const GRID_CELL = 110
    const GRAV_RADIUS = 210 // px influence radius around the pointer
    const GRAV_MAX = 6 // px maximum intersection displacement
    const SPRING = 0.12 // easing toward target; lower = slower/softer
    let gCols = 0
    let gRows = 0
    let baseX: number[] = []
    let baseY: number[] = []
    let dispX: Float32Array = new Float32Array(0)
    let dispY: Float32Array = new Float32Array(0)
    let goldIdx: number[] = []
    let pointerX = 0
    let pointerY = 0
    let pointerActive = false

    // ---- Intersection glint (light mode only) ------------------------------
    // "A tiny star emerging from an engineered system." Extremely sparse gold
    // glints that land exactly on real grid intersections, fade in from nothing,
    // briefly catch the light (optionally a tiny four-point star at peak), then
    // vanish. Never a particle system: long irregular silences, 1 at a time.
    const GLINT_LIFE_MIN = 2500
    const GLINT_LIFE_MAX = 3500
    let glints: { cx: number; cy: number; start: number; duration: number }[] = []
    let nextGlintAt = -1
    let glintTimer = 0

    // Colors sampled from the theme tokens.
    let dotRGB: [number, number, number] = [238, 241, 247]
    let lineRGB: [number, number, number] = [232, 200, 138]

    function readColors() {
      const styles = getComputedStyle(document.documentElement)
      const fg = styles.getPropertyValue("--foreground")
      const brand = styles.getPropertyValue("--brand")
      if (fg) dotRGB = hexToRgb(fg)
      if (brand) lineRGB = hexToRgb(brand)
      // Light foreground => dark mode (stars); dark foreground => light mode (grid).
      const lum = (dotRGB[0] + dotRGB[1] + dotRGB[2]) / 3
      mode = lum >= 128 ? "stars" : "grid"
    }

    function resizeCanvas() {
      const rect = host!.getBoundingClientRect()
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    // ------------------------------------------------------------------ build
    function buildStars() {
      const rand = mulberry32(Math.round(width) * 73856093 + Math.round(height) * 19349663)
      const cell = 66
      const jitter = 0.72
      const keep = 0.52
      const cols = Math.ceil(width / cell)
      const rows = Math.ceil(height / cell)
      const next: Point[] = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (rand() > keep) continue
          const x = (c + 0.5 + (rand() - 0.5) * 2 * jitter) * cell
          const y = (r + 0.5 + (rand() - 0.5) * 2 * jitter) * cell
          if (x < 0 || x > width || y < 0 || y > height) continue
          const isPulser = rand() < 0.22
          const isDrifter = rand() < 0.16
          const size = 0.65 + rand() * 1.25
          next.push({
            x,
            y,
            size,
            alpha: 0.5 + rand() * 0.45,
            pulseFreq: isPulser ? (2 * Math.PI) / (9000 + rand() * 8000) : 0,
            pulsePhase: rand() * Math.PI * 2,
            driftAmpX: isDrifter ? 1.5 + rand() * 2.6 : 0,
            driftAmpY: isDrifter ? 1.5 + rand() * 2.6 : 0,
            driftFreqX: (2 * Math.PI) / (26000 + rand() * 20000),
            driftFreqY: (2 * Math.PI) / (26000 + rand() * 20000),
            driftPhaseX: rand() * Math.PI * 2,
            driftPhaseY: rand() * Math.PI * 2,
            parallax: 0.35 + ((size - 0.65) / 1.25) * 0.65,
          })
        }
      }
      points = next

      const maxDist = 118
      const maxDistSq = maxDist * maxDist
      const p: Pair[] = []
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x
          const dy = points[i].y - points[j].y
          const d2 = dx * dx + dy * dy
          if (d2 > 900 && d2 < maxDistSq) p.push([i, j])
        }
      }
      pairs = p
      connections = []
      nextSpawn = 0
      twinkles = []
      nextTwinkle = 0
    }

    function buildGrid() {
      gCols = Math.floor(width / GRID_CELL) + 2
      gRows = Math.floor(height / GRID_CELL) + 2
      // Center the lattice so it isn't flush against the top-left edge.
      const offX = (width - (gCols - 1) * GRID_CELL) / 2
      const offY = (height - (gRows - 1) * GRID_CELL) / 2
      baseX = Array.from({ length: gCols }, (_, c) => offX + c * GRID_CELL)
      baseY = Array.from({ length: gRows }, (_, r) => offY + r * GRID_CELL)
      dispX = new Float32Array(gCols * gRows)
      dispY = new Float32Array(gCols * gRows)
      pointerActive = false
      glints = []
      nextGlintAt = -1

      // Pick 3 muted-gold nodes at interior intersections, deterministically.
      const rand = mulberry32(Math.round(width) * 40503 + Math.round(height) * 12289)
      goldIdx = []
      let guard = 0
      while (goldIdx.length < 3 && guard < 64 && gCols > 2 && gRows > 2) {
        guard++
        const c = 1 + Math.floor(rand() * (gCols - 2))
        const r = 1 + Math.floor(rand() * (gRows - 2))
        const idx = r * gCols + c
        if (!goldIdx.includes(idx)) goldIdx.push(idx)
      }
    }

    function build() {
      resizeCanvas()
      if (mode === "stars") buildStars()
      else buildGrid()
    }

    // ------------------------------------------------------------ static draw
    function drawStaticStars() {
      ctx!.clearRect(0, 0, width, height)
      for (const pt of points) {
        ctx!.beginPath()
        ctx!.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${dotRGB[0]},${dotRGB[1]},${dotRGB[2]},${pt.alpha})`
        ctx!.fill()
      }
    }

    function drawGrid() {
      ctx!.clearRect(0, 0, width, height)
      ctx!.lineWidth = 1
      ctx!.strokeStyle = `rgba(${dotRGB[0]},${dotRGB[1]},${dotRGB[2]},0.045)`
      // Horizontal polylines through the (possibly displaced) intersections.
      for (let r = 0; r < gRows; r++) {
        ctx!.beginPath()
        for (let c = 0; c < gCols; c++) {
          const idx = r * gCols + c
          const x = baseX[c] + dispX[idx]
          const y = baseY[r] + dispY[idx]
          if (c === 0) ctx!.moveTo(x, y)
          else ctx!.lineTo(x, y)
        }
        ctx!.stroke()
      }
      // Vertical polylines.
      for (let c = 0; c < gCols; c++) {
        ctx!.beginPath()
        for (let r = 0; r < gRows; r++) {
          const idx = r * gCols + c
          const x = baseX[c] + dispX[idx]
          const y = baseY[r] + dispY[idx]
          if (r === 0) ctx!.moveTo(x, y)
          else ctx!.lineTo(x, y)
        }
        ctx!.stroke()
      }
      // Muted-gold nodes — grow/brighten slightly with local displacement.
      for (const idx of goldIdx) {
        const c = idx % gCols
        const r = Math.floor(idx / gCols)
        const x = baseX[c] + dispX[idx]
        const y = baseY[r] + dispY[idx]
        const d = Math.min(Math.hypot(dispX[idx], dispY[idx]) / GRAV_MAX, 1)
        const rad = 1.5 + d * 1.1
        const a = 0.34 + d * 0.34
        ctx!.beginPath()
        ctx!.arc(x, y, rad, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${lineRGB[0]},${lineRGB[1]},${lineRGB[2]},${a})`
        ctx!.fill()
      }
    }

    function drawStatic() {
      if (mode === "stars") drawStaticStars()
      else drawGrid()
    }

    // ------------------------------------------------------------- star frame
    function wrap(v: number, span: number) {
      const m = 40
      const range = span + m * 2
      return (((v + m) % range) + range) % range - m
    }
    function posX(pt: Point, now: number) {
      const wobble = pt.driftAmpX ? Math.sin(now * pt.driftFreqX + pt.driftPhaseX) * pt.driftAmpX : 0
      return wrap(pt.x + now * TRAVEL_VX * pt.parallax + wobble, width)
    }
    function posY(pt: Point, now: number) {
      const wobble = pt.driftAmpY ? Math.sin(now * pt.driftFreqY + pt.driftPhaseY) * pt.driftAmpY : 0
      return wrap(pt.y + now * TRAVEL_VY * pt.parallax + wobble, height)
    }

    function starFrame(now: number) {
      if (!running) return
      ctx!.clearRect(0, 0, width, height)

      if (pairs.length > 0 && now >= nextSpawn && connections.length < 2) {
        const pair = pairs[Math.floor(Math.random() * pairs.length)]
        connections.push({ pair, start: now, duration: 4200 + Math.random() * 2600 })
        nextSpawn = now + 5200 + Math.random() * 6500
      }

      connections = connections.filter((con) => now - con.start < con.duration)
      for (const con of connections) {
        const t = (now - con.start) / con.duration
        const env = Math.sin(Math.PI * t)
        const a = env * 0.16
        if (a <= 0.002) continue
        const [i, j] = con.pair
        const pi = points[i]
        const pj = points[j]
        if (!pi || !pj) continue
        const xi = posX(pi, now)
        const yi = posY(pi, now)
        const xj = posX(pj, now)
        const yj = posY(pj, now)
        if (Math.abs(xi - xj) > 160 || Math.abs(yi - yj) > 160) continue
        ctx!.beginPath()
        ctx!.moveTo(xi, yi)
        ctx!.lineTo(xj, yj)
        ctx!.strokeStyle = `rgba(${lineRGB[0]},${lineRGB[1]},${lineRGB[2]},${a})`
        ctx!.lineWidth = 0.5
        ctx!.stroke()
      }

      if (points.length > 0 && now >= nextTwinkle && twinkles.length < 2) {
        twinkles.push({
          index: Math.floor(Math.random() * points.length),
          start: now,
          duration: 1500 + Math.random() * 1100,
        })
        nextTwinkle = now + 2200 + Math.random() * 3600
      }
      twinkles = twinkles.filter((tw) => now - tw.start < tw.duration)

      const twinkleFor = (idx: number) => {
        let boost = 0
        for (const tw of twinkles) {
          if (tw.index !== idx) continue
          const t = (now - tw.start) / tw.duration
          boost = Math.max(boost, Math.sin(Math.PI * t) ** 1.6)
        }
        return boost
      }

      for (let idx = 0; idx < points.length; idx++) {
        const pt = points[idx]
        const x = posX(pt, now)
        const y = posY(pt, now)
        let alpha = pt.pulseFreq
          ? pt.alpha * (0.75 + 0.25 * Math.sin(now * pt.pulseFreq + pt.pulsePhase))
          : pt.alpha
        const boost = twinkleFor(idx)
        const size = boost ? pt.size * (1 + 0.55 * boost) : pt.size
        if (boost) alpha = Math.min(0.95, alpha + boost * 0.5)
        ctx!.beginPath()
        ctx!.arc(x, y, size, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${dotRGB[0]},${dotRGB[1]},${dotRGB[2]},${alpha})`
        ctx!.fill()
      }

      raf = requestAnimationFrame(starFrame)
    }

    // ------------------------------------------------------------- glints
    // A small cluster at once: up to 3 on desktop, 2 on tablet/mobile.
    function glintCap() {
      if (coarseMedia.matches) return 2
      return width >= 1024 ? 3 : 2
    }

    // Long, irregular silences so the grid reads as calm and static — each cluster
    // feels like a discovered moment, not a loop. Touch devices calmer still.
    function glintGap() {
      return coarseMedia.matches ? 11000 + Math.random() * 10000 : 6000 + Math.random() * 8000
    }

    // Spawn a small cluster (2–3) at distinct, well-separated intersections with
    // slightly staggered starts, so several twinkle together without pulsing in unison.
    function spawnGlint(now: number) {
      if (gCols <= 2 || gRows <= 2) return
      const room = glintCap() - glints.length
      if (room <= 0) return
      const count = Math.min(room, coarseMedia.matches ? 2 : 2 + Math.floor(Math.random() * 2))
      const minDist = GRID_CELL * 2
      for (let n = 0; n < count; n++) {
        let cx = 0
        let cy = 0
        for (let attempt = 0; attempt < 8; attempt++) {
          const c = 1 + Math.floor(Math.random() * (gCols - 2))
          const r = 1 + Math.floor(Math.random() * (gRows - 2))
          cx = baseX[c]
          cy = baseY[r]
          const tooClose = glints.some((g) => Math.hypot(g.cx - cx, g.cy - cy) < minDist)
          if (!tooClose) break
        }
        glints.push({
          cx,
          cy,
          // Near-simultaneous rise with only a small phase offset, so the cluster
          // twinkles together rather than one-at-a-time.
          start: now + Math.random() * 180,
          duration: GLINT_LIFE_MIN + Math.random() * (GLINT_LIFE_MAX - GLINT_LIFE_MIN),
        })
      }
    }

    function drawGlints(now: number) {
      glints = glints.filter((g) => now - g.start < g.duration)
      const [gr, gg, gb] = lineRGB
      for (const g of glints) {
        const t = (now - g.start) / g.duration
        const e = Math.sin(Math.PI * t)
        if (e <= 0.001) continue
        // Gentle envelope so the glint is visible for most of its life.
        const env = Math.pow(e, 1.3)
        // Soft gold glow.
        const glowR = 16
        const glowA = env * 0.4
        if (glowA > 0.004) {
          const grad = ctx!.createRadialGradient(g.cx, g.cy, 0, g.cx, g.cy, glowR)
          grad.addColorStop(0, `rgba(${gr},${gg},${gb},${glowA})`)
          grad.addColorStop(1, `rgba(${gr},${gg},${gb},0)`)
          ctx!.fillStyle = grad
          ctx!.beginPath()
          ctx!.arc(g.cx, g.cy, glowR, 0, Math.PI * 2)
          ctx!.fill()
        }
        // Four-point star spike, visible for most of the life, strongest at peak.
        if (env > 0.12) {
          const s = (env - 0.12) / 0.88
          const len = 3 + s * 6
          ctx!.strokeStyle = `rgba(${gr},${gg},${gb},${s * 0.7})`
          ctx!.lineWidth = 1
          ctx!.beginPath()
          ctx!.moveTo(g.cx - len, g.cy)
          ctx!.lineTo(g.cx + len, g.cy)
          ctx!.moveTo(g.cx, g.cy - len)
          ctx!.lineTo(g.cx, g.cy + len)
          ctx!.stroke()
        }
        // Gold core.
        ctx!.beginPath()
        ctx!.arc(g.cx, g.cy, 1.4 + env * 1.4, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${gr},${gg},${gb},${0.35 + env * 0.6})`
        ctx!.fill()
      }
    }

    // Sleep the RAF during silent gaps, then wake it exactly when the next glint
    // is due — so the grid stays truly static and cheap between glints.
    function scheduleGlintWake(now: number) {
      if (mode !== "grid" || reduceMedia.matches || !visible || glintTimer) return
      const delay = Math.max(0, (nextGlintAt < 0 ? now + 3000 : nextGlintAt) - now)
      glintTimer = window.setTimeout(() => {
        glintTimer = 0
        if (mode === "grid" && !reduceMedia.matches && visible) startLoop()
      }, delay)
    }

    // ------------------------------------------------------------- grid frame
    function gridFrame(now: number) {
      if (!running) return
      const canGrav = pointerActive && !coarseMedia.matches
      let residual = 0
      for (let r = 0; r < gRows; r++) {
        for (let c = 0; c < gCols; c++) {
          const idx = r * gCols + c
          let tx = 0
          let ty = 0
          if (canGrav) {
            const ddx = pointerX - baseX[c]
            const ddy = pointerY - baseY[r]
            const dist = Math.hypot(ddx, ddy)
            if (dist < GRAV_RADIUS && dist > 0.001) {
              // Quadratic falloff for a soft, localized bend.
              const falloff = 1 - dist / GRAV_RADIUS
              const mag = GRAV_MAX * falloff * falloff
              tx = (ddx / dist) * mag
              ty = (ddy / dist) * mag
            }
          }
          const nx = dispX[idx] + (tx - dispX[idx]) * SPRING
          const ny = dispY[idx] + (ty - dispY[idx]) * SPRING
          dispX[idx] = nx
          dispY[idx] = ny
          residual = Math.max(residual, Math.abs(nx - tx), Math.abs(ny - ty), Math.abs(tx), Math.abs(ty))
        }
      }
      drawGrid()

      // Schedule + draw the sparse intersection glints on top of the static grid.
      if (nextGlintAt < 0) {
        nextGlintAt = now + 2500 + Math.random() * 4000
      } else if (now >= nextGlintAt) {
        if (glints.length < glintCap()) spawnGlint(now)
        nextGlintAt = now + glintGap()
      }
      drawGlints(now)

      // Stop once settled, the pointer is no longer bending the field, and no
      // glint is active — so the grid is truly static at rest. A timer relights
      // the loop when the next glint is due.
      if (!canGrav && residual < 0.06 && glints.length === 0) {
        running = false
        scheduleGlintWake(now)
        return
      }
      raf = requestAnimationFrame(gridFrame)
    }

    // --------------------------------------------------------- loop lifecycle
    function startLoop() {
      if (running || reduceMedia.matches || !visible) return
      if (glintTimer) {
        clearTimeout(glintTimer)
        glintTimer = 0
      }
      running = true
      raf = requestAnimationFrame(mode === "stars" ? starFrame : gridFrame)
    }

    function stop() {
      running = false
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      if (glintTimer) {
        clearTimeout(glintTimer)
        glintTimer = 0
      }
    }

    function rebuild() {
      stop()
      readColors()
      build()
      if (reduceMedia.matches) drawStatic()
      else if (visible) startLoop()
    }

    // ------------------------------------------------------- pointer tracking
    function onPointerMove(e: PointerEvent) {
      if (mode !== "grid" || reduceMedia.matches || coarseMedia.matches) return
      const rect = host!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const inRange = x > -GRAV_RADIUS && x < width + GRAV_RADIUS && y > -GRAV_RADIUS && y < height + GRAV_RADIUS
      if (inRange) {
        pointerX = x
        pointerY = y
        pointerActive = true
        if (!running && visible) startLoop()
      } else if (pointerActive) {
        pointerActive = false
        if (!running && visible) startLoop()
      }
    }

    function releasePointer() {
      if (!pointerActive) return
      pointerActive = false
      if (!running && visible) startLoop()
    }

    // ------------------------------------------------------------------ init
    readColors()
    build()
    if (reduceMedia.matches) drawStatic()
    else startLoop()

    const ro = new ResizeObserver(() => rebuild())
    ro.observe(host)

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true
        if (!visible) stop()
        else if (!reduceMedia.matches) startLoop()
      },
      { threshold: 0 },
    )
    io.observe(host)

    // Re-sample colors and switch mode when the theme class on <html> changes.
    const mo = new MutationObserver(() => rebuild())
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    const onReduceChange = () => rebuild()
    reduceMedia.addEventListener("change", onReduceChange)

    window.addEventListener("pointermove", onPointerMove, { passive: true })
    window.addEventListener("blur", releasePointer)
    document.addEventListener("mouseleave", releasePointer)

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      mo.disconnect()
      reduceMedia.removeEventListener("change", onReduceChange)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("blur", releasePointer)
      document.removeEventListener("mouseleave", releasePointer)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        "[mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_92%)]",
        className,
      )}
    />
  )
}
