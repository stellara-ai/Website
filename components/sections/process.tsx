import type { SiteContent } from "@/content/schema"
import { Reveal } from "@/components/util/reveal"
import { SectionHeading } from "./section-parts"

export function Process({ content }: { content: SiteContent }) {
  const { process } = content
  return (
    <section id="process" className="scroll-mt-20">
      <div className="container-editorial py-20 md:py-28">
        <SectionHeading eyebrow={process.eyebrow} title={process.title} />

        <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {process.phases.map((phase, i) => (
            <Reveal key={phase.index} delay={i * 80} as="li" className="bg-card">
              <div className="flex h-full flex-col p-7">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-brand">{phase.index}</span>
                  <span className="h-px flex-1 bg-border" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{phase.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{phase.description}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
