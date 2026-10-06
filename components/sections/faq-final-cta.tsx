"use client"

import { useState } from "react"
import { ArrowRight, ChevronDown } from "lucide-react"
import type { SiteContent } from "@/content/schema"
import { ActionButton } from "@/components/ui/action"
import { Reveal } from "@/components/util/reveal"
import { SectionHeading } from "@/components/sections/section-parts"
import { useInteraction } from "@/components/providers/interaction-context"

export function FaqFinalCta({ content }: { content: SiteContent }) {
  const { openAppointment } = useInteraction()
  const [open, setOpen] = useState<number>(0)
  const section = content.faqFinalCta

  return (
    <section id="faq" className="scroll-mt-20 border-y border-border">
      <div className="container-editorial py-20 md:py-24">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
        />

        <div className="mt-10 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card/45 shadow-soft">
          {section.faqs.map((item, index) => {
            const expanded = open === index
            return (
              <div key={item.q}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? -1 : index)}
                >
                  <span className="text-sm font-medium text-foreground sm:text-base">{item.q}</span>
                  <ChevronDown
                    className={"size-4 shrink-0 text-muted-foreground transition-transform " + (expanded ? "rotate-180" : "")}
                    aria-hidden="true"
                  />
                </button>
                {expanded && <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground sm:px-5">{item.a}</p>}
              </div>
            )
          })}
        </div>

        <Reveal className="mt-14 rounded-3xl border border-border bg-card/55 p-7 text-center shadow-soft sm:p-10">
          <h2 className="text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
            {section.finalTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {section.finalDescription}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#personalized-demo" className="inline-flex">
              <ActionButton variant="primary" size="lg">
                {section.primaryCta}
                <ArrowRight className="size-4" aria-hidden="true" />
              </ActionButton>
            </a>
            <ActionButton variant="outline" size="lg" onClick={() => openAppointment({ source: "faq-final-cta" })}>
              {section.secondaryCta}
            </ActionButton>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
