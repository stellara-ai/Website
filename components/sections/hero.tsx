"use client"

import { useState, type ComponentType } from "react"
import { ArrowRight } from "lucide-react"
import type { HeroServiceId, SiteContent } from "@/content/schema"
import { ActionButton } from "@/components/ui/action"
import { StellaraField } from "@/components/util/stellara-field"
import { AfterHoursCarousel } from "@/components/sections/after-hours/after-hours-carousel"
import {
  HERO_SERVICE_PANEL_ID,
  HeroServiceSelector,
  heroServiceTabId,
} from "@/components/sections/hero-service-selector"
import { track } from "@/lib/analytics"

// Each service maps to its own demonstration. They all share the existing
// carousel for now; swap in a per-service component here without touching the hero.
const serviceDemos: Record<HeroServiceId, ComponentType> = {
  "after-hours": AfterHoursCarousel,
  reviews: AfterHoursCarousel,
  "website-intake": AfterHoursCarousel,
  "treatment-follow-up": AfterHoursCarousel,
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
}

export function Hero({ content }: { content: SiteContent }) {
  const { hero } = content
  const [selectedService, setSelectedService] = useState<HeroServiceId>("after-hours")

  const Demo = serviceDemos[selectedService]

  return (
    <section className="relative overflow-hidden bg-background">
      <StellaraField />
      <div className="container-editorial relative">
        <div className="flex flex-col items-center gap-10 pb-14 pt-6 text-center md:gap-12 md:pb-20 md:pt-10">
          <div className="hero-load flex min-w-0 max-w-4xl flex-col items-center">
            <p className="hero-kicker mb-5">{hero.eyebrow}</p>
            <h1 className="text-balance text-[clamp(1.7rem,6.5vw,2.6rem)] font-normal leading-[1.18] tracking-monday text-foreground sm:text-6xl md:text-[4.25rem]">
              {hero.headline}
            </h1>

            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
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
              <Demo />
            </div>

            <ActionButton
              variant="primary"
              size="lg"
              onClick={() => {
                track("hero_cta_selected", { cta: "primary", service: selectedService })
                scrollToId("explorer")
              }}
            >
              {hero.demoCta}
              <ArrowRight className="size-4" />
            </ActionButton>
          </div>
        </div>
      </div>
    </section>
  )
}
