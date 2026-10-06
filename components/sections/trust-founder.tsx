import type { SiteContent } from "@/content/schema"
import { SectionHeading } from "@/components/sections/section-parts"
import { Reveal } from "@/components/util/reveal"

export function TrustFounder({ content }: { content: SiteContent }) {
  const section = content.trustFounder

  return (
    <section id="trust" className="scroll-mt-20 border-t border-border">
      <div className="container-editorial py-20 md:py-24">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
        />

        <Reveal className="mt-10 grid gap-6 rounded-3xl border border-border bg-card/45 p-6 shadow-soft md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div className="flex items-center justify-center">
            <div className="aspect-[4/5] w-full max-w-[18rem] rounded-2xl border border-dashed border-border bg-background/70 p-4">
              <div className="flex h-full items-center justify-center rounded-xl border border-border bg-card/70 text-center">
                <p className="max-w-[12rem] text-xs leading-relaxed text-muted-foreground">
                  {section.imagePlaceholder}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-lg leading-relaxed text-foreground">{section.paragraphOne}</p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{section.paragraphTwo}</p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-tint px-3.5 py-1.5 text-sm font-medium text-brand">
              <span className="size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
              {section.tagline}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
