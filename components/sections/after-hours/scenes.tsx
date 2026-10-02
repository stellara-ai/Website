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

function AbstractPanel({ children }: { children: ReactNode }) {
  return (
    <div
      className="ah-panel absolute inset-x-0 bottom-0 top-4 isolate overflow-hidden rounded-[1.25rem] ring-1 ring-inset ring-border [clip-path:inset(0_round_1.25rem)]"
      aria-hidden="true"
    >
      {children}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-card via-card/70 to-transparent" />
    </div>
  )
}

const WINDOW_COUNT = 20

function OfficeClosed({ active }: { active: boolean }) {
  return (
    <>
      <AbstractPanel>
        <span className="ah-moon absolute right-8 top-8 size-9 rounded-full" />
        {[
          "left-10 top-12",
          "left-1/3 top-7",
          "right-1/4 top-20",
        ].map((pos, i) => (
          <span
            key={pos}
            className={"ah-twinkle absolute size-1 rounded-full bg-primary/70 " + pos}
            style={{ animationDelay: `${i * 700}ms` }}
          />
        ))}
        <div className="absolute inset-x-0 top-[22%] flex flex-col items-center">
          <div className="grid w-44 grid-cols-5 gap-1.5 rounded-t-xl border border-b-0 border-border bg-card p-2.5 shadow-sm">
            {Array.from({ length: WINDOW_COUNT }, (_, i) => (
              <span
                key={i}
                className={"ah-window h-5 rounded-[4px] " + (active ? "ah-window-off" : "")}
                style={delay(350 + ((i * 7) % WINDOW_COUNT) * 85)}
              />
            ))}
          </div>
          <span className="h-px w-4/5 bg-border" />
        </div>
      </AbstractPanel>
      <div className="relative flex flex-1 flex-col justify-end gap-3 p-4">
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
        <span className="absolute inset-2 rounded-full bg-brand/25 blur-2xl" aria-hidden="true" />
        <span
          className={"absolute inset-0 rounded-full border border-scene/40 " + (active ? "ah-halo" : "")}
          aria-hidden="true"
        />
        <span
          className={"absolute inset-4 rounded-full border border-brand/60 " + (active ? "ah-halo" : "")}
          style={{ animationDelay: "160ms" }}
          aria-hidden="true"
        />
        <StellaraSymbol className="relative h-12 text-brand" />
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
      <AbstractPanel>
        {[
          { size: "size-[34rem]", orbit: "26s", dot: false, d: 300 },
          { size: "size-[24rem]", orbit: "18s", dot: true, d: 180 },
          { size: "size-[15rem]", orbit: "12s", dot: true, d: 60 },
        ].map((ring) => (
          <div
            key={ring.size}
            className={
              "absolute left-1/2 top-[62%] -translate-x-1/2 -translate-y-1/2 " +
              ring.size +
              " " +
              (active ? "ah-reveal" : "opacity-0")
            }
            style={delay(ring.d)}
          >
            <div
              className="ah-orbit absolute inset-0 rounded-full border border-border"
              style={{ "--ah-orbit": ring.orbit } as CSSProperties}
            >
              {ring.dot && (
                <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_12px_2px] shadow-primary/50" />
              )}
            </div>
          </div>
        ))}
        <div className="absolute inset-x-0 top-[62%] flex justify-center">
          <span className={"ah-sun size-24 -translate-y-1/2 rounded-full " + (active ? "ah-rise" : "opacity-0")} />
        </div>
      </AbstractPanel>
      <div className="relative flex flex-1 flex-col justify-between gap-4 p-3">
        <div className={"flex flex-col gap-2 rounded-2xl p-3.5 " + glass + " " + reveal(active)} style={delay(150)}>
          <span className="flex items-center gap-2 text-sm font-semibold text-ink-foreground">
            <span className="flex size-4 items-center justify-center rounded-full bg-scene text-scene-b">
              <Check className="size-3" strokeWidth={3} aria-hidden="true" />
            </span>
            New qualified lead
          </span>
          <span className="flex items-center gap-2.5 text-sm text-ink-foreground">
            <span className="ah-cal flex size-8 shrink-0 items-center justify-center rounded-lg">
              <CalendarCheck className="size-4" aria-hidden="true" />
            </span>
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
          <span className="text-brand">{"Your business isn\u2019t."}</span>
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
    durationMs: 6400,
    render: (a) => <Outcome active={a} />,
  },
]
