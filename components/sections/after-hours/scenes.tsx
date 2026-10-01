import Image from "next/image"
import type { CSSProperties, ReactNode } from "react"
import { Check, Phone, CalendarCheck, Send, UserX } from "lucide-react"
import { StellaraSymbol } from "@/components/brand/stellara-logo"

export type Scene = {
  id: string
  time: string
  title: string
  caption: string
  render: (active: boolean) => ReactNode
}

const delay = (ms: number) => ({ "--ah-delay": `${ms}ms` }) as CSSProperties

function reveal(active: boolean) {
  return active ? "ah-reveal" : ""
}

function PhotoBackdrop({ src, alt, dim, active }: { src: string; alt: string; dim?: boolean; active: boolean }) {
  return (
    <div className="absolute inset-0">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 34vw, 72vw"
        className={"object-cover " + (dim ? "brightness-[0.38] saturate-50" : active ? "ah-lights-off" : "")}
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/0" aria-hidden="true" />
    </div>
  )
}

function OfficeClosed({ active }: { active: boolean }) {
  return (
    <>
      <PhotoBackdrop src="/images/after-hours-office.png" alt="An empty law office at dusk with the lights going off" active={active} />
      <div className="relative flex flex-1 items-start justify-center pt-4">
        <span className="flex items-center gap-2 rounded-full border border-ink-border bg-ink/50 px-3 py-1 text-xs font-medium text-ink-foreground backdrop-blur-md">
          <span className="size-1.5 rounded-full bg-ink-muted" aria-hidden="true" />
          Lights off
        </span>
      </div>
    </>
  )
}

function IncomingCall({ active }: { active: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6">
      <div className="relative flex size-20 items-center justify-center">
        {active &&
          [0, 800, 1600].map((ms) => (
            <span
              key={ms}
              className="ah-ring absolute inset-0 rounded-full border border-gilt/60"
              style={{ animationDelay: `${ms}ms` }}
              aria-hidden="true"
            />
          ))}
        <span className="relative flex size-20 items-center justify-center rounded-full bg-gilt text-ink">
          <Phone className={"size-7 " + (active ? "ah-buzz" : "")} aria-hidden="true" />
        </span>
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-gilt">Potential new client</p>
        <p className="font-display text-2xl font-medium tabular-nums text-ink-foreground">(312) 555-0148</p>
        <p className="text-sm text-ink-muted">Calling main line</p>
      </div>
    </div>
  )
}

function NobodyThere() {
  return (
    <>
      <PhotoBackdrop src="/images/after-hours-office.png" alt="" dim active={false} />
      <div className="relative flex flex-1 items-center">
        <div className="grid w-full grid-cols-2 gap-2">
          <div className="flex flex-col gap-1 rounded-2xl border border-ink-border bg-ink/60 p-4 backdrop-blur-md">
            <UserX className="size-4 text-ink-muted" aria-hidden="true" />
            <p className="font-display text-5xl font-medium leading-none text-ink-foreground">0</p>
            <p className="text-xs text-ink-muted">Staff available</p>
          </div>
          <div className="flex flex-col gap-1 rounded-2xl border border-gilt/30 bg-ink/60 p-4 backdrop-blur-md">
            <span className="relative flex size-4 items-center justify-center" aria-hidden="true">
              <span className="absolute size-2 animate-ping rounded-full bg-gilt/60" />
              <span className="size-2 rounded-full bg-gilt" />
            </span>
            <p className="font-display text-5xl font-medium leading-none text-gilt">1</p>
            <p className="text-xs text-ink-muted">Client calling</p>
          </div>
        </div>
      </div>
    </>
  )
}

function StellaraActivates({ active }: { active: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-7">
      <div className="relative flex size-28 items-center justify-center">
        <span
          className={"absolute inset-0 rounded-full border border-gilt/25 " + (active ? "ah-halo" : "")}
          aria-hidden="true"
        />
        <span
          className={"absolute inset-3 rounded-full border border-gilt/40 " + (active ? "ah-halo" : "")}
          style={{ animationDelay: "180ms" }}
          aria-hidden="true"
        />
        <StellaraSymbol className="h-14 text-gilt" />
      </div>
      <p
        className={"font-display text-4xl font-medium tracking-tight text-ink-foreground " + reveal(active)}
        style={delay(500)}
      >
        {"\u201CI got this.\u201D"}
      </p>
    </div>
  )
}

const TRANSCRIPT = [
  { from: "ai", text: "Thank you for calling Harlow & Reyes. Are you calling about an accident?" },
  { from: "caller", text: "Yes. I was rear-ended on my way home today." },
  { from: "ai", text: "I'm sorry to hear that. Let's get a few details so an attorney can help." },
] as const

function AiAnswers({ active }: { active: boolean }) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-3">
      <div className="flex items-center justify-between rounded-full border border-ink-border px-3 py-1.5">
        <span className="flex items-center gap-2 text-xs font-medium text-ink-foreground">
          <span className="size-1.5 rounded-full bg-status-done" aria-hidden="true" />
          Live call
        </span>
        <span className="flex h-4 items-center gap-0.5" aria-hidden="true">
          {[0.5, 0.9, 0.6, 1, 0.7, 0.4, 0.8].map((h, i) => (
            <span
              key={i}
              className={"w-0.5 rounded-full bg-gilt " + (active ? "ah-wave" : "")}
              style={{ height: `${h * 100}%`, animationDelay: `${i * 110}ms` }}
            />
          ))}
        </span>
      </div>
      {TRANSCRIPT.map((line, i) => (
        <p
          key={i}
          className={
            "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-snug " +
            (line.from === "ai"
              ? "self-start rounded-tl-sm bg-ink-foreground/10 text-ink-foreground"
              : "self-end rounded-tr-sm bg-gilt text-ink") +
            " " +
            reveal(active)
          }
          style={delay(300 + i * 700)}
        >
          {line.text}
        </p>
      ))}
    </div>
  )
}

const CAPTURED = [
  ["Name", "Maria Delgado"],
  ["Phone", "(312) 555-0148"],
  ["Incident", "Rear-end collision"],
  ["Date", "Today, 5:40 PM"],
  ["Injuries", "Neck and back pain"],
  ["Liability", "Other driver cited"],
] as const

function LeadQualified({ active }: { active: boolean }) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-3">
      <span className="flex items-center gap-1.5 self-start rounded-full bg-status-done/15 px-2.5 py-1 text-xs font-medium text-status-done">
        <Check className="size-3.5" aria-hidden="true" />
        Qualified lead
      </span>
      <dl className="flex flex-col divide-y divide-ink-border rounded-2xl border border-ink-border">
        {CAPTURED.map(([label, value], i) => (
          <div
            key={label}
            className={"flex items-center justify-between gap-3 px-3.5 py-2 " + reveal(active)}
            style={delay(200 + i * 220)}
          >
            <dt className="text-xs text-ink-muted">{label}</dt>
            <dd className="truncate text-sm font-medium text-ink-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

const SLOTS = ["9:00 AM", "9:30 AM", "11:00 AM"]

function Consultation({ active }: { active: boolean }) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-4">
      <div className="flex items-baseline justify-between">
        <p className="font-display text-lg font-medium text-ink-foreground">Tomorrow</p>
        <p className="text-xs text-ink-muted">Wed, Oct 15</p>
      </div>
      <div className="flex flex-col gap-2">
        {SLOTS.map((slot, i) => {
          const chosen = i === 1
          return (
            <div
              key={slot}
              className={
                "flex items-center justify-between rounded-xl border px-3.5 py-3 text-sm transition-colors duration-700 " +
                (chosen && active
                  ? "border-gilt bg-gilt text-ink"
                  : "border-ink-border text-ink-muted")
              }
              style={{ transitionDelay: chosen ? "700ms" : "0ms" }}
            >
              <span className="font-medium tabular-nums">{slot}</span>
              {chosen && <CalendarCheck className="size-4" aria-hidden="true" />}
            </div>
          )
        })}
      </div>
      <p className={"text-sm text-ink-muted " + reveal(active)} style={delay(1200)}>
        Consultation with J. Harlow. Confirmation sent by text.
      </p>
    </div>
  )
}

function TeamUpdated({ active }: { active: boolean }) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-3">
      <div className={"flex flex-col gap-3 rounded-2xl border border-ink-border bg-ink-foreground/5 p-4 " + reveal(active)}>
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 text-xs font-medium text-ink-foreground">
            <StellaraSymbol className="h-3.5 text-gilt" />
            New intake
          </span>
          <span className="rounded-full bg-gilt/15 px-2 py-0.5 text-xs font-medium text-gilt">High priority</span>
        </div>
        <p className="text-sm font-medium leading-snug text-ink-foreground">
          Maria Delgado, rear-end collision today. Neck and back injuries, other driver cited.
        </p>
        <p className="text-sm leading-snug text-ink-muted">Consult booked tomorrow 9:30 AM with J. Harlow.</p>
      </div>
      <div className={"flex items-center gap-2 text-xs text-ink-muted " + reveal(active)} style={delay(500)}>
        <Send className="size-3.5 text-gilt" aria-hidden="true" />
        Sent to intake team, email and CRM
      </div>
    </div>
  )
}

function FinalScene({ active }: { active: boolean }) {
  return (
    <>
      <PhotoBackdrop src="/images/after-hours-exterior.png" alt="A quiet law office building at night" dim={false} active={false} />
      <div className="relative flex flex-1 flex-col justify-end gap-2 pb-1">
        <p
          className={"text-balance font-display text-3xl font-medium leading-tight tracking-tight text-ink-foreground " + reveal(active)}
        >
          Your office is closed. <span className="text-gilt">{"Your business isn\u2019t."}</span>
        </p>
      </div>
    </>
  )
}

export const SCENES: Scene[] = [
  {
    id: "closed",
    time: "6:59 PM",
    title: "Office closed",
    caption: "Everyone has gone home for the evening.",
    render: (a) => <OfficeClosed active={a} />,
  },
  {
    id: "call",
    time: "7:14 PM",
    title: "Incoming call",
    caption: "A new client reaches out after hours.",
    render: (a) => <IncomingCall active={a} />,
  },
  {
    id: "nobody",
    time: "7:14 PM",
    title: "Nobody is there",
    caption: "The office is empty, and the phone keeps ringing.",
    render: () => <NobodyThere />,
  },
  {
    id: "activates",
    time: "7:14 PM",
    title: "Stellara activates",
    caption: "Your after-hours receptionist picks up.",
    render: (a) => <StellaraActivates active={a} />,
  },
  {
    id: "answers",
    time: "7:15 PM",
    title: "AI receptionist answers",
    caption: "A natural conversation, and intake begins.",
    render: (a) => <AiAnswers active={a} />,
  },
  {
    id: "qualified",
    time: "7:17 PM",
    title: "Lead qualified",
    caption: "Contact and incident details captured.",
    render: (a) => <LeadQualified active={a} />,
  },
  {
    id: "consult",
    time: "7:18 PM",
    title: "Consultation requested",
    caption: "The next step is already on the calendar.",
    render: (a) => <Consultation active={a} />,
  },
  {
    id: "team",
    time: "7:19 PM",
    title: "Team updated",
    caption: "A clean intake summary is waiting by morning.",
    render: (a) => <TeamUpdated active={a} />,
  },
  {
    id: "final",
    time: "7:20 PM",
    title: "All quiet",
    caption: "Stellara keeps your firm responsive after hours.",
    render: (a) => <FinalScene active={a} />,
  },
]
