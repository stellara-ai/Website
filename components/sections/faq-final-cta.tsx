"use client"

import { useState } from "react"
import { ArrowRightIcon, MinusIcon, PlusIcon } from "@phosphor-icons/react"
import type { SiteContent } from "@/content/schema"
import { ActionButton } from "@/components/ui/action"
import { Reveal } from "@/components/util/reveal"
import { SectionHeading } from "@/components/sections/section-parts"
import { useInteraction } from "@/components/providers/interaction-context"

type FaqGroup = SiteContent["faqFinalCta"]["groups"][number]

export function FaqFinalCta({ content }: { content: SiteContent }) {
  const { openAppointment } = useInteraction()
  const section = content.faqFinalCta

  return (
    <section id="faq" className="scroll-mt-20 bg-surface-alt">
      <div className="container-editorial border-t border-border py-20 md:py-24">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} description={section.description} />

        <FaqExplorer groups={section.groups} />

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

function FaqExplorer({ groups }: { groups: FaqGroup[] }) {
  const [active, setActive] = useState(0)
  let offset = 0

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-10">
      <div className="flex flex-col gap-7">
        {groups.map((group) => {
          const start = offset
          offset += group.items.length
          return (
            <div key={group.label}>
              <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                {group.label}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {group.items.map((item, itemIndex) => {
          const index = start + itemIndex
          const selected = index === active
          const answerId = `faq-answer-${index}`
          return (
            <li
              key={item.q}
              className={
                "border transition-[background-color,border-color,border-radius] duration-300 motion-reduce:transition-none " +
                (selected
                  ? "rounded-2xl border-transparent bg-card"
                  : "rounded-[1.75rem] border-foreground hover:bg-card/60")
              }
            >
              <button
                type="button"
                aria-expanded={selected}
                aria-controls={answerId}
                onClick={() => setActive(index)}
                className={
                  "flex w-full items-center gap-3 rounded-[inherit] px-3.5 text-left text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-alt " +
                  (selected ? "py-4 font-medium" : "py-2")
                }
              >
                <span
                  className="flex size-5 shrink-0 items-center justify-center rounded-full border border-foreground/60"
                  aria-hidden="true"
                >
                  {selected ? <MinusIcon weight="bold" className="size-2.5" /> : <PlusIcon weight="bold" className="size-2.5" />}
                </span>
                <span className="text-pretty">{item.q}</span>
              </button>

              <div
                id={answerId}
                role="region"
                inert={!selected}
                className={
                  "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none " +
                  (selected ? "grid-rows-[1fr]" : "grid-rows-[0fr]")
                }
              >
                <div className="overflow-hidden">
                  <p className="px-4 pb-5 pl-11.5 text-sm leading-relaxed text-muted-foreground lg:text-base">{item.a}</p>
                </div>
              </div>
            </li>
          )
                })}
              </ul>
            </div>
          )
        })}
      </div>

    </div>
  )
}
