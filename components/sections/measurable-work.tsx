import type { SiteContent } from "@/content/schema"
import { SectionHeading } from "@/components/sections/section-parts"
import { Reveal } from "@/components/util/reveal"

export function MeasurableWork({ content }: { content: SiteContent }) {
  const section = content.measurableWork

  return (
    <section id="measurement" className="scroll-mt-20 border-t border-border">
      <div className="container-editorial py-20 md:py-24">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
        />

        <Reveal className="mt-12 rounded-3xl border border-border bg-card/40 p-5 shadow-soft sm:p-7">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
            <p className="text-sm font-semibold text-foreground">{section.reportLabel}</p>
            <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
              {section.dashboardLabel}
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {section.metrics.map((metric, index) => (
              <Reveal
                key={metric.label}
                delay={index * 60}
                className="rounded-2xl border border-border bg-background/75 p-4"
              >
                <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">{metric.label}</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{metric.value}</p>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
