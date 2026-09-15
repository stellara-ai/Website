"use client"

import { ArrowUpRight, Check } from "lucide-react"
import type { SiteContent } from "@/content/schema"
import { useInteraction } from "@/components/providers/interaction-context"
import { ActionButton } from "@/components/ui/action"
import { Eyebrow } from "./section-parts"

export function Software({ content }: { content: SiteContent }) {
  const { software } = content
  const { openAppointment } = useInteraction()

  return (
    <section id="software" className="scroll-mt-20 bg-ink text-ink-foreground">
      <div className="container-editorial py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <Eyebrow tone="ink">{software.eyebrow}</Eyebrow>
            <h2 className="mt-5 text-balance text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl md:text-[2.75rem]">
              {software.headline}
            </h2>
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-ink-muted sm:text-lg">
              {software.description}
            </p>

            <p className="mt-8 max-w-xl text-balance text-lg font-medium leading-snug text-ink-foreground">
              <span className="text-brand">{software.secondary}</span>
            </p>

            <ActionButton
              variant="primary"
              size="lg"
              className="mt-9"
              onClick={() => openAppointment({ reasonId: "software", recommendationId: "software", source: "software-section" })}
            >
              {software.cta}
              <ArrowUpRight className="size-4" />
            </ActionButton>
          </div>

          <ul className="grid content-start gap-px self-start overflow-hidden rounded-2xl border border-ink-border bg-ink-border sm:grid-cols-2">
            {software.capabilities.map((capability, index) => {
              const isOrphanLast = index === software.capabilities.length - 1 && software.capabilities.length % 2 === 1
              return (
                <li
                  key={capability}
                  className={`flex items-start gap-3 bg-ink p-5 ${isOrphanLast ? "sm:col-span-2" : ""}`}
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-brand-strong" />
                  <span className="text-sm leading-relaxed text-ink-foreground">{capability}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
