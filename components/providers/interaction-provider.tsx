"use client"

import { useCallback, useMemo, useState } from "react"
import type { SiteContent } from "@/content/schema"
import { track } from "@/lib/analytics"
import {
  InteractionContext,
  type AppointmentContext,
  type InteractionContextValue,
} from "./interaction-context"
import { AppointmentFlow } from "@/components/interactive/appointment-flow"
import { Assistant } from "@/components/interactive/assistant"
import { WhatsappLauncher } from "@/components/interactive/whatsapp-launcher"

/**
 * Owns the open/closed state for the appointment flow and the assistant, and
 * renders the floating layer (assistant launcher, WhatsApp, and the modal).
 * Sections open these surfaces through the lightweight `useInteraction` hook.
 */
export function InteractionProvider({
  content,
  children,
}: {
  content: SiteContent
  children: React.ReactNode
}) {
  const [appointmentOpen, setAppointmentOpen] = useState(false)
  const [appointmentContext, setAppointmentContext] = useState<AppointmentContext | undefined>()
  const [assistantOpen, setAssistantOpen] = useState(false)

  const openAppointment = useCallback((ctx?: AppointmentContext) => {
    setAppointmentContext(ctx)
    setAppointmentOpen(true)
    track("appointment_opened", { source: ctx?.source ?? "unknown" })
  }, [])

  const closeAppointment = useCallback(() => setAppointmentOpen(false), [])

  const openAssistant = useCallback((source?: string) => {
    setAssistantOpen(true)
    track("assistant_opened", { source: source ?? "launcher" })
  }, [])

  const value = useMemo<InteractionContextValue>(
    () => ({ openAppointment, openAssistant }),
    [openAppointment, openAssistant],
  )

  return (
    <InteractionContext.Provider value={value}>
      {children}
      <WhatsappLauncher content={content} />
      <Assistant
        content={content}
        open={assistantOpen}
        onOpen={() => openAssistant("launcher")}
        onClose={() => setAssistantOpen(false)}
        onBook={(recommendationId) => {
          setAssistantOpen(false)
          openAppointment({ recommendationId, source: "assistant" })
        }}
      />
      {appointmentOpen && (
        <AppointmentFlow content={content} context={appointmentContext} onClose={closeAppointment} />
      )}
    </InteractionContext.Provider>
  )
}
