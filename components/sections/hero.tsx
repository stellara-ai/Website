"use client"

import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import type { SiteContent } from "@/content/schema"
import { ActionButton } from "@/components/ui/action"
import { StellaraField } from "@/components/util/stellara-field"
import { AfterHoursCarousel } from "@/components/sections/after-hours/after-hours-carousel"
import { track } from "@/lib/analytics"

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
}

export function Hero({ content }: { content: SiteContent }) {
  const { hero } = content
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % hero.rotatingWords.length)
    }, 2200)
    return () => window.clearInterval(timer)
  }, [hero.rotatingWords.length])

  const word = hero.rotatingWords[index]

  return (
    <section className="relative overflow-hidden bg-background">
      <StellaraField />
      <div className="container-editorial relative">
        <div className="grid grid-cols-1 items-center gap-12 pb-14 pt-6 md:pb-20 md:pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
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

          <div className="hero-load-board relative min-w-0">
            <AfterHoursCarousel />
          </div>
        </div>
      </div>
    </section>
  )
}
