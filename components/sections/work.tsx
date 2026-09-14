import { ArrowRight, ShieldCheck } from "lucide-react"
import type { SiteContent, WorkPair } from "@/content/schema"
import { Reveal } from "@/components/util/reveal"
import { SectionHeading } from "./section-parts"

export function Work({ content }: { content: SiteContent }) {
  const { work } = content
  return (
    <section id="work" className="scroll-mt-20">
      <div className="container-editorial py-20 md:py-28">
        <SectionHeading eyebrow={work.eyebrow} title={work.title} description={work.description} />

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {work.pairs.map((pair, i) => (
            <Reveal key={pair.id} delay={i * 60}>
              <WorkCard pair={pair} />
            </Reveal>
          ))}
        </div>

        {/* Trust boundaries — every automation runs within clear limits. */}
        <div className="mt-4 rounded-2xl border border-border bg-muted/40 p-7 md:p-8">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="size-5 text-brand" />
            <h3 className="text-base font-semibold text-foreground">{work.boundariesTitle}</h3>
          </div>
          <ul className="mt-5 flex flex-wrap gap-2">
            {work.boundaries.map((boundary) => (
              <li
                key={boundary}
                className="rounded-full border border-border bg-background px-3.5 py-1.5 text-sm text-foreground"
              >
                {boundary}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function WorkCard({ pair }: { pair: WorkPair }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-float">
      {/* Work-moving connector: something enters (from) and Stellara moves it to an action (to). */}
      <div className="flex items-center gap-3">
        <span className="shrink-0 rounded-lg bg-brand-tint px-3 py-1.5 text-xs font-bold text-brand">{pair.from}</span>
        <div className="relative h-px flex-1 bg-border" aria-hidden="true">
          <span className="flow-dot absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand shadow-[0_0_0_3px_var(--brand-tint)]" />
          <ArrowRight className="absolute -right-1 top-1/2 size-3 -translate-y-1/2 text-border" />
        </div>
        <span className="shrink-0 rounded-lg bg-ink px-3 py-1.5 text-xs font-bold text-ink-foreground">{pair.to}</span>
      </div>

      <div className="mt-5 flex items-baseline gap-2.5">
        <span className="label-mono text-muted-foreground">{pair.index}</span>
        <h3 className="text-base font-bold text-foreground">{pair.headline}</h3>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pair.description}</p>

      <ul className="mt-auto flex flex-wrap gap-2 pt-5">
        {pair.capabilities.map((capability) => (
          <li
            key={capability}
            className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground"
          >
            {capability}
          </li>
        ))}
      </ul>
    </article>
  )
}
