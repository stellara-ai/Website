"use client"

import { ArrowRightIcon, CheckIcon, PlusIcon } from "@phosphor-icons/react"
import type { PlanCoverage, SiteContent } from "@/content/schema"
import { ActionButton } from "@/components/ui/action"
import { Reveal } from "@/components/util/reveal"
import { SectionHeading } from "@/components/sections/section-parts"
import { useInteraction } from "@/components/providers/interaction-context"
import { cn } from "@/lib/utils"

type PlansSection = SiteContent["plans"]

export function Plans({ content }: { content: SiteContent }) {
  const { openAppointment } = useInteraction()
  const section = content.plans

  return (
    <section id="plans" className="scroll-mt-20 bg-surface-alt">
      <div className="container-editorial py-20 md:py-24">
        <SectionHeading title={section.title} description={section.description} />

        <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand-tint px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-brand">
          <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
          {section.badge}
        </p>

        <Reveal className="mt-10 grid overflow-hidden rounded-2xl bg-card lg:grid-cols-2">
          <PlanColumn plan={section.essentials} section={section} />
          <PlanColumn plan={section.pro} section={section} upgrade />
        </Reveal>

        <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 md:flex-row md:items-baseline md:gap-8">
          <div className="shrink-0">
            <h3 className="text-sm font-semibold text-foreground">{section.addOnsLabel}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">{section.addOnsNote}</p>
          </div>
          <ul className="flex flex-wrap gap-2">
            {section.addOns.map((addon) => (
              <li key={addon} className="rounded-full bg-card px-3.5 py-1.5 text-sm text-foreground">
                {addon}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a href="#personalized-demo" className="inline-flex">
            <ActionButton variant="primary" size="lg" tabIndex={-1}>
              {section.primaryCta}
              <ArrowRightIcon weight="bold" className="size-4" aria-hidden="true" />
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

function PlanColumn({
  plan,
  section,
  upgrade = false,
}: {
  plan: PlanCoverage
  section: PlansSection
  upgrade?: boolean
}) {
  const headingId = `plan-${plan.name.toLowerCase()}`

  return (
    <article
      aria-labelledby={headingId}
      className={cn(
        "flex flex-col p-6 sm:p-8 lg:p-10",
        upgrade && "border-t-4 border-brand lg:border-l lg:border-t-4 lg:border-l-border",
        !upgrade && "border-t-4 border-transparent",
      )}
    >
      <h3 id={headingId} className="text-2xl font-semibold tracking-tight text-foreground">
        {plan.name}
      </h3>
      <p className="mt-2 max-w-md text-pretty text-base leading-relaxed text-muted-foreground lg:min-h-[3.25rem]">
        {plan.focus}
      </p>

      <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <p className="flex items-baseline gap-1">
          <span className="text-5xl font-semibold tracking-tight text-foreground">{plan.monthly}</span>
          <span className="text-base font-medium text-muted-foreground">{section.perMonthLabel}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">+ {plan.implementation}</span> {section.implementationLabel}
        </p>
      </div>

      <div className="mt-8 border-t border-border pt-6">
        {upgrade && (
          <p className="mb-4 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <CheckIcon weight="bold" className="size-3" aria-hidden="true" />
            </span>
            {section.includesEssentials}
          </p>
        )}
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.1em]",
            upgrade ? "text-brand" : "text-muted-foreground",
          )}
        >
          {plan.pointsLabel}
        </p>
        <ul className="mt-3 flex flex-col gap-3 text-sm text-foreground">
          {plan.points.map((point) => (
            <li key={point} className="flex items-start gap-3">
              <span
                className={cn(
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                  upgrade ? "bg-brand text-brand-foreground" : "bg-brand-tint text-brand",
                )}
              >
                {upgrade ? (
                  <PlusIcon weight="bold" className="size-3" aria-hidden="true" />
                ) : (
                  <CheckIcon weight="bold" className="size-3" aria-hidden="true" />
                )}
              </span>
              <span className={cn("leading-relaxed", upgrade && "font-medium")}>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
