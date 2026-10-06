"use client"

import type { CarouselLayout } from "./carousel-layout"
import { SCENES } from "./scenes"
import { StoryCarousel, type StoryControlLabels } from "./story-carousel"

type AfterHoursCarouselProps = {
  controls: StoryControlLabels
  layout?: CarouselLayout
  className?: string
  ariaLabel?: string
  onCycleComplete?: () => void
}

/** The original 24/7 intake story: looping with autoplay, as it has always behaved. */
export function AfterHoursCarousel({
  controls,
  layout = "hero",
  className,
  ariaLabel = "After hours: how Stellara Agent handles a call when your office is closed",
  onCycleComplete,
}: AfterHoursCarouselProps) {
  return (
    <StoryCarousel
      scenes={SCENES}
      ariaLabel={ariaLabel}
      controls={controls}
      layout={layout}
      className={className}
      autoplay
      loop
      onCycleComplete={onCycleComplete}
    />
  )
}
