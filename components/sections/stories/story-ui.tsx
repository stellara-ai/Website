import type { CSSProperties, ReactNode } from "react"
import { Check } from "lucide-react"
import type { AttentionTone, StorySceneCopy } from "@/content/schema"
import type { Scene } from "@/components/sections/after-hours/scenes"
import { cn } from "@/lib/utils"

export const delay = (ms: number) => ({ "--ah-delay": `${ms}ms` }) as CSSProperties

export const enter = (active: boolean) => (active ? "ah-reveal" : "")

export function sceneHeadline(copy: StorySceneCopy): ReactNode {
  if (!copy.headlineAccent) return copy.headline
  return (
    <>
      {copy.headline} <span className="text-brand">{copy.headlineAccent}</span>
    </>
  )
}

/** Merges localized copy with per-scene visuals and timing into carousel scenes. */
export function buildScenes(
  copies: StorySceneCopy[],
  defs: { id: string; tone: string; durationMs: number; visual: (active: boolean) => ReactNode }[],
): Scene[] {
  return defs.map((def, i) => {
    const copy = copies[i]
    return {
      ...def,
      time: copy.time,
      step: copy.step,
      title: copy.title,
      headline: sceneHeadline(copy),
      body: copy.body,
      summary: copy.summary,
    }
  })
}

export function StageFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("absolute inset-0 flex flex-col gap-2.5 p-3", className)} aria-hidden="true">
      {children}
    </div>
  )
}

export function StageHeader({ title, aside }: { title: string; aside?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="truncate text-xs font-semibold text-foreground">{title}</span>
      {aside && <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">{aside}</span>}
    </div>
  )
}

export function Panel({
  children,
  className,
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card shadow-sm", className)} style={style}>
      {children}
    </div>
  )
}

export function Bubble({
  children,
  side,
  className,
  style,
}: {
  children: ReactNode
  side: "out" | "in"
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      className={cn(
        "max-w-[88%] rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-sm",
        side === "out"
          ? "self-end rounded-br-md bg-brand text-brand-foreground"
          : "self-start rounded-bl-md border border-border bg-card text-foreground",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  )
}

const TONE_CHIP: Record<AttentionTone, string> = {
  auto: "border-approve/30 bg-approve-tint text-approve",
  handoff: "border-status-work/40 bg-status-work-tint text-foreground",
  done: "border-border bg-muted text-muted-foreground",
}

const TONE_DOT: Record<AttentionTone, string> = {
  auto: "bg-approve",
  handoff: "bg-status-work",
  done: "bg-muted-foreground",
}

export function Chip({
  tone,
  children,
  className,
  style,
}: {
  tone: AttentionTone
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-5",
        TONE_CHIP[tone],
        className,
      )}
      style={style}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", TONE_DOT[tone])} />
      <span className="truncate">{children}</span>
    </span>
  )
}

export function CheckDot({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-full bg-approve text-background",
        className,
      )}
    >
      <Check className="size-2.5" strokeWidth={3} />
    </span>
  )
}

export function Initials({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
  return (
    <span
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-full bg-scene/15 text-[11px] font-semibold text-scene",
        className,
      )}
    >
      {initials}
    </span>
  )
}
