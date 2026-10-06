import { ArrowRight, CalendarClock, CheckCheck, PhoneCall } from "lucide-react"
import type { StoryControlsContent, TreatmentStoryContent } from "@/content/schema"
import type { Scene } from "@/components/sections/after-hours/scenes"
import { Bubble, CheckDot, Chip, Initials, Panel, StageFrame, StageHeader, buildScenes, delay, enter } from "./story-ui"

export function buildTreatmentScenes(story: TreatmentStoryContent, controls: StoryControlsContent): Scene[] {
  const ui = story.ui

  return buildScenes(story.scenes, [
    {
      id: "treatment-scheduled",
      tone: "ah-tone-ocean",
      durationMs: 5200,
      visual: (active) => (
        <StageFrame>
          <StageHeader title={ui.queueTitle} aside={<CalendarClock className="size-3.5" />} />
          <div className="flex flex-col gap-2">
            {ui.queue.map((row, i) => (
              <Panel
                key={row.name}
                className={
                  "flex items-center gap-2.5 p-2.5 " +
                  enter(active) +
                  (i === 0 ? " border-scene/50 ring-1 ring-scene/25" : " opacity-80")
                }
                style={delay(200 + i * 220)}
              >
                <Initials name={row.name} />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-xs font-semibold">{row.name}</span>
                  <span className="truncate text-[11px] text-muted-foreground">{row.when}</span>
                </div>
                {i === 0 && <Chip tone="auto">{ui.statusScheduled}</Chip>}
              </Panel>
            ))}
          </div>
          <p className="mt-auto truncate text-[11px] text-muted-foreground">{ui.checkinType}</p>
        </StageFrame>
      ),
    },
    {
      id: "treatment-delivered",
      tone: "ah-tone-dusk",
      durationMs: 5000,
      visual: (active) => (
        <StageFrame className="justify-center">
          <StageHeader title={ui.smsFrom} />
          <div className="flex flex-col gap-2">
            <Bubble side="out" className={enter(active)} style={delay(250)}>
              {ui.outgoing}
            </Bubble>
            <span
              className={"flex items-center gap-1 self-end text-[11px] text-muted-foreground " + enter(active)}
              style={delay(900)}
            >
              <CheckCheck className="size-3.5 text-approve" />
              {ui.delivered}
            </span>
          </div>
        </StageFrame>
      ),
    },
    {
      id: "treatment-reply",
      tone: "ah-tone-call",
      durationMs: 5400,
      visual: (active) => (
        <StageFrame className="justify-center">
          <div className="flex flex-col gap-2">
            <Bubble side="out" className="line-clamp-2 opacity-60">
              {ui.outgoing}
            </Bubble>
            <Bubble side="in" className={enter(active)} style={delay(300)}>
              {ui.reply}
              <span className="mt-1 block text-[10px] text-muted-foreground">{ui.replyTime}</span>
            </Bubble>
            <Chip tone="handoff" className={"self-start " + enter(active)} style={delay(1100)}>
              {ui.flag}
            </Chip>
          </div>
        </StageFrame>
      ),
    },
    {
      id: "treatment-alert",
      tone: "ah-tone-magic",
      durationMs: 5600,
      visual: (active) => (
        <StageFrame className="justify-center">
          <Panel className={"flex flex-col gap-2.5 p-3 " + enter(active)} style={delay(150)}>
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-xs font-semibold">{ui.alertTitle}</span>
              <Chip tone="handoff">{controls.staffActionNeeded}</Chip>
            </div>
            <span className="truncate text-[11px] text-muted-foreground">{ui.alertClient}</span>
            <ul className="flex flex-col gap-1.5">
              {ui.alertDetails.map((line, i) => (
                <li
                  key={line}
                  className={"flex items-start gap-2 text-xs leading-snug " + enter(active)}
                  style={delay(450 + i * 200)}
                >
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-scene" />
                  {line}
                </li>
              ))}
            </ul>
            <div
              className={
                "flex items-center gap-2 rounded-lg bg-brand-tint px-2.5 py-2 text-xs font-medium " + enter(active)
              }
              style={delay(1200)}
            >
              <ArrowRight className="size-3.5 shrink-0 text-brand" />
              <span className="truncate">{ui.alertNext}</span>
            </div>
          </Panel>
        </StageFrame>
      ),
    },
    {
      id: "treatment-takeover",
      tone: "ah-tone-starlight",
      durationMs: 5600,
      visual: (active) => (
        <StageFrame className="justify-center">
          <Panel className={"flex flex-col gap-3 p-3 " + enter(active)} style={delay(150)}>
            <div className="flex items-center gap-2.5">
              <Initials name={ui.assignee} />
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-xs font-semibold">{ui.takeoverTitle}</span>
                <span className="truncate text-[11px] text-muted-foreground">{ui.assignee}</span>
              </div>
              <PhoneCall className="ml-auto size-4 shrink-0 text-scene" />
            </div>
            <ul className="flex flex-col gap-2">
              {ui.takeoverLines.map((line, i) => (
                <li
                  key={line}
                  className={"flex items-center gap-2 text-xs " + enter(active)}
                  style={delay(500 + i * 350)}
                >
                  <CheckDot />
                  <span className="truncate">{line}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <p className={"text-center text-xs font-medium text-scene " + enter(active)} style={delay(1400)}>
            {ui.takeoverNote}
          </p>
        </StageFrame>
      ),
    },
  ])
}
