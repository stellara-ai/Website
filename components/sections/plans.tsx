"use client"

import { ArrowRightIcon, CheckIcon, MinusIcon, PlugIcon, ArrowCounterClockwiseIcon, SparkleIcon, type Icon as PhosphorIcon } from "@phosphor-icons/react"
import type { PlanCard as PlanCardData, PlanFeatureRow, SiteContent } from "@/content/schema"
import { ActionButton } from "@/components/ui/action"
import { Reveal } from "@/components/util/reveal"
import { SectionHeading } from "@/components/sections/section-parts"
import { useInteraction } from "@/components/providers/interaction-context"

type PlansSection = SiteContent["plans"]

const ADD_ON_ICONS: PhosphorIcon[] = [SparkleIcon, ArrowCounterClockwiseIcon, PlugIcon]

export function Plans({ content }: { content: SiteContent }) {
  const { openAppointment } = useInteraction()
  const section = content.plans

  return (
    <section id="plans" className="scroll-mt-20 border-t border-border">
      <div className="container-editorial py-20 md:py-24">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} description={section.description} />

        <div className="mt-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand-tint px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-brand">
            <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
            {section.badge}
          </span>
        </div>

        <div className="mt-10 grid items-stretch gap-5 lg:grid-cols-2">
          {section.plans.map((plan, index) => (
            <Reveal key={plan.name} delay={index * 120} className="flex">
              {plan.highlighted ? (
                <ProPlanCard plan={plan} section={section} />
              ) : (
                <StandardPlanCard plan={plan} section={section} />
              )}
            </Reveal>
          ))}
        </div>

        <ComparisonTable section={section} />

        <p className="mt-5 max-w-4xl text-pretty text-sm leading-relaxed text-muted-foreground">{section.distinction}</p>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">{section.addOnsLabel}</p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-3">
            {section.addOns.map((addon, index) => {
              const Icon = ADD_ON_ICONS[index % ADD_ON_ICONS.length]
              return (
                <li
                  key={addon}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card/60 px-4 py-3 text-sm text-foreground transition-colors hover:border-status-purple/40"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-status-purple-tint text-status-purple">
                    <Icon weight="fill" className="size-4" aria-hidden="true" />
                  </span>
                  {addon}
                </li>
              )
            })}
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a href="#personalized-demo" className="inline-flex">
            <ActionButton variant="primary" size="lg">
              {section.primaryCta}
              <ArrowRightIcon weight="fill" className="size-4" aria-hidden="true" />
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

function PriceBlock({ plan, section, emphasis }: { plan: PlanCardData; section: PlansSection; emphasis: boolean }) {
  return (
    <div className="mt-5 flex flex-col gap-3">
      <p className="sr-only">{section.monthlyPriceLabel}</p>
      <p className="flex items-baseline gap-1">
        <span
          className={
            "font-semibold tracking-tight " +
            (emphasis ? "text-5xl text-foreground md:text-6xl" : "text-4xl text-foreground md:text-5xl")
          }
        >
          {plan.monthly}
        </span>
        <span className="text-base font-medium text-muted-foreground">{section.perMonthLabel}</span>
      </p>
      <p className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs text-muted-foreground">
        <span>{section.implementationLabel}</span>
        <span className="font-semibold text-foreground">{plan.implementation}</span>
      </p>
    </div>
  )
}

function StandardPlanCard({ plan, section }: { plan: PlanCardData; section: PlansSection }) {
  return (
    <article className="flex w-full flex-col rounded-2xl border border-border bg-card/65 p-6 shadow-soft transition-colors hover:border-brand/30 md:p-8">
      <h3 className="text-xl font-semibold tracking-tight text-foreground">{plan.name}</h3>
      <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">{plan.summary}</p>
      <PriceBlock plan={plan} section={section} emphasis={false} />
      <ul className="mt-6 flex flex-col gap-3 border-t border-border pt-6 text-sm text-foreground">
        {plan.points.map((point) => (
          <li key={point} className="flex items-start gap-3">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand">
              <CheckIcon weight="fill" className="size-3" aria-hidden="true" />
            </span>
            <span className="leading-relaxed">{point}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

function ProPlanCard({ plan, section }: { plan: PlanCardData; section: PlansSection }) {
  const [inherited, ...exclusive] = plan.points

  return (
    <div className="plan-pro-frame w-full rounded-2xl p-px shadow-soft">
      <article className="plan-pro-glow relative flex h-full flex-col overflow-hidden rounded-[calc(1rem-1px)] p-6 md:p-8">
        <span className="absolute right-5 top-5 inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-brand px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-brand-foreground">
          <SparkleIcon weight="fill" className="size-3" aria-hidden="true" />
          {section.recommendedLabel}
          <span
            className="plan-sheen pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-brand-foreground/30"
            aria-hidden="true"
          />
        </span>

        <h3 className="pr-32 text-xl font-semibold tracking-tight text-foreground">{plan.name}</h3>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">{plan.summary}</p>
        <PriceBlock plan={plan} section={section} emphasis />

        <div className="mt-6 flex flex-col gap-3 border-t border-brand/25 pt-6 text-sm text-foreground">
          {inherited ? (
            <p className="flex items-center gap-3 font-medium">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand">
                <CheckIcon weight="fill" className="size-3" aria-hidden="true" />
              </span>
              {inherited}
            </p>
          ) : null}
          <ul className="flex flex-col gap-3">
            {exclusive.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-status-teal-tint text-status-teal">
                  <SparkleIcon weight="fill" className="size-3" aria-hidden="true" />
                </span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </div>
  )
}

const TABLE_COLS = "grid-cols-[minmax(0,1fr)_4.5rem_4.5rem] sm:grid-cols-[minmax(18rem,1fr)_8rem_8rem]"

function ComparisonTable({ section }: { section: PlansSection }) {
  const core = section.features.filter((feature) => feature.essentials)
  const proOnly = section.features.filter((feature) => !feature.essentials)

  return (
    <Reveal className="mt-8 overflow-hidden rounded-2xl border border-border bg-card/45 shadow-soft">
      <div
        className={`grid ${TABLE_COLS} gap-x-2 border-b border-border bg-background/80 px-4 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground sm:px-5`}
      >
        <span className="py-3">{section.featureHeader}</span>
        <span className="py-3 text-center">{section.essentialsLabel}</span>
        <span className="plan-pro-col flex items-center justify-center gap-1 rounded-t-lg py-3 text-brand">
          {section.proLabel}
        </span>
      </div>
      <FeatureGroup label={section.coreGroupLabel} rows={core} section={section} accent="brand" />
      <FeatureGroup label={section.proGroupLabel} rows={proOnly} section={section} accent="teal" />
    </Reveal>
  )
}

function FeatureGroup({
  label,
  rows,
  section,
  accent,
}: {
  label: string
  rows: PlanFeatureRow[]
  section: PlansSection
  accent: "brand" | "teal"
}) {
  if (rows.length === 0) return null
  const checkColor = accent === "teal" ? "text-status-teal" : "text-brand"
  const dotColor = accent === "teal" ? "bg-status-teal" : "bg-brand"

  return (
    <div>
      <div className={`grid ${TABLE_COLS} gap-x-2 border-b border-border bg-background/40 px-4 sm:px-5`}>
        <span className="flex items-center gap-2 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-foreground">
          <span className={`size-1.5 rounded-full ${dotColor}`} aria-hidden="true" />
          {label}
        </span>
        <span aria-hidden="true" />
        <span className="plan-pro-col" aria-hidden="true" />
      </div>
      <div className="divide-y divide-border">
        {rows.map((feature) => (
          <div
            key={feature.label}
            className={`grid ${TABLE_COLS} items-stretch gap-x-2 px-4 text-sm transition-colors hover:bg-background/60 sm:px-5`}
          >
            <span className="text-pretty py-3 pr-1 text-foreground">{feature.label}</span>
            <span className="flex items-center justify-center py-3">
              {feature.essentials ? (
                <CheckIcon weight="fill" className="size-4 text-brand" aria-label={section.includedEssentialsAria} />
              ) : (
                <MinusIcon weight="fill" className="size-4 text-muted-foreground/60" aria-label={section.notIncludedEssentialsAria} />
              )}
            </span>
            <span className="plan-pro-col flex items-center justify-center py-3">
              {feature.pro ? (
                <CheckIcon weight="fill" className={`size-4 ${checkColor}`} aria-label={section.includedProAria} />
              ) : (
                <MinusIcon weight="fill" className="size-4 text-muted-foreground/60" aria-label={section.notIncludedProAria} />
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
