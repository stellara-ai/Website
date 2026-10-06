import type { SiteContent } from "@/content/schema"
import { SectionHeading } from "@/components/sections/section-parts"
import { Reveal } from "@/components/util/reveal"

export function HowItFits({ content }: { content: SiteContent }) {
  const section = content.howItFits

  return (
    <section id="fit" className="scroll-mt-20 border-t border-border">
      <div className="container-editorial py-20 md:py-24">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
        />

        <Reveal className="mt-12 rounded-3xl border border-border bg-card/40 p-5 shadow-soft sm:p-8">
          <div className="grid gap-3 text-sm sm:grid-cols-4">
            {section.incoming.map((item) => (
              <FlowPill key={item} label={item} />
            ))}
          </div>

          <FlowArrow />

          <div className="mx-auto max-w-sm rounded-2xl border border-brand/35 bg-brand-tint px-5 py-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">{section.brandLabel}</p>
          </div>

          <FlowArrow />

          <div className="grid gap-3 text-sm sm:grid-cols-4">
            {section.core.map((item) => (
              <FlowPill key={item} label={item} />
            ))}
          </div>

          <FlowArrow />

          <div className="grid gap-3 text-sm sm:grid-cols-3">
            {section.output.map((item) => (
              <FlowPill key={item} label={item} tone="solid" />
            ))}
          </div>
        </Reveal>

        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">{section.footnote}</p>
      </div>
    </section>
  )
}

function FlowArrow() {
  return (
    <div className="my-4 flex justify-center" aria-hidden="true">
      <span className="h-8 w-px bg-border" />
    </div>
  )
}

function FlowPill({ label, tone = "soft" }: { label: string; tone?: "soft" | "solid" }) {
  return (
    <div
      className={
        "rounded-xl border px-3 py-2.5 text-center font-medium " +
        (tone === "solid"
          ? "border-foreground/20 bg-foreground/[0.04] text-foreground"
          : "border-border bg-background/80 text-muted-foreground")
      }
    >
      {label}
    </div>
  )
}
