import type { SiteContent } from "@/content/schema"
import { SectionHeading } from "@/components/sections/section-parts"
import { Reveal } from "@/components/util/reveal"

export function MeasurableWork({ content }: { content: SiteContent }) {
  const section = content.measurableWork

  return (
    <section id="measurement" className="scroll-mt-20 border-t border-border">
      <div className="container-editorial grid gap-12 py-20 md:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
        />

        <Reveal className="relative">
          <div
            className="absolute inset-x-6 -bottom-3 h-full rounded-3xl border border-border bg-card/30"
            aria-hidden="true"
          />
          <div className="relative rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <span className="size-2 rounded-full bg-brand" aria-hidden="true" />
                {section.reportLabel}
              </p>
              <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                {section.dashboardLabel}
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {section.metrics.map((metric, index) => (
                <Reveal
                  key={metric.label}
                  delay={index * 60}
                  className="rounded-2xl border border-border bg-background/75 p-4 transition-colors hover:border-brand/40"
                >
                  <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">{metric.label}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{metric.value}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
