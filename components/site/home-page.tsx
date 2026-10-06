import type { SiteContent } from "@/content/schema"
import { InteractionProvider } from "@/components/providers/interaction-provider"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Hero } from "@/components/sections/hero"
import { PersonalizedDemo } from "@/components/sections/personalized-demo"
import { HowItFits } from "@/components/sections/how-it-fits"
import { MeasurableWork } from "@/components/sections/measurable-work"
import { Plans } from "@/components/sections/plans"
import { TrustFounder } from "@/components/sections/trust-founder"
import { FaqFinalCta } from "@/components/sections/faq-final-cta"

export function HomePage({ content }: { content: SiteContent }) {
  return (
    <InteractionProvider content={content}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
      >
        {content.common.skipToContent}
      </a>
      <SiteHeader content={content} isHome />
      <main id="main">
        <Hero content={content} />
        <PersonalizedDemo content={content} />
        <HowItFits content={content} />
        <MeasurableWork content={content} />
        <Plans content={content} />
        <TrustFounder content={content} />
        <FaqFinalCta content={content} />
      </main>
      <SiteFooter content={content} />
    </InteractionProvider>
  )
}
