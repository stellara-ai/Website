import { BellRing, CheckCheck, ExternalLink, Flag, MessageSquareText } from "lucide-react"
import type { ReviewsStoryContent } from "@/content/schema"
import type { Scene } from "@/components/sections/after-hours/scenes"
import { Bubble, CheckDot, Chip, Panel, StageFrame, StageHeader, buildScenes, delay, enter } from "./story-ui"

export function buildReviewsScenes(story: ReviewsStoryContent): Scene[] {
  const ui = story.ui

  return buildScenes(story.scenes, [
    {
      id: "reviews-milestone",
      tone: "ah-tone-meadow",
      durationMs: 5400,
      visual: (active) => (
        <StageFrame className="justify-center">
          <Panel className={"flex flex-col gap-2 p-3 " + enter(active)} style={delay(150)}>
            <StageHeader title={ui.ruleTitle} aside={<Flag className="size-3.5" />} />
            <div className="flex flex-col gap-1.5 rounded-lg bg-muted/70 p-2.5 text-xs">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {ui.ruleWhen}
              </span>
              <span className="font-medium">{ui.ruleTrigger}</span>
              <span className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {ui.ruleThen}
              </span>
              <span className="font-medium">{ui.ruleAction}</span>
            </div>
            <span className="text-[11px] text-muted-foreground">{ui.ruleNote}</span>
          </Panel>
          <Chip tone="auto" className={"self-center " + enter(active)} style={delay(1000)}>
            {ui.milestoneEvent}
          </Chip>
        </StageFrame>
      ),
    },
    {
      id: "reviews-request",
      tone: "ah-tone-dusk",
      durationMs: 5200,
      visual: (active) => (
        <StageFrame className="justify-center">
          <StageHeader title={ui.smsFrom} aside={<MessageSquareText className="size-3.5" />} />
          <div className="flex flex-col gap-2">
            <Bubble side="out" className={enter(active)} style={delay(250)}>
              {ui.request}
            </Bubble>
            <span
              className={"flex items-center gap-1 self-end text-[11px] text-muted-foreground " + enter(active)}
              style={delay(950)}
            >
              <CheckCheck className="size-3.5 text-approve" />
              {ui.delivered}
            </span>
          </div>
        </StageFrame>
      ),
    },
    {
      id: "reviews-link",
      tone: "ah-tone-sky",
      durationMs: 5000,
      visual: (active) => (
        <StageFrame className="items-center justify-center">
          <Panel
            className={"flex w-full max-w-60 flex-col items-center gap-2.5 p-4 text-center " + enter(active)}
            style={delay(150)}
          >
            <span className="text-sm font-semibold">{ui.linkTitle}</span>
            <span className="text-[11px] leading-relaxed text-muted-foreground">{ui.linkBody}</span>
            <span
              className={
                "flex items-center gap-1.5 rounded-full bg-brand px-3.5 py-1.5 text-xs font-semibold text-brand-foreground " +
                enter(active)
              }
              style={delay(700)}
            >
              {ui.linkCta}
              <ExternalLink className="size-3" />
            </span>
            <span className="text-[11px] text-muted-foreground underline underline-offset-2">{ui.linkContact}</span>
          </Panel>
        </StageFrame>
      ),
    },
    {
      id: "reviews-reminder",
      tone: "ah-tone-call",
      durationMs: 5400,
      visual: (active) => (
        <StageFrame className="justify-center">
          <StageHeader
            title={ui.reminderTitle}
            aside={
              <>
                <BellRing className="size-3.5" />
                {ui.reminderWhen}
              </>
            }
          />
          <Bubble side="out" className={enter(active)} style={delay(250)}>
            {ui.reminder}
          </Bubble>
          <ul className="flex flex-col gap-1.5">
            {ui.reminderRules.map((rule, i) => (
              <li
                key={rule}
                className={"flex items-center gap-2 text-xs " + enter(active)}
                style={delay(900 + i * 300)}
              >
                <CheckDot />
                <span className="truncate">{rule}</span>
              </li>
            ))}
          </ul>
        </StageFrame>
      ),
    },
    {
      id: "reviews-activity",
      tone: "ah-tone-starlight",
      durationMs: 5600,
      visual: (active) => (
        <StageFrame>
          <StageHeader title={ui.activityTitle} />
          <Panel className="flex flex-col divide-y divide-border">
            {ui.activity.map((row, i) => (
              <div
                key={row.name}
                className={"flex items-center justify-between gap-2 px-2.5 py-2 " + enter(active)}
                style={delay(200 + i * 200)}
              >
                <span className="truncate text-xs font-medium">{row.name}</span>
                <Chip tone={row.tone}>{row.status}</Chip>
              </div>
            ))}
          </Panel>
        </StageFrame>
      ),
    },
  ])
}
