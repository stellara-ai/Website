import type { SiteContent } from "@/content/schema"

/**
 * Deterministic local conversation state machine for the assistant.
 * Organized so a real AI endpoint can replace `advance` later through a
 * single adapter, without changing the UI.
 */
export type AssistantPhase = "intro" | "outcome" | "recommendation"

export interface AssistantMessage {
  id: string
  role: "assistant" | "user"
  text: string
}

export interface AssistantState {
  phase: AssistantPhase
  messages: AssistantMessage[]
  frictionId?: string
  outcomeId?: string
  recommendationId?: string
}

let counter = 0
function nextId(): string {
  counter += 1
  return `m${counter}`
}

export function createInitialState(content: SiteContent): AssistantState {
  return {
    phase: "intro",
    messages: [{ id: nextId(), role: "assistant", text: content.assistant.intro }],
  }
}

export interface AssistantAdapter {
  advance(state: AssistantState, choiceId: string, label: string, content: SiteContent): AssistantState
}

export const localAssistantAdapter: AssistantAdapter = {
  advance(state, choiceId, label, content) {
    const messages = [...state.messages, { id: nextId(), role: "user" as const, text: label }]

    if (state.phase === "intro") {
      return {
        ...state,
        phase: "outcome",
        frictionId: choiceId,
        messages: [...messages, { id: nextId(), role: "assistant", text: content.assistant.followUp }],
      }
    }

    if (state.phase === "outcome") {
      const recId = content.explorer.routing[state.frictionId ?? "unsure"] ?? "software"
      const rec = content.explorer.recommendations.find((r) => r.id === recId)
      const recommendationText = rec
        ? `${content.assistant.recommendPrefix} ${rec.title}. ${content.assistant.whyPrefix} ${rec.why}`
        : content.assistant.disclaimer
      return {
        ...state,
        phase: "recommendation",
        outcomeId: choiceId,
        recommendationId: recId,
        messages: [...messages, { id: nextId(), role: "assistant", text: recommendationText }],
      }
    }

    return { ...state, messages }
  },
}
