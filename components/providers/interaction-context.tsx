"use client"

import { createContext, useContext } from "react"

/** Context carried into the appointment flow from wherever it was opened. */
export interface AppointmentContext {
  reasonId?: string
  recommendationId?: string
  source?: string
}

export interface InteractionContextValue {
  openAppointment: (ctx?: AppointmentContext) => void
  openAssistant: (source?: string) => void
}

export const InteractionContext = createContext<InteractionContextValue | null>(null)

export function useInteraction(): InteractionContextValue {
  const ctx = useContext(InteractionContext)
  if (!ctx) throw new Error("useInteraction must be used within InteractionProvider")
  return ctx
}
