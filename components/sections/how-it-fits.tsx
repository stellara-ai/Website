"use client"

import { useState } from "react"
import { ArrowRightIcon, ArrowCounterClockwiseIcon } from "@phosphor-icons/react"
import type { SiteContent, WorkflowOwner, WorkflowStep } from "@/content/schema"
import { SectionHeading } from "@/components/sections/section-parts"
import { Reveal } from "@/components/util/reveal"
import { delay } from "@/components/sections/stories/story-ui"
import { cn } from "@/lib/utils"

const OWNER_STYLE: Record<WorkflowOwner, { chip: string; dot: string; card: string }> = {
  auto: {
    chip: "border-approve/30 bg-approve-tint text-approve",
    dot: "bg-approve",
    card: "border-border",
  },
  handoff: {
    chip: "border-status-work/40 bg-status-work-tint text-foreground",
    dot: "bg-status-work",
    card: "border-status-work/40",
  },
  staff: {
    chip: "border-brand/35 bg-brand-tint text-brand",
    dot: "bg-brand",
    card: "border-brand/35",
  },
}

const STEP_INTERVAL_MS = 650

export function HowItFits({ content }: { content: SiteContent }) {
  const section = content.howItFits
  const [scenarioId, setScenarioId] = useState(section.scenarios[0]?.id)
  const [runKey, setRunKey] = useState(0)

  const scenario = section.scenarios.find((s) => s.id === scenarioId) ?? section.scenarios[0]

  return (
    <section id="fit" className="scroll-mt-20 border-t border-border">
      <div className="container-editorial py-20 md:py-24">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} description={section.description} />

        <Reveal className="mt-12 flex flex-col gap-6 rounded-3xl border border-border bg-card/40 p-4 shadow-soft sm:p-6 lg:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div
              role="radiogroup"
              aria-label={section.scenarioLabel}
              className="flex w-full gap-1 overflow-x-auto rounded-full border border-border bg-background/70 p-1 sm:w-auto"
            >
              {section.scenarios.map((s) => {
                const selected = s.id === scenario.id
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => {
                      setScenarioId(s.id)
                      setRunKey((k) => k + 1)
                    }}
                    className={cn(
                      "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      selected
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {s.label}
                  </button>
                )
              })}
            </div>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <span className="text-xs text-muted-foreground">{section.illustrative}</span>
              <button
                type="button"
                onClick={() => setRunKey((k) => k + 1)}
                aria-label={section.replayLabel}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ArrowCounterClockwiseIcon weight="bold" className="size-3.5" aria-hidden="true" />
                {section.replay}
              </button>
            </div>
          </div>

          <ol
            key={`${scenario.id}-${runKey}`}
            className="grid gap-3 md:grid-cols-2 lg:grid-cols-4"
            aria-live="polite"
          >
            {scenario.steps.map((step, i) => (
              <StepCard
                key={step.stage}
                step={step}
                index={i}
                ownerLabel={section.ownerLabels[step.owner]}
                nextLabel={section.nextLabel}
              />
            ))}
          </ol>

          <p className="text-pretty text-base font-medium text-foreground">{section.takeaway}</p>
        </Reveal>

        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">{section.footnote}</p>
      </div>
    </section>
  )
}

function StepCard({
  step,
  index,
  ownerLabel,
  nextLabel,
}: {
  step: WorkflowStep
  index: number
  ownerLabel: string
  nextLabel: string
}) {
  const style = OWNER_STYLE[step.owner]

  return (
    <li className="group ah-reveal flex min-w-0 flex-col gap-3" style={delay(index * STEP_INTERVAL_MS)}>
      <div className="flex items-center gap-2">
        <span
          className="wf-pulse flex size-6 shrink-0 items-center justify-center rounded-full border border-brand/40 bg-background text-xs font-semibold tabular-nums text-brand"
          style={delay(index * STEP_INTERVAL_MS + 200)}
        >
          {index + 1}
        </span>
        <span className="min-w-0 flex-1 text-sm font-semibold leading-snug text-foreground">{step.stage}</span>
        <span
          className="wf-line hidden h-px w-6 shrink-0 bg-border lg:block lg:group-last:hidden"
          style={delay(index * STEP_INTERVAL_MS + 400)}
          aria-hidden="true"
        />
      </div>

      <div className={cn("flex flex-1 flex-col gap-3 rounded-2xl border bg-background/80 p-4", style.card)}>
        <span
          className={cn(
            "inline-flex max-w-full items-center gap-1.5 self-start rounded-full border px-2 py-0.5 text-xs font-medium",
            style.chip,
          )}
        >
          <span className={cn("size-1.5 shrink-0 rounded-full", style.dot)} aria-hidden="true" />
          <span className="truncate">{ownerLabel}</span>
        </span>

        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-foreground">{step.title}</span>
          <span className="text-xs text-muted-foreground">{step.meta}</span>
        </div>

        <ul className="flex flex-col gap-1.5">
          {step.lines.map((line) => (
            <li key={line} className="text-sm leading-relaxed text-muted-foreground">
              {line}
            </li>
          ))}
        </ul>

        {step.next && (
          <div className="mt-auto flex items-center gap-2 rounded-lg bg-brand-tint px-3 py-2 text-xs font-medium text-foreground">
            <ArrowRightIcon weight="bold" className="size-3.5 shrink-0 text-brand" aria-hidden="true" />
            <span>
              <span className="sr-only">{nextLabel}: </span>
              {step.next}
            </span>
          </div>
        )}
      </div>
    </li>
  )
}
