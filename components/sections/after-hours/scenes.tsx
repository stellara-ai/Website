import Image from "next/image"
import type { CSSProperties, ReactNode } from "react"
import { Check, Phone, CalendarCheck, Moon } from "lucide-react"
import { StellaraSymbol } from "@/components/brand/stellara-logo"

export type Scene = {
  id: string
  tone: string
  time: string
  title: string
  summary: string
  durationMs: number
  render: (active: boolean) => ReactNode
}

const delay = (ms: number) => ({ "--ah-delay": `${ms}ms` }) as CSSProperties

function reveal(active: boolean) {
  return active ? "ah-reveal" : ""
}

const glass = "border border-border bg-background/90 backdrop-blur-md"

function PhotoBackdrop({ src, alt, lightsOff }: { src: string; alt: string; lightsOff?: boolean }) {
  return (
    <div className="absolute inset-0">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 34vw, 72vw"
        className={"object-cover " + (lightsOff ? "ah-lights-off" : "")}
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/20 to-transparent" aria-hidden="true" />
    </div>
  )
}

function OfficeClosed({ active }: { active: boolean }) {
  return (
    <>
      <PhotoBackdrop
        src="/images/after-hours-office.png"
        alt="An empty law office at dusk with the lights going off"
        lightsOff={active}
      />
      <div className="relative flex flex-1 flex-col justify-end gap-3">
        <span
          className={
            "flex items-center gap-2 self-start rounded-full px-3 py-1 text-xs font-medium text-ink-foreground " +
            glass +
            " " +
            reveal(active)
          }
          style={delay(250)}
        >
          <Moon className="size-3.5 text-scene" aria-hidden="true" />
          {"Office closed \u00B7 0 staff available"}
        </span>
        <p
          className={
            "text-balance font-display text-3xl font-medium leading-tight tracking-tight text-ink-foreground " +
            reveal(active)
          }
          style={delay(100)}
        >
          {"Everyone\u2019s gone home."}
        </p>
      </div>
    </>
  )
}

function IncomingCall({ active }: { active: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8">
      <div className="relative flex size-28 items-center justify-center">
        {active &&
          [0, 450, 900].map((ms) => (
            <span
              key={ms}
              className="ah-ring absolute inset-0 rounded-full border-2 border-scene/70"
              style={{ animationDelay: `${ms}ms` }}
              aria-hidden="true"
            />
          ))}
        <span className="relative flex size-28 items-center justify-center rounded-full bg-scene text-scene-b shadow-lg">
          <Phone className={"size-9 " + (active ? "ah-buzz" : "")} aria-hidden="true" />
        </span>
      </div>
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-scene">Potential new client</p>
        <p
          className={
            "text-balance font-display text-3xl font-medium leading-tight tracking-tight text-ink-foreground " +
            reveal(active)
          }
          style={delay(200)}
        >
          {"But opportunities don\u2019t keep office hours."}
        </p>
      </div>
    </div>
  )
}

const EVENTS = ["Call answered", "Lead qualified", "Consultation booked", "CRM updated"]

function StellaraTakesOver({ active }: { active: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6">
      <div className="ah-float relative flex size-28 items-center justify-center">
        <span className="absolute inset-2 rounded-full bg-scene/25 blur-2xl" aria-hidden="true" />
        <span
          className={"absolute inset-0 rounded-full border border-scene/40 " + (active ? "ah-halo" : "")}
          aria-hidden="true"
        />
        <span
          className={"absolute inset-4 rounded-full border border-scene/70 " + (active ? "ah-halo" : "")}
          style={{ animationDelay: "160ms" }}
          aria-hidden="true"
        />
        <StellaraSymbol className="relative h-12 text-scene" />
      </div>
      <p
        className={"font-display text-4xl font-medium tracking-tight text-ink-foreground " + reveal(active)}
        style={delay(250)}
      >
        {"I got this."}
      </p>
      <ul className="flex w-full max-w-60 flex-col gap-1.5">
        {EVENTS.map((label, i) => (
          <li
            key={label}
            className={
              "flex items-center gap-2.5 rounded-full px-3 py-1.5 text-sm font-medium text-ink-foreground " +
              glass +
              " " +
              (active ? "ah-reveal" : "opacity-0")
            }
            style={delay(750 + i * 420)}
          >
            <span className="flex size-4 items-center justify-center rounded-full bg-scene text-scene-b">
              <Check className="size-3" strokeWidth={3} aria-hidden="true" />
            </span>
            {label}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Outcome({ active }: { active: boolean }) {
  return (
    <>
      <PhotoBackdrop src="/images/after-hours-exterior.png" alt="A quiet law office building at night" />
      <div className="relative flex flex-1 flex-col justify-between gap-4">
        <div className={"flex flex-col gap-2 rounded-2xl p-3.5 " + glass + " " + reveal(active)} style={delay(150)}>
          <span className="flex items-center gap-2 text-sm font-semibold text-ink-foreground">
            <span className="flex size-4 items-center justify-center rounded-full bg-scene text-scene-b">
              <Check className="size-3" strokeWidth={3} aria-hidden="true" />
            </span>
            New qualified lead
          </span>
          <span className="flex items-start gap-2 text-sm text-ink-foreground">
            <CalendarCheck className="mt-0.5 size-4 shrink-0 text-scene" aria-hidden="true" />
            <span className="flex flex-col">
              <span className="font-medium">Consultation booked</span>
              <span className="text-xs tabular-nums text-ink-foreground/70">{"Tomorrow \u00B7 9:30 AM"}</span>
            </span>
          </span>
        </div>
        <p
          className={
            "text-balance font-display text-3xl font-medium leading-tight tracking-tight text-ink-foreground " +
            reveal(active)
          }
          style={delay(650)}
        >
          <span className="text-ink-foreground/70">Your office is closed.</span>{" "}
          <span className="text-scene">{"Your business isn\u2019t."}</span>
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
    summary: "Everyone has gone home. The office is closed with no staff available.",
    durationMs: 2600,
    render: (a) => <OfficeClosed active={a} />,
  },
  {
    id: "call",
    tone: "ah-tone-call",
    time: "7:14 PM",
    title: "Incoming call",
    summary: "A potential new client calls after hours.",
    durationMs: 2600,
    render: (a) => <IncomingCall active={a} />,
  },
  {
    id: "stellara",
    tone: "ah-tone-magic",
    time: "7:14 PM",
    title: "Stellara takes over",
    summary: "Stellara answers the call, qualifies the lead, books a consultation and updates the CRM.",
    durationMs: 4800,
    render: (a) => <StellaraTakesOver active={a} />,
  },
  {
    id: "outcome",
    tone: "ah-tone-starlight",
    time: "7:20 PM",
    title: "Work is done",
    summary: "A new qualified lead with a consultation booked for tomorrow at 9:30 AM. Your office is closed, your business isn't.",
    durationMs: 4400,
    render: (a) => <Outcome active={a} />,
  },
]
