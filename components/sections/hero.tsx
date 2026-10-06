"use client"

import { useCallback, useMemo, useState, type CSSProperties } from "react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { ActionButton } from "@/components/ui/action"
import type { HeroServiceId, SiteContent } from "@/content/schema"
import { StellaraField } from "@/components/util/stellara-field"
import { AfterHoursCarousel } from "@/components/sections/after-hours/after-hours-carousel"
import { StoryCarousel } from "@/components/sections/after-hours/story-carousel"
import { buildTreatmentScenes } from "@/components/sections/stories/treatment-scenes"
import { buildReviewsScenes } from "@/components/sections/stories/reviews-scenes"
import { buildWebsiteScenes } from "@/components/sections/stories/website-scenes"
import {
  HERO_SERVICE_PANEL_ID,
  HeroServiceSelector,
  heroServiceTabId,
} from "@/components/sections/hero-service-selector"
import { track } from "@/lib/analytics"

function ServiceDemo({
  service,
  content,
  onCycleComplete,
}: {
  service: HeroServiceId
  content: SiteContent
  onCycleComplete?: () => void
}) {
  const { stories } = content
  const { controls } = stories
  const scenes = useMemo(() => {
    if (service === "treatment-follow-up") return buildTreatmentScenes(stories.treatment)
    if (service === "reviews") return buildReviewsScenes(stories.reviews)
    if (service === "website-intake") return buildWebsiteScenes(stories.website)
    return null
  }, [service, stories])

  if (!scenes) {
    return (
      <AfterHoursCarousel
        layout="hero"
        controls={controls}
        ariaLabel={controls.intakeAriaLabel}
        onCycleComplete={onCycleComplete}
      />
    )
  }

  const ariaLabel =
    service === "treatment-follow-up"
      ? stories.treatment.ariaLabel
      : service === "reviews"
        ? stories.reviews.ariaLabel
        : stories.website.ariaLabel

  const storyControls =
    service === "reviews" ? { ...controls, illustrative: stories.reviews.illustrative } : controls

  return (
    <StoryCarousel
      key={service}
      scenes={scenes}
      ariaLabel={ariaLabel}
      controls={storyControls}
      layout="hero"
      autoplay
      loop
      onCycleComplete={onCycleComplete}
    />
  )
}

export function Hero({ content }: { content: SiteContent }) {
  const { hero } = content
  const [selectedService, setSelectedService] = useState<HeroServiceId>("after-hours")
  const [autoCycle, setAutoCycle] = useState(true)

  const advanceService = useCallback(() => {
    setSelectedService((prev) => {
      const ids = hero.services.map((s) => s.id)
      return ids[(ids.indexOf(prev) + 1) % ids.length] ?? prev
    })
  }, [hero.services])

  return (
    <section className="relative overflow-hidden bg-background">
      <StellaraField />
      <div className="container-editorial relative">
        <div className="flex flex-col items-center gap-10 pb-14 pt-6 text-center md:gap-12 md:pb-20 md:pt-10">
          <div className="hero-load flex w-full min-w-0 max-w-4xl flex-col items-center">
            <h1
              className="text-balance text-[clamp(1.75rem,1.1rem+3.2vw,2.25rem)] font-normal leading-[1.18] tracking-monday text-foreground sm:whitespace-nowrap sm:text-[length:var(--hero-fit)]"
              style={
                {
                  // From sm up, scale with line length so the headline stays on one line in every locale;
                  // on phones it wraps instead so it never shrinks below a readable size.
                  "--hero-fit": `min(3.5rem, calc(min(100vw - 2.5rem, 56rem) / ${(hero.headline.length * 0.49).toFixed(2)}))`,
                } as CSSProperties
              }
            >
              {hero.headline}
            </h1>

            <p className="mt-5 max-w-[44ch] text-pretty text-[clamp(1rem,.8664rem+0.2155vw,1.125rem)] font-normal leading-relaxed text-foreground sm:mt-6">
              {hero.supporting}
            </p>

            <ActionButton
              variant="primary"
              className="mt-6 h-auto min-h-11 max-w-full whitespace-normal py-2.5 text-center lg:hidden"
              onClick={() => {
                track("hero_cta_selected", { source: "hero-mobile" })
                document.getElementById("personalized-demo")?.scrollIntoView({ behavior: "smooth", block: "start" })
              }}
            >
              {content.navCta}
              <ArrowRightIcon weight="bold" className="size-4" aria-hidden="true" />
            </ActionButton>

            <div className="mt-8 flex w-full flex-col items-center gap-4">
              <p className="text-sm font-medium text-foreground">{hero.selectorQuestion}</p>
              <HeroServiceSelector
                services={hero.services}
                selected={selectedService}
                label={hero.selectorQuestion}
                onSelect={(id) => {
                  setAutoCycle(false)
                  if (id === selectedService) return
                  setSelectedService(id)
                  track("hero_service_selected", { service: id })
                }}
              />
            </div>
          </div>

          <div className="hero-load-board flex w-full min-w-0 max-w-2xl flex-col items-center gap-8">
            <div
              id={HERO_SERVICE_PANEL_ID}
              role="tabpanel"
              aria-labelledby={heroServiceTabId(selectedService)}
              data-service={selectedService}
              data-service-theme={selectedService}
              className="relative w-full min-w-0"
            >
              <ServiceDemo
                service={selectedService}
                content={content}
                onCycleComplete={autoCycle ? advanceService : undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
