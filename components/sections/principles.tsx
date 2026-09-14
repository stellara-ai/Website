import type { SiteContent } from "@/content/schema"
import { Reveal } from "@/components/util/reveal"
import { StellaraField } from "@/components/util/stellara-field"
import { SectionHeading } from "./section-parts"

export function Principles({ content }: { content: SiteContent }) {
  const { principles } = content
  return (
    <section id="philosophy" className="relative overflow-hidden scroll-mt-20">
      <StellaraField />
      <div className="container-editorial relative py-20 md:py-28">
        <SectionHeading
          eyebrow={principles.eyebrow}
          title={principles.title}
          description={principles.description}
        />

        <div className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {principles.principles.map((principle, i) => (
            <Reveal key={principle.title} delay={i * 80}>
              <div className="flex flex-col">
                <span className="font-mono text-sm text-brand">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{principle.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{principle.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
