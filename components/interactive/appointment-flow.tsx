"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import { CheckIcon, XIcon, ArrowLeftIcon, ArrowRightIcon, CalendarBlankIcon } from "@phosphor-icons/react"
import type { ExplorerOption, Locale, SiteContent } from "@/content/schema"
import type { AppointmentContext } from "@/components/providers/interaction-context"
import { ActionButton } from "@/components/ui/action"
import { track } from "@/lib/analytics"
import {
  generateDayOptions,
  schedulingAdapter,
  TIME_OPTIONS,
  type AppointmentRequest,
} from "@/lib/appointments"
import { cn } from "@/lib/utils"

type Step = 0 | 1 | 2 | 3

interface AppointmentFlowProps {
  content: SiteContent
  context?: AppointmentContext
  onClose: () => void
}

/** Maps an explorer recommendation to the closest appointment reason id. */
const RECOMMENDATION_TO_REASON: Record<string, string> = {
  reception: "agents",
  speed: "agents",
  appointment: "agents",
  support: "agents",
  workflow: "workflow",
  integration: "integration",
  software: "software",
}

export function AppointmentFlow({ content, context, onClose }: AppointmentFlowProps) {
  const t = content.appointment
  const seededReason =
    context?.reasonId ??
    (context?.recommendationId ? RECOMMENDATION_TO_REASON[context.recommendationId] : undefined)

  const [step, setStep] = useState<Step>(0)
  const [reason, setReason] = useState<string | null>(seededReason ?? null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [phone, setPhone] = useState("")
  const [website, setWebsite] = useState("")
  const [language, setLanguage] = useState<Locale>(content.locale)
  const [description, setDescription] = useState("")
  const [day, setDay] = useState<string | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [consent, setConsent] = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descId = useId()

  const dayOptions = useMemo(() => generateDayOptions(content.locale), [content.locale])
  const stepTitles = [t.steps.reason, t.steps.contact, t.steps.time, t.steps.confirm]

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    const previouslyFocused = document.activeElement as HTMLElement | null
    document.body.style.overflow = "hidden"
    const timer = window.setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus()
    }, 40)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
      window.clearTimeout(timer)
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  function validateStep(current: Step): boolean {
    const next: Record<string, string> = {}
    if (current === 0 && !reason) next.reason = t.errors.reason
    if (current === 1) {
      if (name.trim().length < 2) next.name = t.errors.name
      if (!email.trim()) next.email = t.errors.email
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = t.errors.emailInvalid
      if (company.trim().length < 1) next.company = t.errors.company
    }
    if (current === 2 && (!day || !time)) next.time = t.errors.time
    if (current === 3 && !consent) next.consent = t.errors.consent
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function goNext() {
    if (!validateStep(step)) return
    setStep((prev) => Math.min(3, prev + 1) as Step)
  }

  function goBack() {
    setErrors({})
    setStep((prev) => Math.max(0, prev - 1) as Step)
  }

  async function submit() {
    if (!validateStep(3) || !reason || !day || !time) return
    setSubmitting(true)
    const request: AppointmentRequest = {
      reason,
      name: name.trim(),
      email: email.trim(),
      company: company.trim(),
      phone: phone.trim() || undefined,
      website: website.trim() || undefined,
      language,
      description: description.trim() || undefined,
      day,
      time,
      recommendationId: context?.recommendationId,
    }
    const result = await schedulingAdapter.submit(request)
    setSubmitting(false)
    if (result.ok) {
      track("appointment_submitted", { reason, source: context?.source ?? "unknown" })
      setConfirmed(true)
    } else {
      setErrors({ submit: t.errors.email })
    }
  }

  const reasonLabel = t.reasonOptions.find((o) => o.id === reason)?.label ?? ""
  const dayLabel = dayOptions.find((o) => o.value === day)?.label ?? ""

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <button
        type="button"
        aria-label={t.close}
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(8,9,11,0.55)] backdrop-blur-sm animate-in"
      />
      <div
        ref={dialogRef}
        className="relative flex max-h-[94svh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl border border-border bg-card shadow-2xl sm:rounded-3xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <h2 id={titleId} className="text-balance font-semibold text-lg text-foreground">
              {confirmed ? t.confirmTitle : t.title}
            </h2>
            <p id={descId} className="mt-1 text-sm leading-relaxed text-muted-foreground text-pretty">
              {confirmed ? t.whatNextBody : t.reassurance}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="grid size-9 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            <XIcon weight="bold" className="size-4" />
          </button>
        </header>

        {!confirmed && (
          <div className="border-b border-border px-6 py-3">
            <div className="flex items-center justify-between">
              <span className="label-mono text-muted-foreground">
                {t.step} {step + 1} {t.of} 4 · {stepTitles[step]}
              </span>
            </div>
            <div className="mt-2.5 flex gap-1.5" aria-hidden="true">
              {stepTitles.map((label, i) => (
                <span
                  key={label}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors duration-300",
                    i <= step ? "bg-brand" : "bg-border",
                  )}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {confirmed ? (
            <div className="space-y-6">
              <div className="mx-auto grid size-14 place-items-center rounded-full bg-brand/10 text-brand">
                <CheckIcon weight="bold" className="size-7" />
              </div>
              <dl className="divide-y divide-border rounded-2xl border border-border">
                <SummaryRow label={t.confirmReason} value={reasonLabel} />
                <SummaryRow label={t.confirmTime} value={`${dayLabel} · ${time}`} />
                <SummaryRow label={t.confirmEmail} value={email} />
              </dl>
              <div className="rounded-2xl bg-muted/60 p-4">
                <p className="text-sm font-medium text-foreground">{t.whatNext}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">{t.whatNextBody}</p>
              </div>
            </div>
          ) : (
            <>
              {step === 0 && (
                <fieldset className="space-y-2.5">
                  <legend className="sr-only">{t.steps.reason}</legend>
                  {t.reasonOptions.map((option, i) => (
                    <RadioCard
                      key={option.id}
                      option={option}
                      checked={reason === option.id}
                      autofocus={i === 0}
                      onSelect={() => {
                        setReason(option.id)
                        setErrors({})
                      }}
                    />
                  ))}
                  {errors.reason && <FieldError>{errors.reason}</FieldError>}
                </fieldset>
              )}

              {step === 1 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    autofocus
                    label={t.fields.name}
                    value={name}
                    onChange={setName}
                    placeholder={t.placeholders.name}
                    error={errors.name}
                    autoComplete="name"
                  />
                  <TextField
                    label={t.fields.email}
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder={t.placeholders.email}
                    error={errors.email}
                    autoComplete="email"
                  />
                  <TextField
                    label={t.fields.company}
                    value={company}
                    onChange={setCompany}
                    placeholder={t.placeholders.company}
                    error={errors.company}
                    autoComplete="organization"
                  />
                  <TextField
                    label={`${t.fields.phone} (${t.fields.optional})`}
                    type="tel"
                    value={phone}
                    onChange={setPhone}
                    placeholder={t.placeholders.phone}
                    autoComplete="tel"
                  />
                  <TextField
                    label={`${t.fields.website} (${t.fields.optional})`}
                    value={website}
                    onChange={setWebsite}
                    placeholder={t.placeholders.website}
                    className="sm:col-span-2"
                  />
                  <label className="sm:col-span-2">
                    <FieldLabel>{t.fields.language}</FieldLabel>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as Locale)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-brand"
                    >
                      <option value="en">{content.common.languageEnglish}</option>
                      <option value="es">{content.common.languageSpanish}</option>
                    </select>
                  </label>
                  <label className="sm:col-span-2">
                    <FieldLabel>
                      {t.fields.description} ({t.fields.optional})
                    </FieldLabel>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder={t.placeholders.description}
                      className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-brand"
                    />
                  </label>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <p className="text-sm leading-relaxed text-muted-foreground">{t.timeIntro}</p>
                  <div>
                    <FieldLabel>{t.pickDay}</FieldLabel>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {dayOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setDay(option.value)}
                          className={cn(
                            "rounded-xl border px-3 py-2.5 text-sm transition-colors",
                            day === option.value
                              ? "border-brand bg-brand/5 text-foreground"
                              : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <FieldLabel>{t.pickTime}</FieldLabel>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                      {TIME_OPTIONS.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setTime(option)}
                          className={cn(
                            "rounded-xl border px-2 py-2.5 text-sm transition-colors",
                            time === option
                              ? "border-brand bg-brand/5 text-foreground"
                              : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="flex items-start gap-2 rounded-xl bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
                    <CalendarBlankIcon weight="fill" className="mt-0.5 size-4 shrink-0" />
                    {t.timeNote}
                  </p>
                  {errors.time && <FieldError>{errors.time}</FieldError>}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <dl className="divide-y divide-border rounded-2xl border border-border">
                    <SummaryRow label={t.confirmReason} value={reasonLabel} />
                    <SummaryRow label={t.confirmTime} value={`${dayLabel} · ${time}`} />
                    <SummaryRow label={t.fields.name} value={name} />
                    <SummaryRow label={t.confirmEmail} value={email} />
                    <SummaryRow label={t.fields.company} value={company} />
                  </dl>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => {
                        setConsent(e.target.checked)
                        setErrors({})
                      }}
                      className="mt-0.5 size-4 shrink-0 rounded border-border accent-brand"
                    />
                    <span className="text-sm leading-relaxed text-muted-foreground">
                      {t.consent} <span className="text-foreground underline underline-offset-2">{t.privacyLink}</span>.
                    </span>
                  </label>
                  {errors.consent && <FieldError>{errors.consent}</FieldError>}
                </div>
              )}
            </>
          )}
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-border px-6 py-4">
          {confirmed ? (
            <ActionButton variant="primary" size="md" className="w-full" onClick={onClose}>
              {t.close}
            </ActionButton>
          ) : (
            <>
              <ActionButton
                variant="ghost"
                size="md"
                onClick={goBack}
                className={cn(step === 0 && "pointer-events-none opacity-0")}
              >
                <ArrowLeftIcon weight="bold" className="size-4" />
                {t.back}
              </ActionButton>
              {step === 3 ? (
                <ActionButton variant="primary" size="md" onClick={submit} disabled={submitting}>
                  {submitting ? t.submitting : t.submit}
                </ActionButton>
              ) : (
                <ActionButton variant="primary" size="md" onClick={goNext}>
                  {t.next}
                  <ArrowRightIcon weight="bold" className="size-4" />
                </ActionButton>
              )}
            </>
          )}
        </footer>
      </div>
    </div>
  )
}

function RadioCard({
  option,
  checked,
  autofocus,
  onSelect,
}: {
  option: ExplorerOption
  checked: boolean
  autofocus?: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      data-autofocus={autofocus || undefined}
      onClick={onSelect}
      aria-pressed={checked}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-colors",
        checked ? "border-brand bg-brand/5" : "border-border hover:border-foreground/30",
      )}
    >
      <span
        className={cn(
          "grid size-5 shrink-0 place-items-center rounded-full border",
          checked ? "border-brand bg-brand text-white" : "border-border",
        )}
        aria-hidden="true"
      >
        {checked && <CheckIcon weight="bold" className="size-3" />}
      </span>
      <span className="text-sm font-medium text-foreground">{option.label}</span>
    </button>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">{children}</span>
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="mt-2 text-sm text-destructive">
      {children}
    </p>
  )
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
  autoComplete,
  autofocus,
  className,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  type?: string
  autoComplete?: string
  autofocus?: boolean
  className?: string
}) {
  return (
    <label className={className}>
      <FieldLabel>{label}</FieldLabel>
      <input
        data-autofocus={autofocus || undefined}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        className={cn(
          "w-full rounded-xl border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-brand",
          error ? "border-destructive" : "border-border",
        )}
      />
      {error && <FieldError>{error}</FieldError>}
    </label>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm text-foreground">{value}</dd>
    </div>
  )
}
