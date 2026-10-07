import { ArrowRightIcon, CheckIcon, PhoneCallIcon } from "@phosphor-icons/react/dist/ssr"
import type { TreatmentStoryContent } from "@/content/schema"
import { StellaraSymbol } from "@/components/brand/stellara-logo"
import type { Scene } from "@/components/sections/after-hours/scenes"
import { cn } from "@/lib/utils"
import { Bubble, Chip, buildScenes, delay, enter } from "./story-ui"
import { Figure, Phone, ROLE_BUBBLE, RoleTag, Stage, Workstation, leave, motionVars, play } from "./illustration"

type Ui = TreatmentStoryContent["ui"]
type SceneProps = { ui: Ui; active: boolean }

function Floor() {
  return <span className="absolute inset-x-3 bottom-3 h-px bg-foreground/10" />
}

function LifeInterrupts({ ui, active }: SceneProps) {
  return (
    <Stage>
      <RoleTag role="client" className={"self-start " + enter(active)} style={delay(100)}>
        {ui.clientTag} · {ui.clientName}
      </RoleTag>
      <div className="flex min-h-0 flex-1 items-end gap-3 pb-1">
        <Figure role="client" className={"h-24 sm:h-32 " + enter(active)} style={delay(200)} />
        <div
          className={
            "mb-3 flex min-w-0 flex-1 flex-col gap-1.5 self-center rounded-xl border border-border bg-card p-2 shadow-sm " +
            enter(active)
          }
          style={delay(320)}
        >
          <span className="truncate text-[11px] font-semibold">{ui.weekLabel}</span>
          <div className="grid grid-cols-3 gap-1">
            {ui.days.map((day, i) => (
              <div key={day} className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate text-center text-[10px] uppercase tracking-wide text-muted-foreground">{day}</span>
                <span className="text-center text-xs font-semibold tabular-nums">{ui.dates[i]}</span>
                <div className="h-16 rounded-md bg-muted/80 p-0.5 sm:h-24">
                  {i === 0 && (
                    <div className="relative flex flex-col gap-0.5 rounded bg-status-teal-tint p-1">
                      <span className="break-words text-[10px] font-semibold leading-tight">{ui.appointment}</span>
                      <span className="text-[10px] tabular-nums text-muted-foreground">{ui.appointmentTime}</span>
                      <span
                        className={"absolute inset-x-0.5 top-1/2 h-[1.5px] rounded-full bg-status-stuck " + play(active, "st-grow")}
                        style={delay(1000)}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <span
            className={
              "self-start rounded-full bg-status-stuck-tint px-2 py-0.5 text-[10px] font-semibold text-status-stuck " +
              enter(active)
            }
            style={delay(1400)}
          >
            {ui.missed} · {ui.days[0]}
          </span>
        </div>
      </div>
      <Floor />
    </Stage>
  )
}

function CheckinSent({ ui, active }: SceneProps) {
  return (
    <Stage className="items-center gap-1.5">
      <div
        className={
          "flex max-w-full items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 shadow-sm " +
          enter(active)
        }
        style={delay(100)}
      >
        <span className="relative flex size-6 shrink-0 items-center justify-center">
          <span className="ah-agent-halo absolute inset-0 rounded-full" />
          <StellaraSymbol className={"ah-agent relative h-3.5 " + (active ? "ah-alive" : "")} />
        </span>
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-[11px] font-semibold">{ui.checkinLabel}</span>
          <span className="truncate text-[10px] tabular-nums text-muted-foreground">{ui.checkinTime}</span>
        </span>
      </div>
      <svg viewBox="0 0 2 20" className="h-5 w-0.5 shrink-0 overflow-visible text-brand">
        <path
          d="M1 0v20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          pathLength={1}
          className={play(active, "st-draw")}
          style={delay(450)}
        />
      </svg>
      <Phone className={"min-h-0 w-[min(100%,11.5rem)] flex-1 " + play(active, "st-slide")} style={delay(650)}>
        <span className="truncate text-center text-[10px] font-semibold text-muted-foreground">{ui.firm}</span>
        <Bubble side="in" className={enter(active)} style={delay(1150)}>
          {ui.question}
        </Bubble>
      </Phone>
      <span
        className={"flex items-center gap-1 text-[11px] font-medium text-muted-foreground " + enter(active)}
        style={delay(1550)}
      >
        <CheckIcon weight="bold" className="size-3 text-approve" />
        {ui.autoSent}
      </span>
    </Stage>
  )
}

function ClientReplies({ ui, active }: SceneProps) {
  return (
    <Stage className="flex-row items-end justify-center gap-3 pb-4">
      <Figure role="client" pose="phone" className={"h-24 sm:h-32 " + enter(active)} style={delay(100)} />
      <Phone className="h-full max-h-64 w-[min(64%,11.5rem)] -rotate-2">
        <span className="truncate text-center text-[10px] font-semibold text-muted-foreground">{ui.firm}</span>
        <Bubble side="in" className="line-clamp-3 opacity-50">
          {ui.question}
        </Bubble>
        <Bubble side="out" className={cn(ROLE_BUBBLE.client, play(active, "st-focus"))} style={delay(450)}>
          {ui.reply}
          <span className="mt-0.5 block text-[10px] tabular-nums text-muted-foreground">{ui.replyTime}</span>
        </Bubble>
      </Phone>
      <Floor />
    </Stage>
  )
}

function TeamAlerted({ ui, active }: SceneProps) {
  return (
    <Stage className="flex-row items-end gap-2 pb-4 sm:gap-3">
      <div className={"flex shrink-0 flex-col items-start gap-1 " + enter(active)} style={delay(100)}>
        <RoleTag role="staff" className="hidden sm:inline-flex">
          {ui.staffTag}
        </RoleTag>
        <Workstation role="staff" className="h-12 sm:h-24" />
      </div>
      <div
        className={
          "relative mb-2 flex min-w-0 flex-1 flex-col gap-1.5 self-center rounded-xl border border-border bg-card p-2 shadow-md sm:p-2.5 " +
          play(active, "st-slide")
        }
        style={motionVars({ delay: 350, dx: "16px", dy: "-6px" })}
      >
        <span className="absolute -left-1 top-3 size-2 rounded-full bg-status-stuck ring-2 ring-card" aria-hidden="true" />
        <div className="flex min-w-0 items-center justify-between gap-2">
          <span className="truncate text-xs font-semibold">{ui.clientName}</span>
          <span className="hidden shrink-0 sm:inline-flex">
            <Chip tone="handoff">{ui.alertTitle}</Chip>
          </span>
        </div>
        <p
          className={cn("line-clamp-3 rounded-lg sm:line-clamp-2 px-2 py-1 text-[11px] leading-snug", ROLE_BUBBLE.client, enter(active))}
          style={delay(650)}
        >
          {"\u201C"}
          {ui.reply}
          {"\u201D"}
        </p>
        <span
          className={"hidden items-center gap-2 text-[11px] text-muted-foreground sm:flex " + enter(active)}
          style={delay(900)}
        >
          <span className="size-1 shrink-0 rounded-full bg-foreground/40" />
          <span className="truncate">{ui.alertContext[0]}</span>
        </span>
        <span
          className={"flex min-w-0 items-center gap-1.5 rounded-lg bg-brand-tint px-2 py-1 text-[11px] font-semibold " + enter(active)}
          style={delay(1200)}
        >
          <ArrowRightIcon weight="bold" className="size-3 shrink-0 text-brand" />
          <span className="min-w-0 leading-tight sm:truncate">{ui.nextAction}</span>
        </span>
      </div>
      <Floor />
    </Stage>
  )
}

function StaffFollowsUp({ ui, active }: SceneProps) {
  return (
    <Stage className="gap-3">
      <div className="relative flex min-h-0 flex-1 items-end justify-between gap-2">
        <svg
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
          className="absolute left-[22%] top-[22%] h-[34%] w-[56%] overflow-visible text-brand"
        >
          <path
            d="M2 38C25 0 75 0 98 38"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            pathLength={1}
            className={play(active, "st-draw")}
            style={delay(500)}
          />
        </svg>
        <span
          className={
            "absolute left-1/2 top-[12%] flex size-8 -translate-x-1/2 items-center justify-center rounded-full border border-brand/40 bg-card text-brand shadow-sm " +
            enter(active)
          }
          style={delay(1000)}
        >
          <PhoneCallIcon weight="fill" className="size-4" />
        </span>
        <div className="flex flex-col items-start gap-1">
          <RoleTag role="staff">{ui.staffTag}</RoleTag>
          <Workstation role="staff" pose="call" className={"h-20 sm:h-28 " + enter(active)} style={delay(150)} />
        </div>
        <div className="flex flex-col items-end gap-1">
          <RoleTag role="client">{ui.clientTag}</RoleTag>
          <Figure role="client" pose="phone" className={"h-20 sm:h-28 " + enter(active)} style={delay(300)} />
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card px-2.5 py-2 shadow-sm">
        <span className="shrink-0 text-[11px] text-muted-foreground">{ui.statusLabel}</span>
        <span className="grid min-w-0 justify-items-end">
          <span className={"col-start-1 row-start-1 min-w-0 " + leave(active)} style={delay(1500)}>
            <Chip tone="handoff">{ui.nextAction}</Chip>
          </span>
          <span className={"col-start-1 row-start-1 min-w-0 " + play(active, "st-in")} style={delay(1800)}>
            <Chip tone="auto">{ui.statusDone}</Chip>
          </span>
        </span>
      </div>
    </Stage>
  )
}

export function buildTreatmentScenes(story: TreatmentStoryContent): Scene[] {
  const ui = story.ui
  return buildScenes(story.scenes, [
    { id: "treatment-missed", tone: "ah-tone-sky", durationMs: 5200, visual: (a) => <LifeInterrupts ui={ui} active={a} /> },
    { id: "treatment-checkin", tone: "ah-tone-sky", durationMs: 5000, visual: (a) => <CheckinSent ui={ui} active={a} /> },
    { id: "treatment-reply", tone: "ah-tone-sky", durationMs: 5000, visual: (a) => <ClientReplies ui={ui} active={a} /> },
    { id: "treatment-alert", tone: "ah-tone-call", durationMs: 5600, visual: (a) => <TeamAlerted ui={ui} active={a} /> },
    { id: "treatment-followup", tone: "ah-tone-call", durationMs: 5600, visual: (a) => <StaffFollowsUp ui={ui} active={a} /> },
  ])
}
