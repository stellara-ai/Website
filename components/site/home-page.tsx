import type { SiteContent } from "@/content/schema"
import { InteractionProvider } from "@/components/providers/interaction-provider"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Hero } from "@/components/sections/hero"
import { Friction } from "@/components/sections/friction"
import { Work } from "@/components/sections/work"
import { Explorer } from "@/components/sections/explorer"
import { Process } from "@/components/sections/process"
import { Software } from "@/components/sections/software"
import { Industries } from "@/components/sections/industries"
import { Principles } from "@/components/sections/principles"
import { FinalCta } from "@/components/sections/final-cta"

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
        <Friction content={content} />
        <Work content={content} />
        <Explorer content={content} />
        <Process content={content} />
        <Software content={content} />
        <Industries content={content} />
        <Principles content={content} />
        <FinalCta content={content} />
      </main>
      <SiteFooter content={content} />
    </InteractionProvider>
  )
}
