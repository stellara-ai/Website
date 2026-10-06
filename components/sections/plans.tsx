"use client"

import { ArrowRight, Check, Minus } from "lucide-react"
import type { SiteContent } from "@/content/schema"
import { ActionButton } from "@/components/ui/action"
import { Reveal } from "@/components/util/reveal"
import { SectionHeading } from "@/components/sections/section-parts"
import { useInteraction } from "@/components/providers/interaction-context"

export function Plans({ content }: { content: SiteContent }) {
  const { openAppointment } = useInteraction()
  const section = content.plans

  return (
    <section id="plans" className="scroll-mt-20 border-t border-border">
      <div className="container-editorial py-20 md:py-24">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
        />

        <div className="mt-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand-tint px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-brand">
            {section.badge}
          </span>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {section.plans.map((plan, index) => (
            <Reveal
              key={plan.name}
              delay={index * 100}
              className={
                "rounded-2xl border p-6 shadow-soft transition-colors " +
                (plan.highlighted
                  ? "border-brand/50 bg-card ring-1 ring-brand/20"
                  : "border-border bg-card/65 hover:border-brand/30")
              }
            >
              <h3 className="text-xl font-semibold tracking-tight text-foreground">{plan.name}</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-background/85 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">{section.monthlyPriceLabel}</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{plan.monthly}</p>
                </div>
                <div className="rounded-xl border border-border bg-background/85 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">{section.implementationLabel}</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{plan.implementation}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{plan.summary}</p>
              <ul className="mt-5 flex flex-col gap-2.5 text-sm text-foreground">
                {plan.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-5 overflow-hidden rounded-2xl border border-border bg-card/45 shadow-soft">
          <div className="grid grid-cols-[minmax(0,1fr)_5rem_5rem] gap-x-2 border-b border-border bg-background/80 px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground sm:grid-cols-[minmax(18rem,1fr)_8rem_8rem] sm:px-5">
            <span>{section.featureHeader}</span>
            <span className="text-center">{section.essentialsLabel}</span>
            <span className="text-center">{section.proLabel}</span>
          </div>
          <div className="divide-y divide-border">
            {section.features.map((feature) => (
              <div
                key={feature.label}
                className="grid grid-cols-[minmax(0,1fr)_5rem_5rem] items-center gap-x-2 px-4 py-3 text-sm transition-colors hover:bg-background/60 sm:grid-cols-[minmax(18rem,1fr)_8rem_8rem] sm:px-5"
              >
                <span className="text-pretty pr-1 text-foreground">{feature.label}</span>
                <span className="flex justify-center">
                  {feature.essentials ? (
                    <Check className="size-4 text-brand" aria-label={section.includedEssentialsAria} />
                  ) : (
                    <Minus className="size-4 text-muted-foreground" aria-label={section.notIncludedEssentialsAria} />
                  )}
                </span>
                <span className="flex justify-center">
                  {feature.pro ? (
                    <Check className="size-4 text-brand" aria-label={section.includedProAria} />
                  ) : (
                    <Minus className="size-4 text-muted-foreground" aria-label={section.notIncludedProAria} />
                  )}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        <p className="mt-5 max-w-4xl text-sm leading-relaxed text-muted-foreground">{section.distinction}</p>

        <div className="mt-5 rounded-2xl border border-border bg-card/35 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            {section.addOnsLabel}
          </p>
          <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
            {section.addOns.map((addon) => (
              <li key={addon} className="rounded-xl border border-border bg-background/70 px-3 py-2.5">
                {addon}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a href="#personalized-demo" className="inline-flex">
            <ActionButton variant="primary" size="lg">
              {section.primaryCta}
              <ArrowRight className="size-4" aria-hidden="true" />
            </ActionButton>
          </a>
          <ActionButton variant="outline" size="lg" onClick={() => openAppointment({ source: "plans" })}>
            {section.secondaryCta}
          </ActionButton>
        </div>
      </div>
    </section>
  )
}
