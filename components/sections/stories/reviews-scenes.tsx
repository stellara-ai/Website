import { ArrowBendDownRightIcon, BellSimpleIcon, CheckIcon, LinkSimpleIcon, MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr"
import type { ReviewsStoryContent } from "@/content/schema"
import type { Scene } from "@/components/sections/after-hours/scenes"
import { cn } from "@/lib/utils"
import { CheckDot, Chip, buildScenes, delay, enter } from "./story-ui"
import {
  Cursor,
  FictionLabel,
  Figure,
  Phone,
  RoleTag,
  Skeleton,
  Stage,
  Workstation,
  leave,
  motionVars,
  play,
} from "./illustration"

type Ui = ReviewsStoryContent["ui"]
type SceneProps = { ui: Ui; active: boolean }

function MilestoneReached({ ui, active }: SceneProps) {
  const lastIndex = ui.milestones.length - 1
  return (
    <Stage>
      <div className={"flex flex-col gap-2 rounded-xl border border-border bg-card p-2.5 shadow-md " + enter(active)} style={delay(100)}>
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-xs font-semibold">{ui.matterName}</span>
          <span className="shrink-0 text-[10px] text-muted-foreground">{ui.matterType}</span>
        </div>
        <ul className="flex flex-col gap-1.5">
          {ui.milestones.map((milestone, i) => {
            const last = i === lastIndex
            return (
              <li key={milestone} className="flex items-center gap-2 text-[11px]">
                <span className="relative flex size-4 shrink-0">
                  <span className="absolute inset-0 rounded-full border-[1.5px] border-foreground/25" />
                  <span className={cn("absolute inset-0", last && enter(active))} style={last ? delay(800) : undefined}>
                    <CheckDot />
                  </span>
                </span>
                <span className={cn("truncate", last ? "font-semibold" : "text-muted-foreground")}>{milestone}</span>
              </li>
            )
          })}
        </ul>
        <div
          className={"flex items-center gap-1.5 rounded-lg bg-brand-tint px-2 py-1.5 text-[11px] font-medium " + enter(active)}
          style={delay(1300)}
        >
          <ArrowBendDownRightIcon weight="bold" className="size-3.5 shrink-0 text-brand" />
          <span className="leading-tight">{ui.ruleMatched}</span>
        </div>
      </div>
      <div className="mt-auto hidden items-end justify-end gap-2 sm:flex">
        <RoleTag role="staff" className="mb-1">
          {ui.staffTag}
        </RoleTag>
        <Workstation role="staff" className="h-14 -scale-x-100 sm:h-20" />
      </div>
    </Stage>
  )
}

function InvitationArrives({ ui, active }: SceneProps) {
  return (
    <Stage className="flex-row items-end justify-center gap-3 pb-4">
      <div className="hidden flex-col items-start justify-between gap-2 self-stretch sm:flex">
        <RoleTag role="client">{ui.clientTag}</RoleTag>
        <Figure role="client" pose="phone" className="h-24 sm:h-32" />
      </div>
      <Phone className="h-full w-[min(88%,12rem)] sm:w-[min(60%,11.5rem)]">
        <span className="mt-1 hidden text-center font-display text-xl font-medium tabular-nums sm:block sm:text-2xl">{ui.lockTime}</span>
        <div
          className={"flex flex-col gap-1 rounded-xl border border-border bg-muted/80 p-2 shadow-sm " + play(active, "st-slide")}
          style={motionVars({ delay: 400, dy: "-14px" })}
        >
          <div className="flex items-center justify-between gap-1 text-[10px]">
            <span className="truncate font-semibold">{ui.firm}</span>
            <span className="shrink-0 text-muted-foreground">{ui.now}</span>
          </div>
          <p className="text-[11px] leading-snug">{ui.request}</p>
        </div>
        <div
          className={"flex items-center gap-2 rounded-xl border border-status-teal/35 bg-status-teal-tint p-1.5 " + enter(active)}
          style={delay(1100)}
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-card text-status-teal">
            <LinkSimpleIcon weight="bold" className="size-3.5" />
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="text-[11px] font-semibold">{ui.linkTitle}</span>
            <span className="truncate text-[10px] text-muted-foreground">{ui.linkLabel}</span>
          </span>
        </div>
      </Phone>
    </Stage>
  )
}

function ClientShares({ ui, active }: SceneProps) {
  const words = ui.reviewText.split(" ")
  const postAt = 500 + words.length * 90 + 300
  return (
    <Stage className="justify-center">
      <RoleTag role="client" className="self-start">
        {ui.clientTag}
      </RoleTag>
      <div className={"flex flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-md " + enter(active)} style={delay(100)}>
        <div className="flex items-center gap-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-status-teal-tint text-[11px] font-semibold text-status-teal">
            {ui.reviewerInitials}
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-xs font-semibold">{ui.reviewerName}</span>
            <span className="truncate text-[10px] text-muted-foreground">{ui.linkTitle}</span>
          </span>
        </div>
        <p className="text-pretty text-sm leading-relaxed">
          {words.map((word, i) => (
            <span key={i} className={play(active, "st-word")} style={delay(500 + i * 90)}>
              {word}{" "}
            </span>
          ))}
        </p>
        <div className="flex items-center justify-between gap-2 border-t border-border pt-2">
          <FictionLabel>{ui.reviewLabel}</FictionLabel>
          <span className="grid justify-items-end">
            <span
              className={"col-start-1 row-start-1 rounded-full bg-foreground px-3 py-1 text-[11px] font-medium text-background " + leave(active)}
              style={delay(postAt)}
            >
              {ui.post}
            </span>
            <span
              className={
                "col-start-1 row-start-1 flex items-center gap-1 whitespace-nowrap rounded-full bg-approve-tint px-2 py-1 text-[11px] font-medium text-approve sm:px-3 " +
                play(active, "st-in")
              }
              style={delay(postAt + 250)}
            >
              <CheckIcon weight="bold" className="size-3" />
              {ui.posted}
            </span>
          </span>
        </div>
      </div>
    </Stage>
  )
}

function ResultSkeleton({ active, at, className }: { active: boolean; at: number; className?: string }) {
  return (
    <div className={cn("flex-col gap-1.5 rounded-lg border border-border p-2", className, enter(active))} style={delay(at)}>
      <Skeleton className="w-1/2 bg-foreground/15" />
      <Skeleton className="w-4/5" />
    </div>
  )
}

function SomeoneSearches({ ui, active }: SceneProps) {
  return (
    <Stage>
      <div className="flex items-center justify-between gap-2">
        <RoleTag role="prospect" className={play(active, "st-slide")} style={motionVars({ delay: 0, dx: "16px", dy: "0px" })}>
          {ui.prospectTag}
        </RoleTag>
        <span className="hidden truncate text-[10px] text-muted-foreground sm:inline">{ui.differentPerson}</span>
      </div>
      <div className={"flex min-h-0 flex-1 flex-col gap-1.5 rounded-xl border border-border bg-card p-2 shadow-md " + enter(active)} style={delay(200)}>
        <div className="flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2 py-1">
          <MagnifyingGlassIcon weight="bold" className="size-3 shrink-0 text-muted-foreground" />
          <span className={"truncate text-[11px] " + play(active, "st-type")} style={delay(500)}>
            {ui.searchQuery}
          </span>
        </div>
        <ResultSkeleton active={active} at={1100} className="flex" />
        <div
          className={"flex flex-col gap-0.5 rounded-lg border border-status-purple/40 bg-status-purple-tint p-2 " + enter(active)}
          style={delay(1300)}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-xs font-semibold">{ui.firm}</span>
            <span className="shrink-0 text-[10px] font-medium text-status-purple underline underline-offset-2">{ui.reviewsLink}</span>
          </div>
          <span className="truncate text-[10px] text-muted-foreground">{ui.listingMeta}</span>
          <span className="truncate text-[11px] italic">
            {"\u201C"}
            {ui.reviewText}
            {"\u201D"}
          </span>
        </div>
        <ResultSkeleton active={active} at={1500} className="hidden sm:flex" />
      </div>
      <Workstation role="prospect" device="laptop" className="hidden h-16 self-start sm:block" />
    </Stage>
  )
}

function TheyRead({ ui, active }: SceneProps) {
  return (
    <Stage className="flex-row items-stretch gap-2">
      <div className={"flex min-w-0 flex-1 flex-col gap-1.5 rounded-xl border border-border bg-card p-2 shadow-md " + enter(active)} style={delay(100)}>
        <span className="truncate text-xs font-semibold">{ui.firm}</span>
        <div className="flex gap-2.5 overflow-hidden whitespace-nowrap border-b border-border text-[10px]">
          {ui.tabs.map((tab, i) => (
            <span
              key={tab}
              className={cn(
                i > 1 && "hidden sm:inline",
                "-mb-px pb-1",
                i === 1 ? "border-b-2 border-status-purple font-semibold text-foreground" : "text-muted-foreground",
              )}
            >
              {tab}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-1 rounded-lg bg-muted/70 p-2">
          <div className="flex flex-wrap items-center justify-between gap-1">
            <span className="truncate text-[11px] font-semibold">{ui.reviewerName}</span>
            <FictionLabel>{ui.reviewLabel}</FictionLabel>
          </div>
          <p className="relative text-[11px] leading-snug">
            <span
              className={"absolute -inset-x-1 inset-y-0 rounded bg-status-purple/15 " + play(active, "st-grow-slow")}
              style={delay(800)}
            />
            <span className="relative">{ui.reviewText}</span>
          </p>
        </div>
        <div className="flex flex-col gap-1.5 rounded-lg bg-muted/40 p-2">
          <Skeleton className="w-1/3 bg-foreground/15" />
          <Skeleton />
          <Skeleton className="w-2/3" />
        </div>
      </div>
      <div className="flex flex-col items-center justify-end">
        <Figure role="prospect" pose="think" className={"h-20 sm:h-28 " + enter(active)} style={delay(300)} />
      </div>
    </Stage>
  )
}

function TheyReachOut({ ui, active }: SceneProps) {
  return (
    <Stage className="justify-center gap-0">
      <RoleTag role="prospect" className="mb-1.5 hidden self-start sm:inline-flex">
        {ui.prospectTag}
      </RoleTag>
      <div className={"flex flex-col gap-2 rounded-xl border border-border bg-card p-2.5 shadow-md " + enter(active)} style={delay(100)}>
        <span className="truncate text-xs font-semibold">{ui.firm}</span>
        <span
          className={
            "relative self-start rounded-full bg-foreground px-3 py-1.5 text-[11px] font-semibold text-background " +
            play(active, "st-press")
          }
          style={delay(1000)}
        >
          {ui.consultCta}
          <Cursor className={"-bottom-3 right-2 " + play(active, "st-cursor")} style={delay(250)} />
        </span>
      </div>
      <svg viewBox="0 0 2 28" className="mx-auto h-4 w-0.5 shrink-0 overflow-visible text-foreground/30 sm:h-7">
        <path
          d="M1 0v28"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          pathLength={1}
          className={play(active, "st-draw")}
          style={delay(1250)}
        />
      </svg>
      <div
        className={"flex flex-col gap-1.5 rounded-xl border border-brand/40 bg-card p-2.5 shadow-lg " + play(active, "st-slide")}
        style={delay(1550)}
      >
        <div className="flex items-start gap-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand">
            <BellSimpleIcon weight="fill" className="size-3.5" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col leading-tight">
            <span className="text-xs font-semibold">{ui.notificationTitle}</span>
            <span className="truncate text-[10px] text-muted-foreground">{ui.notificationSource}</span>
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <RoleTag role="staff" className="border-0 bg-transparent px-0 shadow-none">
            {ui.firmTag}
          </RoleTag>
          <Chip tone="handoff">{ui.requested}</Chip>
        </div>
      </div>
    </Stage>
  )
}

export function buildReviewsScenes(story: ReviewsStoryContent): Scene[] {
  const ui = story.ui
  return buildScenes(story.scenes, [
    { id: "reviews-milestone", tone: "ah-tone-call", durationMs: 5200, visual: (a) => <MilestoneReached ui={ui} active={a} /> },
    { id: "reviews-invitation", tone: "ah-tone-sky", durationMs: 5000, visual: (a) => <InvitationArrives ui={ui} active={a} /> },
    { id: "reviews-feedback", tone: "ah-tone-sky", durationMs: 5600, visual: (a) => <ClientShares ui={ui} active={a} /> },
    { id: "reviews-search", tone: "ah-tone-dusk", durationMs: 5400, visual: (a) => <SomeoneSearches ui={ui} active={a} /> },
    { id: "reviews-read", tone: "ah-tone-dusk", durationMs: 5400, visual: (a) => <TheyRead ui={ui} active={a} /> },
    { id: "reviews-contact", tone: "ah-tone-dusk", durationMs: 5600, visual: (a) => <TheyReachOut ui={ui} active={a} /> },
  ])
}
