import { Info } from "lucide-react"
import type { SiteContent } from "@/content/schema"
import { SectionHeading } from "./section-parts"
import { IndustriesShowcase } from "@/components/interactive/industries-showcase"

export function Industries({ content }: { content: SiteContent }) {
  const { industries } = content
  return (
    <section id="industries" className="scroll-mt-20 border-t border-border bg-muted/40">
      <div className="container-editorial py-20 md:py-28">
        <SectionHeading eyebrow={industries.eyebrow} title={industries.title} description={industries.description} />

        <IndustriesShowcase content={{ ...industries, locale: content.locale }} />

        <p className="mt-12 flex items-start gap-2.5 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0" />
          <span className="max-w-3xl text-pretty">{industries.note}</span>
        </p>
      </div>
    </section>
  )
}
