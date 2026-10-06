import type { CSSProperties, ReactNode } from "react"
import { CalendarCheckIcon, CheckIcon, DatabaseIcon, GlobeIcon, ChatIcon, PhoneIcon } from "@phosphor-icons/react/dist/ssr"
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

const CRITERIA = [
  { label: "Accident date", value: "Sep 24", at: 400 },
  { label: "Auto insurer", value: "On file", at: 1200 },
  { label: "Seeing a provider", value: "Yes", at: 2000 },
  { label: "Current attorney", value: "None", at: 2800 },
] as const

const WINDOW_COUNT = 20

function OfficeClosed({ active }: { active: boolean }) {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <span className={"ah-dusk absolute inset-0 " + (active ? "ah-dusk-fall" : "")} />
      <span className={"ah-sun-set absolute left-[22%] top-10 size-16 rounded-full " + (active ? "ah-setting" : "")} />
      <span className={"ah-moon absolute right-7 top-6 size-8 rounded-full " + (active ? "ah-moonrise" : "")} />
      <div className={"ah-stars absolute inset-0 " + (active ? "ah-stars-in" : "")}>
        {["left-8 top-10", "left-1/3 top-6", "right-1/3 top-16", "left-1/4 top-20"].map((pos, i) => (
          <span
            key={pos}
            className={"ah-twinkle absolute size-1 rounded-full bg-scene " + pos}
            style={{ animationDelay: `${i * 600}ms` }}
          />
        ))}
      </div>
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

const INQUIRIES = [
  { icon: PhoneIcon, channel: "Call", time: "7:42 PM", note: "Rear-end collision last week", at: 300 },
  { icon: GlobeIcon, channel: "Web form", time: "9:15 PM", note: "PIP claim for physical therapy", at: 1100 },
  { icon: ChatIcon, channel: "Text", time: "10:58 PM", note: "Question about PIP coverage", at: 1900 },
  { icon: PhoneIcon, channel: "Call", time: "6:47 AM", note: "Spanish-speaking caller", at: 2700 },
] as const

function InquiriesArrive({ active }: { active: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col gap-2.5 p-3.5" aria-hidden="true">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground">After-hours inbox</span>
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <span className={"size-1.5 rounded-full bg-scene " + (active ? "ah-twinkle" : "")} />
          Receiving
        </span>
      </div>
      <ul className="flex flex-1 flex-col justify-center gap-2">
        {INQUIRIES.map((item) => {
          const Icon = item.icon
          return (
            <li
              key={item.time}
              className={
                "flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2 shadow-sm " +
                enter(active)
              }
              style={delay(item.at)}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-scene/10 text-scene">
                <Icon weight="fill" className="size-3.5" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-xs font-semibold text-foreground">{item.channel}</span>
                <span className="truncate text-xs text-muted-foreground">{item.note}</span>
              </span>
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{item.time}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function StellaraScreens({ active }: { active: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col gap-2 p-3" aria-hidden="true">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground">Stellara</span>
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
          Screening
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-center gap-2">
        <div className="flex flex-col rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
            <span className="text-xs font-semibold text-foreground">Inquiry 2 of 4</span>
            <span className="text-xs text-muted-foreground">{"Web form \u00B7 9:15 PM"}</span>
          </div>
          <div className="relative py-1">
            <span
              className={"absolute left-2 top-1 z-10 flex size-7 items-center justify-center " + (active ? "ah-scan" : "")}
            >
              <span
                className={"absolute inset-0 rounded-full border border-brand/60 " + (active ? "ah-pulse-ring" : "opacity-0")}
              />
              <span
                className={"absolute inset-0 rounded-full border border-brand " + (active ? "ah-done" : "opacity-0")}
                style={delay(3400)}
              />
              <span className="absolute inset-1 rounded-full bg-brand-tint" />
              <StellaraSymbol className={"relative h-3.5 text-brand " + (active ? "ah-alive" : "")} />
            </span>
            <ul className="flex flex-col">
              {CRITERIA.map((row) => (
                <li key={row.label} className="relative flex h-7 items-center gap-2 pl-11 pr-3 text-xs">
                  <span
                    className={"absolute inset-y-0.5 left-1 right-1 rounded-lg bg-brand-tint " + (active ? "ah-inspect" : "opacity-0")}
                    style={delay(row.at)}
                  />
                  <span className="relative flex-1 text-muted-foreground">{row.label}</span>
                  <span
                    className={"relative font-medium tabular-nums text-foreground " + enter(active)}
                    style={delay(row.at + 600)}
                  >
                    {row.value}
                  </span>
                  <span className="relative flex size-4 shrink-0 items-center justify-center">
                    <span className="absolute inset-0 rounded-full border border-dashed border-border" />
                    <span
                      className={"absolute inset-0 " + (active ? "ah-blip" : "opacity-0")}
                      style={delay(row.at)}
                    >
                      <span className="ah-spin absolute inset-0 rounded-full border-2 border-brand border-t-transparent" />
                    </span>
                    <span
                      className={"relative flex size-4 items-center justify-center rounded-full bg-approve text-background " + enter(active)}
                      style={delay(row.at + 600)}
                    >
                      <CheckIcon weight="fill" className="size-2.5" />
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <span
          className={
            "flex items-center gap-2 self-start rounded-full border border-approve/30 bg-approve-tint px-2.5 py-1 text-xs font-medium text-approve shadow-sm " +
            enter(active)
          }
          style={delay(3800)}
        >
          <span className="flex size-4 items-center justify-center rounded-full bg-approve text-background">
            <CheckIcon weight="fill" className="size-3" />
          </span>
          Meets your PIP intake criteria
        </span>
      </div>
    </div>
  )
}

const BRIEF = [
  { value: "4", label: "Inquiries screened", at: 500 },
  { value: "3", label: "PIP matters qualified", at: 800 },
  { value: "2", label: "Consultations booked", at: 1100 },
] as const

function MorningBrief({ active }: { active: boolean }) {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      {[
        { size: "size-[26rem]", orbit: "28s" },
        { size: "size-[17rem]", orbit: "20s" },
      ].map((ring) => (
        <div
          key={ring.size}
          className={"absolute left-1/2 top-[82%] -translate-x-1/2 -translate-y-1/2 " + ring.size}
        >
          <div
            className="ah-orbit absolute inset-0 rounded-full border border-border"
            style={{ "--ah-orbit": ring.orbit } as CSSProperties}
          >
            <span className="absolute left-1/2 top-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand" />
          </div>
        </div>
      ))}
      <div className="absolute inset-x-0 top-[82%] flex justify-center">
        <span className={"ah-sun size-28 rounded-full " + (active ? "ah-rise" : "-translate-y-1/2")} />
      </div>
      <span className="ah-horizon absolute inset-x-6 top-[82%] h-px" />

      <div className="absolute inset-x-0 top-0 flex justify-center p-4">
        <div
          className={
            "flex w-full max-w-64 flex-col rounded-xl border border-border bg-card shadow-sm " + enter(active)
          }
          style={delay(250)}
        >
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <span className="text-xs font-semibold text-foreground">Overnight intake</span>
            <span className="text-xs tabular-nums text-muted-foreground">8:00 AM</span>
          </div>
          <ul className="flex flex-col gap-1.5 px-3 py-2.5">
            {BRIEF.map((row) => (
              <li
                key={row.label}
                className={"flex items-center gap-2.5 text-xs " + enter(active)}
                style={delay(row.at)}
              >
                <span className="w-4 text-right font-display text-sm font-medium tabular-nums text-brand">
                  {row.value}
                </span>
                <span className="text-foreground">{row.label}</span>
              </li>
            ))}
          </ul>
          <div
            className={
              "flex items-center gap-3 border-t border-border px-3 py-2 text-xs text-muted-foreground " +
              enter(active)
            }
            style={delay(1500)}
          >
            <span className="flex items-center gap-1.5">
              <CalendarCheckIcon weight="fill" className="size-3.5 text-scene" />
              On your calendar
            </span>
            <span className="flex items-center gap-1.5">
              <DatabaseIcon weight="fill" className="size-3.5 text-scene" />
              Logged in CRM
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export const SCENES: Scene[] = [
  {
    id: "closed",
    tone: "ah-tone-dusk",
    time: "6:00 PM",
    step: "Closed",
    title: "Office closes",
    headline: "The office goes dark at six.",
    body: "Your attorneys and intake team head home.",
    summary: "The firm closes for the evening and the attorneys and intake team head home.",
    durationMs: 3400,
    visual: (a) => <OfficeClosed active={a} />,
  },
  {
    id: "inquiries",
    tone: "ah-tone-call",
    time: "Overnight",
    step: "Inquiries",
    title: "Inquiries arrive",
    headline: "Inquiries keep arriving.",
    body: "Calls, web forms and texts, through the evening and into the morning.",
    summary:
      "Through the night, four inquiries arrive by phone, web form and text, including a PIP therapy claim and a Spanish-speaking caller.",
    durationMs: 5000,
    visual: (a) => <InquiriesArrive active={a} />,
  },
  {
    id: "screening",
    tone: "ah-tone-magic",
    time: "Overnight",
    step: "Screening",
    title: "Stellara screens",
    headline: (
      <>
        Stellara responds, qualifies <span className="text-brand">and books.</span>
      </>
    ),
    body: "The same intake questions, asked consistently, against your PIP criteria.",
    summary:
      "Stellara screens each inquiry against the firm's PIP intake criteria: accident date, auto insurer, treatment status and current representation.",
    durationMs: 6000,
    visual: (a) => <StellaraScreens active={a} />,
  },
  {
    id: "brief",
    tone: "ah-tone-starlight",
    time: "8:00 AM",
    step: "Brief",
    title: "Morning brief",
    headline: (
      <>
        Your office is closed. <span className="text-brand">{"Your intake isn\u2019t."}</span>
      </>
    ),
    body: "Qualified matters and booked consultations, waiting when you arrive.",
    summary:
      "By 8 AM, four inquiries are screened, three PIP matters qualified and two consultations booked, all logged in the CRM.",
    durationMs: 6400,
    visual: (a) => <MorningBrief active={a} />,
  },
]
