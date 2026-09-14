"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import { MessageSquare, X, RotateCcw, ArrowRight } from "lucide-react"
import type { ExplorerOption, SiteContent } from "@/content/schema"
import { ActionButton } from "@/components/ui/action"
import { track } from "@/lib/analytics"
import {
  createInitialState,
  localAssistantAdapter,
  type AssistantMessage,
  type AssistantState,
} from "@/lib/assistant"
import { cn } from "@/lib/utils"

interface AssistantProps {
  content: SiteContent
  open: boolean
  onOpen: () => void
  onClose: () => void
  onBook: (recommendationId?: string) => void
}

export function Assistant({ content, open, onOpen, onClose, onBook }: AssistantProps) {
  const a = content.assistant
  const [state, setState] = useState<AssistantState>(() => createInitialState(content))
  const scrollRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  // Options offered at each phase: friction first, then desired outcome.
  const options: ExplorerOption[] =
    state.phase === "intro"
      ? a.quickReplies
      : state.phase === "outcome"
        ? content.explorer.q3.options
        : []

  const choose = useCallback(
    (option: ExplorerOption) => {
      setState((prev) => localAssistantAdapter.advance(prev, option.id, option.label, content))
    },
    [content],
  )

  function restart() {
    setState(createInitialState(content))
  }

  useEffect(() => {
    if (state.phase === "recommendation" && state.recommendationId) {
      track("assistant_recommendation_reached", { recommendation: state.recommendationId })
    }
  }, [state.phase, state.recommendationId])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [state.messages, open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  const recommendation =
    state.phase === "recommendation"
      ? content.explorer.recommendations.find((r) => r.id === state.recommendationId)
      : undefined

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={onOpen}
          aria-label={a.launcherLabel}
          className="group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-full bg-brand px-4 py-3 text-sm font-medium text-brand-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:bg-brand/90 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <MessageSquare className="size-5" />
          <span className="hidden sm:inline">{a.status}</span>
        </button>
      )}

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          className="fixed bottom-0 right-0 z-50 flex h-[min(37rem,100svh)] w-full flex-col overflow-hidden border border-border bg-card shadow-2xl animate-in sm:bottom-5 sm:right-5 sm:h-[36rem] sm:w-[24rem] sm:rounded-2xl"
        >
          <header className="flex items-center justify-between gap-3 border-b border-border bg-ink px-4 py-3.5 text-ink-foreground">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-full bg-brand">
                <MessageSquare className="size-4 text-white" />
              </span>
              <div>
                <p id={titleId} className="text-sm font-semibold leading-tight">
                  {a.title}
                </p>
                <p className="label-mono text-ink-muted">{a.guideNote}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={restart}
                aria-label={a.restartLabel}
                className="grid size-8 place-items-center rounded-md text-ink-muted transition-colors hover:bg-white/10 hover:text-ink-foreground"
              >
                <RotateCcw className="size-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label={a.closeLabel}
                className="grid size-8 place-items-center rounded-md text-ink-muted transition-colors hover:bg-white/10 hover:text-ink-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {state.messages.map((message) => (
              <Bubble key={message.id} message={message} />
            ))}

            {recommendation && (
              <div className="rounded-xl border border-border bg-background p-3.5">
                <p className="label-mono text-muted-foreground">{content.explorer.componentsLabel}</p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {recommendation.components.map((component) => (
                    <li
                      key={component}
                      className="rounded-full border border-border bg-card px-2.5 py-1 text-xs text-foreground"
                    >
                      {component}
                    </li>
                  ))}
                </ul>
                <ActionButton
                  variant="primary"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => onBook(recommendation.id)}
                >
                  {a.bookCta}
                  <ArrowRight className="size-4" />
                </ActionButton>
              </div>
            )}
          </div>

          <div className="border-t border-border px-4 py-3">
            {options.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => choose(option)}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground transition-colors hover:border-brand hover:text-brand"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : (
              <button
                type="button"
                onClick={restart}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <RotateCcw className="size-3.5" />
                {a.restart}
              </button>
            )}
            <p className="mt-2.5 text-[0.6875rem] leading-snug text-muted-foreground">{a.disclaimer}</p>
          </div>
        </div>
      )}
    </>
  )
}

function Bubble({ message }: { message: AssistantMessage }) {
  const isUser = message.role === "user"
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <p
        className={cn(
          "max-w-[85%] text-pretty rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-br-sm bg-brand text-brand-foreground"
            : "rounded-bl-sm bg-muted text-foreground",
        )}
      >
        {message.text}
      </p>
    </div>
  )
}
