import Image from "next/image"
import type { CSSProperties, ReactNode } from "react"
import { Check, Phone, CalendarCheck, Send, UserX, Moon } from "lucide-react"
import { StellaraSymbol } from "@/components/brand/stellara-logo"

export type Scene = {
  id: string
  tone: string
  time: string
  title: string
  caption: string
  render: (active: boolean) => ReactNode
}

const delay = (ms: number) => ({ "--ah-delay": `${ms}ms` }) as CSSProperties

function reveal(active: boolean) {
  return active ? "ah-reveal" : ""
}

const glass = "border border-border bg-background/90 backdrop-blur-md"

function PhotoBackdrop({ src, alt, dim, active }: { src: string; alt: string; dim?: boolean; active: boolean }) {
  return (
    <div className="absolute inset-0">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 34vw, 72vw"
        className={"object-cover " + (dim ? "brightness-[0.55]" : active ? "ah-lights-off" : "")}
        draggable={false}
      />
      <div className="absolute inset-0 bg-card/75" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-card/40" aria-hidden="true" />
    </div>
  )
}

function OfficeClosed({ active }: { active: boolean }) {
  return (
    <>
      <PhotoBackdrop src="/images/after-hours-office.png" alt="An empty law office at dusk with the lights going off" active={active} />
      <div className="relative flex flex-1 items-start justify-center pt-4">
        <span className={"flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-ink-foreground " + glass}>
          <Moon className="size-3.5 text-scene" aria-hidden="true" />
          Lights off
        </span>
      </div>
    </>
  )
}

function IncomingCall({ active }: { active: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6">
      <div className="relative flex size-24 items-center justify-center">
        {active &&
          [0, 800, 1600].map((ms) => (
            <span
              key={ms}
              className="ah-ring absolute inset-0 rounded-full border-2 border-scene/70"
              style={{ animationDelay: `${ms}ms` }}
              aria-hidden="true"
            />
          ))}
        <span className="relative flex size-24 items-center justify-center rounded-full bg-scene text-scene-b shadow-lg">
          <Phone className={"size-8 " + (active ? "ah-buzz" : "")} aria-hidden="true" />
        </span>
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-scene">Potential new client</p>
        <p className="font-display text-2xl font-medium tabular-nums text-ink-foreground">(312) 555-0148</p>
        <p className="text-sm text-ink-foreground/70">Calling main line</p>
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
          <div className={"flex flex-col gap-1 rounded-2xl p-4 " + glass}>
            <UserX className="size-4 text-ink-foreground/70" aria-hidden="true" />
            <p className="font-display text-5xl font-medium leading-none text-ink-foreground">0</p>
            <p className="text-xs text-ink-foreground/70">Staff available</p>
          </div>
          <div className="flex flex-col gap-1 rounded-2xl bg-scene p-4 text-scene-b">
            <span className="relative flex size-4 items-center justify-center" aria-hidden="true">
              <span className="absolute size-2.5 animate-ping rounded-full bg-scene-b/50" />
              <span className="size-2 rounded-full bg-scene-b" />
            </span>
            <p className="font-display text-5xl font-medium leading-none">1</p>
            <p className="text-xs font-medium">Client calling</p>
          </div>
        </div>
      </div>
    </>
  )
}

function StellaraActivates({ active }: { active: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-7">
      <div className="ah-float relative flex size-32 items-center justify-center">
        <span className="absolute inset-2 rounded-full bg-scene/25 blur-2xl" aria-hidden="true" />
        <span
          className={"absolute inset-0 rounded-full border border-scene/40 " + (active ? "ah-halo" : "")}
          aria-hidden="true"
        />
        <span
          className={"absolute inset-4 rounded-full border border-scene/70 " + (active ? "ah-halo" : "")}
          style={{ animationDelay: "180ms" }}
          aria-hidden="true"
        />
        <StellaraSymbol className="relative h-14 text-scene" />
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
      <div className={"flex items-center justify-between rounded-full px-3 py-1.5 " + glass}>
        <span className="flex items-center gap-2 text-xs font-medium text-ink-foreground">
          <span className="size-1.5 animate-pulse rounded-full bg-scene" aria-hidden="true" />
          Live call
        </span>
        <span className="flex h-4 items-center gap-0.5" aria-hidden="true">
          {[0.5, 0.9, 0.6, 1, 0.7, 0.4, 0.8].map((h, i) => (
            <span
              key={i}
              className={"w-0.5 rounded-full bg-scene " + (active ? "ah-wave" : "")}
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
              ? "self-start rounded-tl-sm text-ink-foreground " + glass
              : "self-end rounded-tr-sm bg-scene font-medium text-scene-b") +
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
      <span className="flex items-center gap-1.5 self-start rounded-full bg-scene px-2.5 py-1 text-xs font-semibold text-scene-b">
        <Check className="size-3.5" aria-hidden="true" />
        Qualified lead
      </span>
      <dl className={"flex flex-col divide-y divide-ink-foreground/10 rounded-2xl " + glass}>
        {CAPTURED.map(([label, value], i) => (
          <div
            key={label}
            className={"flex items-center justify-between gap-3 px-3.5 py-2 " + reveal(active)}
            style={delay(200 + i * 220)}
          >
            <dt className="text-xs text-ink-foreground/70">{label}</dt>
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
        <p className="text-xs text-ink-foreground/70">Wed, Oct 15</p>
      </div>
      <div className="flex flex-col gap-2">
        {SLOTS.map((slot, i) => {
          const chosen = i === 1
          return (
            <div
              key={slot}
              className={
                "flex items-center justify-between rounded-xl px-3.5 py-3 text-sm transition-all duration-700 " +
                (chosen && active
                  ? "scale-[1.03] bg-scene font-semibold text-scene-b shadow-lg"
                  : "text-ink-foreground/80 " + glass)
              }
              style={{ transitionDelay: chosen ? "700ms" : "0ms" }}
            >
              <span className="font-medium tabular-nums">{slot}</span>
              {chosen && <CalendarCheck className="size-4" aria-hidden="true" />}
            </div>
          )
        })}
      </div>
      <p className={"text-sm text-ink-foreground/75 " + reveal(active)} style={delay(1200)}>
        Consultation with J. Harlow. Confirmation sent by text.
      </p>
    </div>
  )
}

function TeamUpdated({ active }: { active: boolean }) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-3">
      <div className={"flex flex-col gap-3 rounded-2xl p-4 " + glass + " " + reveal(active)}>
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 text-xs font-medium text-ink-foreground">
            <StellaraSymbol className="h-3.5 text-brand" />
            New intake
          </span>
          <span className="rounded-full bg-scene px-2 py-0.5 text-xs font-semibold text-scene-b">High priority</span>
        </div>
        <p className="text-sm font-medium leading-snug text-ink-foreground">
          Maria Delgado, rear-end collision today. Neck and back injuries, other driver cited.
        </p>
        <p className="text-sm leading-snug text-ink-foreground/75">Consult booked tomorrow 9:30 AM with J. Harlow.</p>
      </div>
      <div className={"flex items-center gap-2 text-xs text-ink-foreground/75 " + reveal(active)} style={delay(500)}>
        <Send className="size-3.5 text-scene" aria-hidden="true" />
        Sent to intake team, email and CRM
      </div>
    </div>
  )
}

function FinalScene({ active }: { active: boolean }) {
  return (
    <>
      <PhotoBackdrop src="/images/after-hours-exterior.png" alt="A quiet law office building at night" active={false} />
      <div className="relative flex flex-1 flex-col justify-end gap-2 pb-1">
        <p
          className={"text-balance font-display text-3xl font-medium leading-tight tracking-tight text-ink-foreground " + reveal(active)}
        >
          Your office is closed. <span className="text-scene">{"Your business isn\u2019t."}</span>
        </p>
      </div>
    </>
  )
}

export const SCENES: Scene[] = [
  {
    id: "closed",
    tone: "ah-tone-dusk",
    time: "6:59 PM",
    title: "Office closed",
    caption: "Everyone has gone home for the evening.",
    render: (a) => <OfficeClosed active={a} />,
  },
  {
    id: "call",
    tone: "ah-tone-call",
    time: "7:14 PM",
    title: "Incoming call",
    caption: "A new client reaches out after hours.",
    render: (a) => <IncomingCall active={a} />,
  },
  {
    id: "nobody",
    tone: "ah-tone-night",
    time: "7:14 PM",
    title: "Nobody is there",
    caption: "The office is empty, and the phone keeps ringing.",
    render: () => <NobodyThere />,
  },
  {
    id: "activates",
    tone: "ah-tone-magic",
    time: "7:14 PM",
    title: "Stellara activates",
    caption: "Your after-hours receptionist picks up.",
    render: (a) => <StellaraActivates active={a} />,
  },
  {
    id: "answers",
    tone: "ah-tone-ocean",
    time: "7:15 PM",
    title: "AI receptionist answers",
    caption: "A natural conversation, and intake begins.",
    render: (a) => <AiAnswers active={a} />,
  },
  {
    id: "qualified",
    tone: "ah-tone-meadow",
    time: "7:17 PM",
    title: "Lead qualified",
    caption: "Contact and incident details captured.",
    render: (a) => <LeadQualified active={a} />,
  },
  {
    id: "consult",
    tone: "ah-tone-sunset",
    time: "7:18 PM",
    title: "Consultation requested",
    caption: "The next step is already on the calendar.",
    render: (a) => <Consultation active={a} />,
  },
  {
    id: "team",
    tone: "ah-tone-sky",
    time: "7:19 PM",
    title: "Team updated",
    caption: "A clean intake summary is waiting by morning.",
    render: (a) => <TeamUpdated active={a} />,
  },
  {
    id: "final",
    tone: "ah-tone-starlight",
    time: "7:20 PM",
    title: "All quiet",
    caption: "Stellara keeps your firm responsive after hours.",
    render: (a) => <FinalScene active={a} />,
  },
]
