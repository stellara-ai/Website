"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from "lucide-react"
import type { ExplorerOption, ExplorerRecommendation, SiteContent } from "@/content/schema"
import { useInteraction } from "@/components/providers/interaction-context"
import { ActionButton } from "@/components/ui/action"
import { SectionHeading } from "./section-parts"
import { track } from "@/lib/analytics"
import { cn } from "@/lib/utils"

/** Maps a recommendation to the closest appointment reason. */
const RECOMMENDATION_TO_REASON: Record<string, string> = {
  reception: "agents",
  speed: "agents",
  appointment: "agents",
  support: "agents",
  workflow: "workflow",
  integration: "integration",
  software: "software",
}

const TOTAL_STEPS = 4
type Stage = "intro" | 1 | 2 | 3 | 4 | "result"

export function Explorer({ content }: { content: SiteContent }) {
  const { explorer } = content
  const { openAppointment } = useInteraction()
  const [stage, setStage] = useState<Stage>("intro")
  const [answers, setAnswers] = useState<Record<number, string>>({})

  const recommendationId = explorer.routing[answers[1] ?? "unsure"] ?? "software"
  const recommendation = explorer.recommendations.find((r) => r.id === recommendationId)

  function begin() {
    track("explorer_started", {})
    setStage(1)
  }

  function pick(step: 1 | 2 | 3 | 4, option: ExplorerOption) {
    setAnswers((prev) => ({ ...prev, [step]: option.id }))
    track("explorer_answer_selected", { step, answer: option.id })
    if (step === TOTAL_STEPS) {
      const rec = explorer.routing[answers[1] ?? "unsure"] ?? "software"
      track("explorer_completed", { recommendation: rec })
      track("recommendation_viewed", { recommendation: rec })
      setStage("result")
    } else {
      setStage((step + 1) as Stage)
    }
  }

  function reset() {
    setAnswers({})
    setStage("intro")
  }

  const questions = { 1: explorer.q1, 2: explorer.q2, 3: explorer.q3, 4: explorer.q4 } as const
  const isQuestion = stage === 1 || stage === 2 || stage === 3 || stage === 4

  return (
    <section id="explorer" className="scroll-mt-20 border-t border-border bg-ink text-ink-foreground">
      <div className="container-editorial py-20 md:py-28">
        <SectionHeading eyebrow={explorer.eyebrow} title={explorer.title} description={explorer.intro} tone="ink" />

        <div className="mt-12">
          <div className="mx-auto max-w-2xl rounded-2xl border border-ink-border bg-white/[0.02] p-6 sm:p-8">
            {stage === "intro" && (
              <div className="flex flex-col items-start gap-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-ink-border px-3 py-1.5 text-xs text-ink-muted">
                  <Sparkles className="size-3.5 text-brand" />
                  {explorer.eyebrow}
                </span>
                <p className="text-pretty text-lg leading-relaxed text-ink-foreground">{explorer.intro}</p>
                <ActionButton variant="primary" size="lg" onClick={begin}>
                  {explorer.start}
                  <ArrowRight className="size-4" />
                </ActionButton>
              </div>
            )}

            {isQuestion && (
              <div>
                <div className="flex items-center justify-between">
                  <span className="label-mono text-ink-muted">
                    {explorer.progressLabel} {stage} / {TOTAL_STEPS}
                  </span>
                  <div className="flex gap-1.5" aria-hidden="true">
                    {[1, 2, 3, 4].map((n) => (
                      <span
                        key={n}
                        className={cn(
                          "h-1 w-7 rounded-full transition-colors",
                          n <= (stage as number) ? "bg-brand" : "bg-white/15",
                        )}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="mt-6 text-balance text-xl font-semibold text-ink-foreground sm:text-2xl">
                  {questions[stage].prompt}
                </h3>

                <div className="mt-6 grid gap-2.5">
                  {questions[stage].options.map((option) => {
                    const selected = answers[stage] === option.id
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => pick(stage, option)}
                        className={cn(
                          "group flex items-center justify-between gap-3 rounded-lg border px-4 py-3.5 text-left text-sm transition-all",
                          selected
                            ? "border-brand bg-white/[0.04]"
                            : "border-ink-border hover:border-white/30 hover:bg-white/[0.03]",
                        )}
                      >
                        <span className="text-ink-foreground">{option.label}</span>
                        <ArrowRight className="size-4 text-ink-muted transition-transform group-hover:translate-x-0.5" />
                      </button>
                    )
                  })}
                </div>

                {(stage as number) > 1 && (
                  <button
                    type="button"
                    onClick={() => setStage(((stage as number) - 1) as Stage)}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink-foreground"
                  >
                    <ArrowLeft className="size-4" />
                    {explorer.back}
                  </button>
                )}
              </div>
            )}

            {stage === "result" && recommendation && (
              <div className="reveal is-visible">
                <span className="label-mono text-brand">{explorer.resultEyebrow}</span>
                <h3 className="mt-4 text-balance text-2xl font-semibold text-ink-foreground sm:text-3xl">
                  {recommendation.title}
                </h3>

                <WorkflowOutput
                  key={recommendation.id}
                  steps={recommendation.workflow}
                  label={explorer.workflowLabel}
                />

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <DiagnosticCard label={explorer.frictionLabel} body={recommendation.friction} tone="friction" />
                  <DiagnosticCard label={explorer.systemLabel} body={recommendation.system} tone="system" />
                  <DiagnosticCard label={explorer.outcomeLabel} body={recommendation.outcome} tone="outcome" />
                </div>

                <div className="mt-7">
                  <p className="label-mono text-ink-muted">{explorer.componentsLabel}</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {recommendation.components.map((component) => (
                      <li
                        key={component}
                        className="rounded-full border border-ink-border bg-white/[0.03] px-3.5 py-1.5 text-sm text-ink-foreground"
                      >
                        {component}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="mt-6 rounded-lg border border-ink-border bg-white/[0.02] p-4 text-sm leading-relaxed text-ink-muted">
                  {explorer.disclaimer}
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <ActionButton
                    variant="primary"
                    size="lg"
                    onClick={() =>
                      openAppointment({
                        reasonId: RECOMMENDATION_TO_REASON[recommendation.id] ?? "unsure",
                        recommendationId: recommendation.id,
                        source: "explorer",
                      })
                    }
                  >
                    {explorer.resultCta}
                    <ArrowRight className="size-4" />
                  </ActionButton>
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center justify-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink-foreground"
                  >
                    <RotateCcw className="size-4" />
                    {explorer.reset}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

const DIAGNOSTIC_ACCENT = {
  friction: "text-ink-muted",
  system: "text-brand",
  outcome: "text-status-done",
} as const

function DiagnosticCard({
  label,
  body,
  tone,
}: {
  label: string
  body: string
  tone: keyof typeof DIAGNOSTIC_ACCENT
}) {
  return (
    <div className="rounded-xl border border-ink-border bg-white/[0.02] p-4">
      <p className={cn("label-mono", DIAGNOSTIC_ACCENT[tone])}>{label}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-foreground">{body}</p>
    </div>
  )
}

/**
 * Signature "work moving" output: the recommended system rendered as a sequence of
 * nodes that light up in order, connected by gold links a dot travels along.
 */
function WorkflowOutput({ steps, label }: { steps: string[]; label: string }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(steps.length)
      return
    }
    setActive(0)
    const timer = window.setInterval(() => {
      setActive((prev) => (prev > steps.length ? 0 : prev + 1))
    }, 900)
    return () => window.clearInterval(timer)
  }, [steps])

  return (
    <div className="mt-6 rounded-xl border border-ink-border bg-white/[0.02] p-5">
      <p className="label-mono text-ink-muted">{label}</p>
      <ol className="mt-4 flex flex-wrap items-center gap-y-3">
        {steps.map((step, i) => {
          const on = i < active
          const isActive = i === active - 1
          return (
            <li key={step} className="flex items-center">
              {i > 0 && (
                <span className="relative mx-1.5 h-px w-6 overflow-hidden bg-white/15 sm:w-9" aria-hidden="true">
                  <span
                    className={cn(
                      "absolute inset-y-0 left-0 bg-brand transition-all duration-500",
                      on ? "w-full" : "w-0",
                    )}
                  />
                </span>
              )}
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-500",
                  on
                    ? "border-brand/50 bg-brand-tint text-brand"
                    : "border-ink-border bg-white/[0.02] text-ink-muted",
                  isActive && "scale-[1.04]",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full transition-colors duration-500",
                    on ? "bg-brand" : "bg-white/25",
                  )}
                  aria-hidden="true"
                />
                {step}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
