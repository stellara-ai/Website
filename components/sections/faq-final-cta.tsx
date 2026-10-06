"use client"

import { useState } from "react"
import { ArrowRightIcon, CaretDownIcon, CaretRightIcon } from "@phosphor-icons/react"
import type { SiteContent } from "@/content/schema"
import { ActionButton } from "@/components/ui/action"
import { Reveal } from "@/components/util/reveal"
import { SectionHeading } from "@/components/sections/section-parts"
import { useInteraction } from "@/components/providers/interaction-context"

type Faq = SiteContent["faqFinalCta"]["faqs"][number]

export function FaqFinalCta({ content }: { content: SiteContent }) {
  const { openAppointment } = useInteraction()
  const section = content.faqFinalCta

  return (
    <section id="faq" className="scroll-mt-20 bg-surface-alt">
      <div className="container-editorial py-20 md:py-24">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} description={section.description} />

        <FaqExplorer faqs={section.faqs} />

        <Reveal className="mt-14 rounded-2xl bg-card p-7 text-center sm:p-10">
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
                <ArrowRightIcon weight="bold" className="size-4" aria-hidden="true" />
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

function FaqExplorer({ faqs }: { faqs: Faq[] }) {
  const [active, setActive] = useState(0)
  const current = faqs[active]

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-10">
      <ul className="flex flex-col gap-2.5">
        {faqs.map((item, index) => {
          const selected = index === active
          const mobilePanelId = `faq-answer-${index}`
          return (
            <li key={item.q}>
              <button
                type="button"
                aria-expanded={selected}
                aria-controls={`${mobilePanelId} faq-answer-panel`}
                onClick={() => setActive(index)}
                className={
                  "group flex w-full items-center justify-between gap-4 rounded-full border px-5 py-3.5 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-alt sm:text-base " +
                  (selected
                    ? "border-foreground bg-foreground text-background"
                    : "border-transparent bg-card text-foreground hover:border-foreground/30")
                }
              >
                <span className="text-pretty">{item.q}</span>
                <CaretDownIcon
                  weight="bold"
                  className={
                    "size-4 shrink-0 transition-transform duration-300 motion-reduce:transition-none lg:hidden " +
                    (selected ? "rotate-180" : "text-muted-foreground")
                  }
                  aria-hidden="true"
                />
                <CaretRightIcon
                  weight="bold"
                  className={
                    "hidden size-4 shrink-0 transition-transform duration-300 motion-reduce:transition-none lg:block " +
                    (selected ? "translate-x-0.5" : "text-muted-foreground group-hover:translate-x-0.5")
                  }
                  aria-hidden="true"
                />
              </button>

              <div
                id={mobilePanelId}
                role="region"
                inert={!selected}
                className={
                  "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none lg:hidden " +
                  (selected ? "grid-rows-[1fr]" : "grid-rows-[0fr]")
                }
              >
                <div className="overflow-hidden">
                  <p className="mx-2 mt-2.5 rounded-2xl bg-card px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      <div
        id="faq-answer-panel"
        aria-live="polite"
        className="sticky top-24 hidden min-h-80 flex-col rounded-2xl bg-card p-10 lg:flex"
      >
        <div key={active} className="animate-in fade-in slide-in-from-bottom-2 duration-300 motion-reduce:animate-none">
          <span className="block h-1 w-10 rounded-full bg-brand" aria-hidden="true" />
          <h3 className="mt-6 text-balance text-2xl font-semibold leading-tight tracking-tight text-foreground">
            {current.q}
          </h3>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">{current.a}</p>
        </div>
      </div>
    </div>
  )
}
