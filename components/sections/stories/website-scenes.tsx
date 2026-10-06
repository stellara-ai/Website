import { ArrowRightIcon, GlobeIcon, LockIcon, ChatCircleIcon } from "@phosphor-icons/react/dist/ssr"
import type { StoryControlsContent, WebsiteStoryContent } from "@/content/schema"
import type { Scene } from "@/components/sections/after-hours/scenes"
import { StellaraSymbol } from "@/components/brand/stellara-logo"
import { Bubble, CheckDot, Chip, Panel, StageFrame, StageHeader, buildScenes, delay, enter } from "./story-ui"

function BrowserBar({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-border px-2.5 py-1.5">
      <span className="flex gap-1" aria-hidden="true">
        <span className="size-1.5 rounded-full bg-border" />
        <span className="size-1.5 rounded-full bg-border" />
        <span className="size-1.5 rounded-full bg-border" />
      </span>
      <span className="flex min-w-0 flex-1 items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
        <LockIcon weight="fill" className="size-2.5 shrink-0" />
        <span className="truncate">{url}</span>
      </span>
    </div>
  )
}

function ChatHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground">
        <StellaraSymbol className="size-3.5" />
      </span>
      <span className="truncate text-xs font-semibold">{title}</span>
    </div>
  )
}

export function buildWebsiteScenes(story: WebsiteStoryContent, controls: StoryControlsContent): Scene[] {
  const ui = story.ui

  return buildScenes(story.scenes, [
    {
      id: "website-visitor",
      tone: "ah-tone-sky",
      durationMs: 5000,
      visual: (active) => (
        <StageFrame className="justify-center">
          <Panel className={"overflow-hidden " + enter(active)} style={delay(120)}>
            <BrowserBar url={ui.url} />
            <div className="flex flex-col gap-1.5 p-3">
              <span className="text-sm font-semibold leading-tight">{ui.siteHeadline}</span>
              <span className="text-[11px] leading-relaxed text-muted-foreground">{ui.siteBody}</span>
              <span className="mt-1 self-start rounded-full bg-foreground px-2.5 py-1 text-[11px] font-medium text-background">
                {ui.siteCta}
              </span>
            </div>
          </Panel>
          <div className="flex items-center justify-between gap-2">
            <Chip tone="auto" className={enter(active)} style={delay(700)}>
              <GlobeIcon weight="fill" className="mr-0.5 inline size-3" />
              {ui.visitor}
            </Chip>
            <span
              className={
                "flex shrink-0 items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-[11px] font-medium text-brand-foreground shadow-sm " +
                (active ? "ah-reveal ah-float" : "")
              }
              style={delay(1200)}
            >
              <ChatCircleIcon weight="fill" className="size-3" />
              <span className="hidden sm:inline">{ui.chatPrompt}</span>
            </span>
          </div>
        </StageFrame>
      ),
    },
    {
      id: "website-question",
      tone: "ah-tone-dusk",
      durationMs: 6000,
      visual: (active) => (
        <StageFrame className="justify-center">
          <ChatHeader title={ui.chatTitle} />
          <div className="flex flex-col gap-2">
            <Bubble side="in" className={"self-end rounded-br-md rounded-bl-2xl " + enter(active)} style={delay(200)}>
              {ui.question}
            </Bubble>
            <Bubble
              side="out"
              className={"self-start rounded-bl-md rounded-br-2xl " + enter(active)}
              style={delay(900)}
            >
              {ui.answer}
            </Bubble>
            <span className={"text-[10px] text-muted-foreground " + enter(active)} style={delay(1400)}>
              {ui.infoNote}
            </span>
          </div>
        </StageFrame>
      ),
    },
    {
      id: "website-details",
      tone: "ah-tone-magic",
      durationMs: 5400,
      visual: (active) => (
        <StageFrame className="justify-center">
          <Panel className="flex flex-col gap-2 p-3">
            <StageHeader title={ui.detailsTitle} />
            <ul className="flex flex-col gap-1.5">
              {ui.details.map((field, i) => (
                <li
                  key={field.label}
                  className={"flex items-center gap-2 text-xs " + enter(active)}
                  style={delay(250 + i * 300)}
                >
                  <CheckDot />
                  <span className="min-w-0 flex-1 truncate text-muted-foreground">{field.label}</span>
                  <span className="shrink-0 font-medium tabular-nums">{field.value}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </StageFrame>
      ),
    },
    {
      id: "website-consult",
      tone: "ah-tone-meadow",
      durationMs: 5400,
      visual: (active) => (
        <StageFrame className="justify-center">
          <StageHeader title={ui.consultTitle} />
          <div className="flex flex-col gap-1.5">
            {ui.slots.map((slot, i) => (
              <span
                key={slot}
                className={
                  "rounded-lg border px-3 py-2 text-xs font-medium tabular-nums " +
                  (i === 1 ? "border-brand bg-brand-tint text-foreground" : "border-border bg-card text-muted-foreground") +
                  " " +
                  enter(active)
                }
                style={delay(200 + i * 150)}
              >
                {slot}
              </span>
            ))}
          </div>
          <span
            className={"flex items-center gap-2 text-xs font-medium " + enter(active)}
            style={delay(1100)}
          >
            <CheckDot />
            <span className="truncate">{ui.consultSent}</span>
          </span>
        </StageFrame>
      ),
    },
    {
      id: "website-summary",
      tone: "ah-tone-starlight",
      durationMs: 5800,
      visual: (active) => (
        <StageFrame className="justify-center">
          <Panel className={"flex flex-col gap-2.5 p-3 " + enter(active)} style={delay(150)}>
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-xs font-semibold">{ui.summaryTitle}</span>
              <Chip tone="handoff">{controls.staffActionNeeded}</Chip>
            </div>
            <ul className="flex flex-col gap-1.5">
              {ui.summaryLines.map((line, i) => (
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
              style={delay(1150)}
            >
              <ArrowRightIcon weight="fill" className="size-3.5 shrink-0 text-brand" />
              <span className="truncate">{ui.summaryNext}</span>
            </div>
          </Panel>
        </StageFrame>
      ),
    },
  ])
}
