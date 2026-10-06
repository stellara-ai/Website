export type CarouselLayout = "hero" | "inset" | "fullscreen"

export type CarouselLayoutClasses = {
  sizer: string
  card: string
  stage: string
}

export const AFTER_HOURS_LAYOUT_CLASSES: Record<CarouselLayout, CarouselLayoutClasses> = {
  hero: {
    sizer: "invisible mx-auto aspect-[10/11] min-h-[26rem] w-[80%] sm:aspect-square sm:min-h-[25rem] sm:w-[62%]",
    card: "absolute left-1/2 top-0 aspect-[10/11] min-h-[26rem] w-[70%] will-change-transform [transform-style:preserve-3d] sm:aspect-square sm:min-h-[25rem] sm:w-[62%]",
    stage: "ah-stage relative isolate flex-1 min-h-[11.5rem] overflow-hidden rounded-[1.25rem] [clip-path:inset(0_round_1.25rem)] sm:min-h-[11rem]",
  },
  inset: {
    sizer: "invisible mx-auto aspect-[4/5] min-h-[24rem] w-[88%] sm:min-h-[27rem] sm:w-[70%]",
    card: "absolute left-1/2 top-0 aspect-[4/5] min-h-[24rem] w-[82%] will-change-transform [transform-style:preserve-3d] sm:min-h-[27rem] sm:w-[70%]",
    stage: "ah-stage relative isolate flex-1 min-h-[12rem] overflow-hidden rounded-[1.25rem] [clip-path:inset(0_round_1.25rem)] sm:min-h-[14rem]",
  },
  fullscreen: {
    sizer: "invisible mx-auto aspect-[4/5] min-h-[30rem] w-[78%] sm:min-h-[34rem] sm:w-[56%]",
    card: "absolute left-1/2 top-0 aspect-[4/5] min-h-[30rem] w-[72%] will-change-transform [transform-style:preserve-3d] sm:min-h-[34rem] sm:w-[56%]",
    stage: "ah-stage relative isolate flex-1 min-h-[15rem] overflow-hidden rounded-[1.25rem] [clip-path:inset(0_round_1.25rem)] sm:min-h-[17rem]",
  },
}
