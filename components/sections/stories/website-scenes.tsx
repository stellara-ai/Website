import { ArrowRightIcon, CalendarBlankIcon, ChatCircleTextIcon } from "@phosphor-icons/react/dist/ssr"
import { StellaraSymbol } from "@/components/brand/stellara-logo"
import type { WebsiteStoryContent } from "@/content/schema"
import type { Scene } from "@/components/sections/after-hours/scenes"
import { cn } from "@/lib/utils"
import { Bubble, CheckDot, Chip, buildScenes, delay, enter } from "./story-ui"
import { Browser, Cursor, Monitor, ROLE_BUBBLE, RoleTag, Skeleton, Stage, Workstation, motionVars, play } from "./illustration"

type Ui = WebsiteStoryContent["ui"]
type SceneProps = { ui: Ui; active: boolean }

const CTA_CURSOR_DELAY = 700
// The cursor animation runs 1.2s and "clicks" at ~88% of it, so the press lands then.
const CTA_PRESS_DELAY = CTA_CURSOR_DELAY + 1050

function SitePage({ ui, dim, active, pointer }: { ui: Ui; dim?: boolean; active?: boolean; pointer?: boolean }) {
  return (
    <div className={cn("flex h-full min-h-0 flex-col gap-1 p-2 transition-opacity min-[360px]:gap-1.5 min-[360px]:p-2.5", dim && "opacity-35")}>
      <div className="flex shrink-0 items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5 text-[11px] font-semibold">
          <span className="size-2.5 shrink-0 rounded-sm bg-brand" />
          <span className="truncate">{ui.siteName}</span>
        </span>
        <span className="flex gap-1">
          <Skeleton className="w-5" />
          <Skeleton className="w-5" />
        </span>
      </div>
      <span className="mt-1 shrink-0 truncate text-sm font-semibold leading-tight">{ui.siteHeadline}</span>
      <span
        className={cn(
          "relative mt-0.5 shrink-0 self-start whitespace-nowrap rounded-full bg-foreground px-2.5 py-1 text-[10px] font-medium leading-tight text-background",
          pointer && play(Boolean(active), "st-press"),
        )}
        style={pointer ? delay(CTA_PRESS_DELAY) : undefined}
      >
        {ui.siteCta}
        {pointer && (
          <Cursor
            className={"-bottom-3 right-1 " + play(Boolean(active), "st-cursor")}
            style={motionVars({ delay: CTA_CURSOR_DELAY, dx: "60px", dy: "48px" })}
          />
        )}
      </span>
      <Skeleton className="mt-1 w-[85%] shrink-0" />
      <Skeleton className="w-[60%] shrink-0" />
      <div className="mt-auto grid min-h-0 shrink grid-cols-3 gap-1.5 overflow-hidden">
        <span className="h-8 rounded-md bg-muted" />
        <span className="h-8 rounded-md bg-muted" />
        <span className="h-8 rounded-md bg-muted" />
      </div>
    </div>
  )
}

function VisitorArrives({ ui, active }: SceneProps) {
  return (
    <Stage>
      <Browser url={ui.url} className={"min-h-0 flex-1 " + play(active, "st-slide")} style={delay(100)}>
        <SitePage ui={ui} active={active} pointer />
      </Browser>
      <div className="flex items-end gap-2">
        <Workstation role="prospect" device="laptop" className={"h-10 min-[360px]:h-14 sm:h-20 " + enter(active)} style={delay(300)} />
        <RoleTag role="prospect" className="mb-1">
          {ui.visitorTag}
        </RoleTag>
      </div>
    </Stage>
  )
}

function AsksQuestion({ ui, active }: SceneProps) {
  return (
    <Stage>
      <Browser url={ui.url} className="min-h-0 flex-1">
        <SitePage ui={ui} dim />
        <span
          className={
            "absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-[11px] font-medium text-background shadow-md " +
            play(active, "st-press")
          }
          style={delay(350)}
        >
          <ChatCircleTextIcon weight="fill" className="size-3.5" />
          {ui.launcher}
          <Cursor
            className={"-bottom-2 right-3 " + play(active, "st-cursor")}
            style={motionVars({ delay: 0, dx: "-40px", dy: "-30px" })}
          />
        </span>
        <div
          className={
            "absolute inset-x-2 bottom-2 z-30 flex flex-col gap-1.5 rounded-xl border border-border bg-card p-2 shadow-lg sm:left-auto sm:w-[80%] " +
            play(active, "st-slide")
          }
          style={delay(650)}
        >
          <div className="hidden items-center gap-1.5 border-b border-border pb-1.5 sm:flex">
            <StellaraSymbol className="h-3.5 shrink-0" />
            <span className="truncate text-[11px] font-semibold">{ui.assistantTitle}</span>
          </div>
          <Bubble side="out" className={cn(ROLE_BUBBLE.prospect, enter(active))} style={delay(1100)}>
            {ui.question}
          </Bubble>
          <Bubble side="in" className={enter(active)} style={delay(1750)}>
            {ui.assistantReply}
          </Bubble>
        </div>
      </Browser>
    </Stage>
  )
}

function DetailsCollected({ ui, active }: SceneProps) {
  return (
    <Stage className="justify-center">
      <Bubble side="in" className={enter(active)} style={delay(100)}>
        {ui.detailsPrompt}
      </Bubble>
      <div className={"flex flex-col rounded-xl border border-border bg-card shadow-md " + enter(active)} style={delay(300)}>
        <div className="flex items-center gap-1.5 border-b border-border px-2.5 py-1.5">
          <span className="size-2 shrink-0 rounded-full bg-status-purple" />
          <span className="truncate text-[11px] font-semibold">{ui.formTitle}</span>
        </div>
        {ui.fields.map((field, i) => (
          <div key={field.label} className="flex items-center gap-2 border-b border-border/60 px-2.5 py-1.5 last:border-0">
            <span className="w-[34%] shrink-0 text-[10px] leading-tight text-muted-foreground">{field.label}</span>
            <span className={"min-w-0 flex-1 whitespace-nowrap text-[11px] font-medium sm:text-xs " + play(active, "st-type")} style={delay(700 + i * 420)}>
              {field.value}
            </span>
            <span className={enter(active)} style={delay(1150 + i * 420)}>
              <CheckDot />
            </span>
          </div>
        ))}
      </div>
    </Stage>
  )
}

function ConsultRequested({ ui, active }: SceneProps) {
  return (
    <Stage className="justify-center">
      <div className={"flex flex-col gap-2 rounded-xl border border-border bg-card p-2.5 shadow-md " + enter(active)} style={delay(100)}>
        <div className="flex items-center gap-2">
          <CalendarBlankIcon weight="fill" className="size-4 shrink-0 text-brand" />
          <span className="truncate text-xs font-semibold">{ui.callbackTitle}</span>
        </div>
        <span className="text-[11px] text-muted-foreground">{ui.callbackDay}</span>
        <div className="grid grid-cols-3 gap-1.5">
          {ui.slots.map((slot, i) => {
            const selected = i === ui.selectedSlot
            return (
              <span
                key={slot}
                className={cn(
                  "relative rounded-lg border border-border px-1 py-2 text-center text-[11px] font-medium tabular-nums",
                  selected && play(active, "st-press"),
                )}
                style={delay(1150)}
              >
                {slot}
                {selected && (
                  <>
                    <span
                      className={
                        "absolute inset-0 flex items-center justify-center rounded-lg bg-foreground text-background " +
                        play(active, "st-in")
                      }
                      style={delay(1200)}
                    >
                      {slot}
                    </span>
                    <Cursor
                      className={"-bottom-2.5 right-1 " + play(active, "st-cursor")}
                      style={motionVars({ delay: 300, dx: "40px", dy: "40px" })}
                    />
                  </>
                )}
              </span>
            )
          })}
        </div>
        <div className={"flex flex-wrap items-center gap-1.5 border-t border-border pt-2 " + enter(active)} style={delay(1700)}>
          <Chip tone="handoff">{ui.requested}</Chip>
          <span className="text-[11px] text-muted-foreground">{ui.requestedNote}</span>
        </div>
      </div>
      <RoleTag role="prospect" className="self-center">
        {ui.visitorTag}
      </RoleTag>
    </Stage>
  )
}

function TeamGetsContext({ ui, active }: SceneProps) {
  return (
    <Stage>
      <Monitor className={"min-h-0 flex-1 " + enter(active)} style={delay(100)}>
        <div className="flex h-full">
          <div className="hidden w-[34%] flex-col gap-1 border-r border-border bg-muted/50 p-1.5 sm:flex">
            <span className="truncate px-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {ui.inboxTitle}
            </span>
            {ui.inbox.map((name, i) => (
              <span
                key={name}
                className={cn(
                  "truncate rounded-md px-1.5 py-1 text-[10px]",
                  i === 0 ? "bg-card font-semibold shadow-sm" : "text-muted-foreground",
                )}
              >
                {name}
              </span>
            ))}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1 p-2">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-xs font-semibold">{ui.summaryTitle}</span>
              <Chip tone="auto">{ui.newLabel}</Chip>
            </div>
            {ui.summary.map((row, i) => (
              <div
                key={row.label}
                className={cn("flex-col rounded-md bg-muted/70 px-2 py-0.5", i > 1 ? "hidden sm:flex" : "flex", play(active, "st-slide"))}
                style={motionVars({ delay: 450 + i * 250, dx: "-14px", dy: "0px" })}
              >
                <span className="truncate text-[10px] text-muted-foreground">{row.label}</span>
                <span className="truncate text-[11px] font-medium">{row.value}</span>
              </div>
            ))}
            <div
              className={"mt-auto flex items-center gap-1.5 rounded-md bg-brand-tint px-2 py-1.5 " + enter(active)}
              style={delay(1400)}
            >
              <ArrowRightIcon weight="bold" className="size-3.5 shrink-0 text-brand" />
              <span className="leading-tight text-[11px] font-semibold">{ui.nextAction}</span>
            </div>
          </div>
        </div>
      </Monitor>
      <RoleTag role="staff" className="hidden self-center sm:inline-flex">
        {ui.staffTag}
      </RoleTag>
    </Stage>
  )
}

export function buildWebsiteScenes(story: WebsiteStoryContent): Scene[] {
  const ui = story.ui
  return buildScenes(story.scenes, [
    { id: "website-visit", tone: "ah-tone-dusk", durationMs: 5000, visual: (a) => <VisitorArrives ui={ui} active={a} /> },
    { id: "website-ask", tone: "ah-tone-dusk", durationMs: 5400, visual: (a) => <AsksQuestion ui={ui} active={a} /> },
    { id: "website-details", tone: "ah-tone-dusk", durationMs: 5600, visual: (a) => <DetailsCollected ui={ui} active={a} /> },
    { id: "website-callback", tone: "ah-tone-dusk", durationMs: 5200, visual: (a) => <ConsultRequested ui={ui} active={a} /> },
    { id: "website-summary", tone: "ah-tone-call", durationMs: 5600, visual: (a) => <TeamGetsContext ui={ui} active={a} /> },
  ])
}
