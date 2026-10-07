import type { SiteContent } from "@/content/schema"
import { DashboardSim } from "@/components/sections/dashboard-sim"
import { SectionHeading } from "@/components/sections/section-parts"
import { Reveal } from "@/components/util/reveal"

export function MeasurableWork({ content }: { content: SiteContent }) {
  const section = content.measurableWork

  return (
    <section id="measurement" className="scroll-mt-20">
      <div className="container-editorial py-20 md:py-24">
        <SectionHeading title={section.title} description={section.description} />

        <Reveal className="mt-10">
          <DashboardSim section={section} />
          <p className="mt-4 max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">{section.illustrative}.</span> {section.footnote}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
