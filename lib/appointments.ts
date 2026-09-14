import type { Locale } from "@/content/schema"

/** Shape submitted by the appointment flow. Kept transport-agnostic on purpose. */
export interface AppointmentRequest {
  reason: string
  name: string
  email: string
  company: string
  phone?: string
  website?: string
  language: Locale
  description?: string
  day: string
  time: string
  /** Optional recommendation carried in from the explorer or assistant. */
  recommendationId?: string
}

export interface AppointmentResult {
  ok: boolean
  reference?: string
  message?: string
}

/**
 * Typed adapter interface for the eventual CRM / scheduling endpoint.
 * Swap the implementation without touching the UI.
 */
export interface SchedulingAdapter {
  submit(request: AppointmentRequest): Promise<AppointmentResult>
}

/**
 * Development adapter: simulates a successful submission and stores nothing
 * sensitive. Replace with a real provider (Calendly, Cal.com, HubSpot Meetings,
 * GoHighLevel, or a lead webhook) behind the same interface.
 */
export const devSchedulingAdapter: SchedulingAdapter = {
  async submit(request) {
    // TODO(integration): POST to LEAD_WEBHOOK_URL / scheduling provider here.
    // Do not log or persist PII in development.
    await new Promise((resolve) => setTimeout(resolve, 900))
    const reference = `STL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    return { ok: true, reference, message: `Scheduled reason: ${request.reason}` }
  },
}

export const schedulingAdapter: SchedulingAdapter = devSchedulingAdapter

/** Deterministic illustrative day/time options so the flow needs no backend. */
export function generateDayOptions(locale: Locale, count = 5): { value: string; label: string }[] {
  const days: { value: string; label: string }[] = []
  const formatter = new Intl.DateTimeFormat(locale === "es" ? "es-US" : "en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
  const now = new Date()
  let added = 0
  let offset = 1
  while (added < count) {
    const date = new Date(now)
    date.setDate(now.getDate() + offset)
    const weekday = date.getDay()
    if (weekday !== 0 && weekday !== 6) {
      days.push({ value: date.toISOString().slice(0, 10), label: formatter.format(date) })
      added++
    }
    offset++
  }
  return days
}

export const TIME_OPTIONS = ["9:00", "10:30", "13:00", "14:30", "16:00"]
