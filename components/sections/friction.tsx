import type { SiteContent } from "@/content/schema"
import { Reveal } from "@/components/util/reveal"
import { Eyebrow } from "./section-parts"

export function Friction({ content }: { content: SiteContent }) {
  const { friction } = content
  return (
    <section className="overflow-hidden border-y border-border">
      <div className="container-editorial py-24 md:py-36">
        <div className="grid gap-12 lg:grid-cols-[15rem_1fr] lg:gap-20">
          {/* Sticky editorial label — anchors the asymmetric layout. */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>{friction.eyebrow}</Eyebrow>
            <div className="mt-6 h-px w-16 bg-brand" aria-hidden="true" />
          </div>

          <div>
            <ol>
              {friction.statements.map((statement, i) => (
                <Reveal
                  key={statement}
                  as="li"
                  delay={i * 80}
                  className="flex items-baseline gap-5 border-t border-border py-6 md:gap-8 md:py-8"
                >
                  <span className="font-mono text-sm text-brand">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-balance text-2xl font-medium leading-[1.15] tracking-tight text-foreground sm:text-3xl md:text-[2.5rem]">
                    {statement}
                  </p>
                </Reveal>
              ))}
            </ol>

            {/* The oversized payoff line — the section's single loud moment. */}
            <Reveal delay={friction.statements.length * 80 + 80}>
              <p className="mt-14 max-w-4xl text-balance text-4xl font-semibold leading-[1.03] tracking-tight text-foreground sm:text-5xl md:text-6xl">
                {friction.conclusion}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
