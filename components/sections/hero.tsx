"use client"

import { useMemo, useState } from "react"
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

function ServiceDemo({ service, content }: { service: HeroServiceId; content: SiteContent }) {
  const { stories } = content
  const { controls } = stories
  const scenes = useMemo(() => {
    if (service === "treatment-follow-up") return buildTreatmentScenes(stories.treatment)
    if (service === "reviews") return buildReviewsScenes(stories.reviews)
    if (service === "website-intake") return buildWebsiteScenes(stories.website)
    return null
  }, [service, stories])

  if (!scenes) {
    return <AfterHoursCarousel layout="hero" controls={controls} ariaLabel={controls.intakeAriaLabel} />
  }

  const ariaLabel =
    service === "treatment-follow-up"
      ? stories.treatment.ariaLabel
      : service === "reviews"
        ? stories.reviews.ariaLabel
        : stories.website.ariaLabel

  const storyControls =
    service === "reviews" ? { ...controls, illustrative: stories.reviews.illustrative } : controls

  return <StoryCarousel key={service} scenes={scenes} ariaLabel={ariaLabel} controls={storyControls} layout="hero" />
}

export function Hero({ content }: { content: SiteContent }) {
  const { hero } = content
  const [selectedService, setSelectedService] = useState<HeroServiceId>("after-hours")

  return (
    <section className="relative overflow-hidden bg-background">
      <StellaraField />
      <div className="container-editorial relative">
        <div className="flex flex-col items-center gap-10 pb-14 pt-6 text-center md:gap-12 md:pb-20 md:pt-10">
          <div className="hero-load flex min-w-0 max-w-4xl flex-col items-center">
            <h1
              className="whitespace-nowrap font-normal leading-[1.18] tracking-monday text-foreground"
              style={{
                // Scales with the line length so the headline stays on one line in every locale.
                fontSize: `min(3.5rem, calc(min(100vw - 2.5rem, 56rem) / ${(hero.headline.length * 0.49).toFixed(2)}))`,
              }}
            >
              {hero.headline}
            </h1>

            <p className="mt-6 max-w-2xl text-pretty text-[clamp(1rem,.8664rem+0.2155vw,1.125rem)] leading-relaxed text-muted-foreground">
              {hero.supporting}
            </p>

            <div className="mt-10 flex w-full flex-col items-center gap-4">
              <p className="text-sm font-medium text-foreground">{hero.selectorQuestion}</p>
              <HeroServiceSelector
                services={hero.services}
                selected={selectedService}
                label={hero.selectorQuestion}
                onSelect={(id) => {
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
              className="relative w-full min-w-0"
            >
              <ServiceDemo service={selectedService} content={content} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
