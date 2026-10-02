import type { CSSProperties, ReactNode } from "react"
import { CalendarCheck, Check, Phone } from "lucide-react"
import { StellaraSymbol } from "@/components/brand/stellara-logo"

export type Scene = {
  id: string
  tone: string
  time: string
  step: string
  title: string
  headline: ReactNode
  body: string
  summary: string
  durationMs: number
  visual: (active: boolean) => ReactNode
}

const delay = (ms: number) => ({ "--ah-delay": `${ms}ms` }) as CSSProperties

const enter = (active: boolean) => (active ? "ah-reveal" : "")

const WINDOW_COUNT = 20

function OfficeClosed({ active }: { active: boolean }) {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <span className="ah-moon absolute right-7 top-6 size-8 rounded-full" />
      {["left-8 top-10", "left-1/3 top-6", "right-1/3 top-16", "left-1/4 top-20"].map((pos, i) => (
        <span
          key={pos}
          className={"ah-twinkle absolute size-1 rounded-full bg-scene " + pos}
          style={{ animationDelay: `${i * 600}ms` }}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
        <div className="grid w-[56%] grid-cols-5 gap-1.5 rounded-t-xl border border-b-0 border-border bg-card p-2.5 shadow-sm">
          {Array.from({ length: WINDOW_COUNT }, (_, i) => (
            <span
              key={i}
              className={"ah-window aspect-[4/5] rounded-[3px] " + (active ? "ah-window-off" : "")}
              style={delay(300 + ((i * 7) % WINDOW_COUNT) * 95)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function IncomingCall({ active }: { active: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4" aria-hidden="true">
      <div className="relative flex size-20 items-center justify-center">
        {active &&
          [0, 600, 1200].map((ms) => (
            <span
              key={ms}
              className="ah-ring absolute inset-0 rounded-full border border-scene"
              style={{ animationDelay: `${ms}ms` }}
            />
          ))}
        <span className="relative flex size-20 items-center justify-center rounded-full border border-border bg-card font-display text-2xl font-medium text-scene shadow-sm">
          JM
        </span>
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="text-sm font-semibold text-foreground">Jordan Miles</span>
        <span className="text-xs text-muted-foreground">{"New caller \u00B7 Kitchen remodel"}</span>
      </div>
      <span className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">
        <Phone className={"size-3.5 text-scene " + (active ? "ah-buzz" : "")} />
        {"Ringing\u2026"}
      </span>
    </div>
  )
}

const TRANSCRIPT = [
  { from: "caller", text: "Hi, can I get a quote for a kitchen remodel?", at: 350 },
  { from: "stellara", text: "Of course. What timeline are you thinking?", at: 1350 },
  { from: "caller", text: "Next month. Budget is around $40k.", at: 2450 },
] as const

function StellaraAnswers({ active }: { active: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col gap-2.5 p-3.5" aria-hidden="true">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <StellaraSymbol className="h-4 text-brand" />
          Stellara
        </span>
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <span className="flex h-3 items-center gap-0.5">
            {[0, 150, 300, 450].map((ms) => (
              <span
                key={ms}
                className={"h-full w-0.5 rounded-full bg-brand " + (active ? "ah-wave" : "scale-y-50")}
                style={{ animationDelay: `${ms}ms` }}
              />
            ))}
          </span>
          Live
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-2">
        {TRANSCRIPT.map((line) => (
          <p
            key={line.text}
            className={
              "max-w-[86%] rounded-2xl px-3 py-2 text-xs leading-snug text-foreground " +
              (line.from === "stellara"
                ? "self-start rounded-tl-sm border border-brand/25 bg-brand-tint"
                : "self-end rounded-tr-sm border border-border bg-card") +
              " " +
              (active ? "ah-reveal" : "")
            }
            style={delay(line.at)}
          >
            {line.text}
          </p>
        ))}
        <span
          className={
            "flex items-center gap-2 self-start rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground shadow-sm " +
            (active ? "ah-reveal" : "")
          }
          style={delay(3500)}
        >
          <span className="flex size-4 items-center justify-center rounded-full bg-scene text-background">
            <Check className="size-3" strokeWidth={3} />
          </span>
          Lead qualified
        </span>
      </div>
    </div>
  )
}

function Booked({ active }: { active: boolean }) {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      {[
        { size: "size-[26rem]", orbit: "28s" },
        { size: "size-[17rem]", orbit: "20s" },
      ].map((ring) => (
        <div
          key={ring.size}
          className={"absolute left-1/2 top-[78%] -translate-x-1/2 -translate-y-1/2 " + ring.size}
        >
          <div
            className="ah-orbit absolute inset-0 rounded-full border border-border"
            style={{ "--ah-orbit": ring.orbit } as CSSProperties}
          >
            <span className="absolute left-1/2 top-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand" />
          </div>
        </div>
      ))}
      <div className="absolute inset-x-0 top-[78%] flex justify-center">
        <span className={"ah-sun size-28 rounded-full " + (active ? "ah-rise" : "-translate-y-1/2")} />
      </div>
      <span className="ah-horizon absolute inset-x-6 top-[78%] h-px" />

      <div className="absolute inset-x-0 top-0 flex flex-col items-center gap-2 p-4">
        <span
          className={
            "flex w-full max-w-60 items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2 shadow-sm " +
            enter(active)
          }
          style={delay(450)}
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-scene text-background">
            <Check className="size-3.5" strokeWidth={3} />
          </span>
          <span className="flex flex-col">
            <span className="text-xs font-semibold text-foreground">Lead qualified</span>
            <span className="text-xs text-muted-foreground">{"Jordan Miles \u00B7 $40k"}</span>
          </span>
        </span>
        <span
          className={
            "flex w-full max-w-60 items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2 shadow-sm " +
            enter(active)
          }
          style={delay(900)}
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand">
            <CalendarCheck className="size-3.5" />
          </span>
          <span className="flex flex-col">
            <span className="text-xs font-semibold text-foreground">Consultation booked</span>
            <span className="text-xs tabular-nums text-muted-foreground">{"Tomorrow \u00B7 9:30 AM"}</span>
          </span>
        </span>
      </div>
    </div>
  )
}

export const SCENES: Scene[] = [
  {
    id: "closed",
    tone: "ah-tone-dusk",
    time: "6:59 PM",
    step: "Closed",
    title: "Office closed",
    headline: "Your team clocks out.",
    body: "The lights go off. The phone keeps ringing.",
    summary: "Your team has gone home and the office is closed.",
    durationMs: 3400,
    visual: (a) => <OfficeClosed active={a} />,
  },
  {
    id: "call",
    tone: "ah-tone-call",
    time: "7:14 PM",
    step: "Call",
    title: "Incoming call",
    headline: "A new client calls.",
    body: "After hours, most calls hit voicemail and never call back.",
    summary: "A potential new client, Jordan Miles, calls about a kitchen remodel after hours.",
    durationMs: 3600,
    visual: (a) => <IncomingCall active={a} />,
  },
  {
    id: "stellara",
    tone: "ah-tone-magic",
    time: "7:14 PM",
    step: "Stellara",
    title: "Stellara answers",
    headline: (
      <>
        Stellara <span className="text-brand">picks up.</span>
      </>
    ),
    body: "Answers on the first ring, asks the right questions, qualifies the lead.",
    summary: "Stellara answers on the first ring, talks with the caller and qualifies the lead.",
    durationMs: 6000,
    visual: (a) => <StellaraAnswers active={a} />,
  },
  {
    id: "booked",
    tone: "ah-tone-starlight",
    time: "7:20 PM",
    step: "Booked",
    title: "Consultation booked",
    headline: (
      <>
        Your office is closed. <span className="text-brand">{"Your business isn\u2019t."}</span>
      </>
    ),
    body: "Booked for 9:30 AM and logged in your CRM.",
    summary:
      "A qualified lead with a consultation booked for tomorrow at 9:30 AM, logged in your CRM. Your office is closed, your business isn't.",
    durationMs: 6400,
    visual: (a) => <Booked active={a} />,
  },
]
