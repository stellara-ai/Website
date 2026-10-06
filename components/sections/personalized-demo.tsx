"use client"

import { useState, type FormEvent } from "react"
import { ArrowRight, CheckCircle2, Link2, Smartphone } from "lucide-react"
import type { SiteContent } from "@/content/schema"
import { ActionButton } from "@/components/ui/action"
import { Reveal } from "@/components/util/reveal"
import { SectionHeading } from "@/components/sections/section-parts"
import { useInteraction } from "@/components/providers/interaction-context"

type DemoFormState = {
  website: string
  firstName: string
  lastName: string
  mobile: string
  email: string
}

const INITIAL_STATE: DemoFormState = {
  website: "",
  firstName: "",
  lastName: "",
  mobile: "",
  email: "",
}

const STEP_ICONS = [Link2, Smartphone, CheckCircle2] as const

export function PersonalizedDemo({ content }: { content: SiteContent }) {
  const { openAppointment } = useInteraction()
  const [form, setForm] = useState(INITIAL_STATE)
  const [submitted, setSubmitted] = useState(false)
  const section = content.personalizedDemo

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="personalized-demo" className="scroll-mt-20 border-t border-border">
      <div className="container-editorial py-20 md:py-24">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
          <Reveal className="rounded-3xl border border-border bg-card/70 p-5 shadow-soft backdrop-blur sm:p-7">
            <form className="space-y-4" onSubmit={onSubmit}>
              <Field
                label={section.fields.websiteLabel}
                type="url"
                required
                value={form.website}
                placeholder={section.fields.websitePlaceholder}
                onChange={(value) => setForm((prev) => ({ ...prev, website: value }))}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label={section.fields.firstNameLabel}
                  type="text"
                  required
                  value={form.firstName}
                  placeholder={section.fields.firstNamePlaceholder}
                  onChange={(value) => setForm((prev) => ({ ...prev, firstName: value }))}
                />
                <Field
                  label={section.fields.lastNameLabel}
                  type="text"
                  required
                  value={form.lastName}
                  placeholder={section.fields.lastNamePlaceholder}
                  onChange={(value) => setForm((prev) => ({ ...prev, lastName: value }))}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label={section.fields.mobileLabel}
                  type="tel"
                  required
                  value={form.mobile}
                  placeholder={section.fields.mobilePlaceholder}
                  onChange={(value) => setForm((prev) => ({ ...prev, mobile: value }))}
                />
              </div>
              <Field
                label={section.fields.emailLabel}
                type="email"
                required
                value={form.email}
                placeholder={section.fields.emailPlaceholder}
                onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
              />

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                <ActionButton type="submit" variant="primary" size="lg" className="w-full sm:w-auto">
                  {section.cta}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </ActionButton>
                <ActionButton
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => openAppointment({ source: "personalized-demo" })}
                >
                  {section.secondaryCta}
                </ActionButton>
              </div>
              <p className="text-xs text-muted-foreground">{section.helperText}</p>
              {submitted && (
                <p className="rounded-xl border border-border bg-background/80 px-3 py-2 text-xs text-muted-foreground">
                  {section.submittedText}
                </p>
              )}
            </form>
          </Reveal>

          <div className="grid gap-3">
            {section.steps.map((step, index) => {
              const Icon = STEP_ICONS[index] ?? CheckCircle2
              return (
                <Reveal
                  key={step.index}
                  delay={index * 90}
                  className="rounded-2xl border border-border bg-card/40 p-4 shadow-soft sm:p-5"
                >
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-brand/35 bg-brand-tint text-xs font-semibold text-brand">
                      {step.index}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Icon className="size-4 text-brand" aria-hidden="true" />
                        <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  type,
  value,
  placeholder,
  required,
  onChange,
}: {
  label: string
  type: string
  value: string
  placeholder: string
  required?: boolean
  onChange: (value: string) => void
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
      />
    </label>
  )
}
