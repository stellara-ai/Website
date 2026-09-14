"use client"

import { useEffect, useRef, useState } from "react"

// Splits "prefix + number + suffix" (e.g. "$0", "-60%", "4.2s", "24/7") so the
// numeric core can animate while symbols stay put. Non-numeric values ("Auto") pass through.
const NUMERIC = /^(\D*?)(-?\d+(?:\.\d+)?)(.*)$/

function zeroed(value: string) {
  const m = value.match(NUMERIC)
  if (!m) return value
  const decimals = (m[2].split(".")[1] ?? "").length
  return `${m[1]}${(0).toFixed(decimals)}${m[3]}`
}

/**
 * Counts a stat up to its target when scrolled into view. Honors reduced-motion
 * (jumps straight to the final value) and preserves any prefix/suffix symbols.
 */
export function CountUp({
  value,
  className,
  duration = 1100,
}: {
  value: string
  className?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const [display, setDisplay] = useState(() => zeroed(value))

  useEffect(() => {
    const m = value.match(NUMERIC)
    if (!m) {
      setDisplay(value)
      return
    }

    const prefix = m[1]
    const target = Number.parseFloat(m[2])
    const decimals = (m[2].split(".")[1] ?? "").length
    const suffix = m[3]
    const final = `${prefix}${target.toFixed(decimals)}${suffix}`

    if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(final)
      return
    }

    const node = ref.current
    if (!node) return

    let raf = 0
    let startTs = 0
    const tick = (ts: number) => {
      if (!startTs) startTs = ts
      const progress = Math.min((ts - startTs) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(`${prefix}${(target * eased).toFixed(decimals)}${suffix}`)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            raf = requestAnimationFrame(tick)
            observer.disconnect()
          }
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(node)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value, duration])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}
