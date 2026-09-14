// Centralized, vendor-agnostic analytics abstraction. No PII is ever sent.
// If a provider is configured later, wire it in a single place: track().

export type AnalyticsEvent =
  | "hero_cta_selected"
  | "hero_industry_selected"
  | "explorer_started"
  | "explorer_answer_selected"
  | "explorer_completed"
  | "recommendation_viewed"
  | "appointment_opened"
  | "appointment_submitted"
  | "assistant_opened"
  | "assistant_recommendation_reached"
  | "whatsapp_selected"
  | "language_changed"
  | "theme_changed"

type AnalyticsPayload = Record<string, string | number | boolean>

/** Fields that must never be forwarded to analytics. */
const PII_KEYS = new Set(["name", "email", "phone", "company", "website", "description", "message"])

function sanitize(payload: AnalyticsPayload = {}): AnalyticsPayload {
  const safe: AnalyticsPayload = {}
  for (const [key, value] of Object.entries(payload)) {
    if (PII_KEYS.has(key.toLowerCase())) continue
    safe[key] = value
  }
  return safe
}

export function track(event: AnalyticsEvent, payload: AnalyticsPayload = {}): void {
  const safe = sanitize(payload)
  // Forward to Vercel Analytics custom events when available; otherwise no-op.
  if (typeof window !== "undefined") {
    const va = (window as unknown as { va?: (op: string, name: string, data?: unknown) => void }).va
    if (typeof va === "function") {
      va("event", event, safe)
      return
    }
    if (process.env.NODE_ENV !== "production") {
      // Development visibility only.
      console.log("[v0] analytics:", event, safe)
    }
  }
}
