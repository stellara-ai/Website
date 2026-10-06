import type { CSSProperties, ReactNode } from "react"
import { cn } from "@/lib/utils"

/** Who a figure or label represents. Each role keeps one hue across every story. */
export type Role = "client" | "staff" | "prospect"

const ROLE_TEXT: Record<Role, string> = {
  client: "text-status-teal",
  staff: "text-brand",
  prospect: "text-status-purple",
}

const ROLE_DOT: Record<Role, string> = {
  client: "bg-status-teal",
  staff: "bg-brand",
  prospect: "bg-status-purple",
}

export const ROLE_BUBBLE: Record<Role, string> = {
  client: "border border-status-teal/35 bg-status-teal-tint text-foreground",
  staff: "border border-brand/35 bg-brand-tint text-foreground",
  prospect: "border border-status-purple/35 bg-status-purple-tint text-foreground",
}

/** Applies a one-shot animation class only while the scene is active, so idle cards show their final state. */
export const play = (active: boolean, className: string) => (active ? className : "")

/** For an element that should leave during the scene and stay gone once it settles. */
export const leave = (active: boolean) => (active ? "st-out" : "opacity-0")

export const motionVars = (vars: { delay?: number; dx?: string; dy?: string }) =>
  ({
    ...(vars.delay !== undefined && { "--ah-delay": `${vars.delay}ms` }),
    ...(vars.dx !== undefined && { "--st-dx": vars.dx }),
    ...(vars.dy !== undefined && { "--st-dy": vars.dy }),
  }) as CSSProperties

export function Stage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("absolute inset-0 flex flex-col gap-2 p-3", className)} aria-hidden="true">
      {children}
    </div>
  )
}

type StandingPose = "stand" | "phone" | "think"

export function Figure({
  role,
  pose = "stand",
  className,
  style,
}: {
  role: Role
  pose?: StandingPose
  className?: string
  style?: CSSProperties
}) {
  return (
    <svg
      viewBox="0 0 48 100"
      className={cn("h-24 w-auto shrink-0 overflow-visible", ROLE_TEXT[role], className)}
      style={style}
      aria-hidden="true"
    >
      <ellipse cx="24" cy="97" rx="16" ry="2.5" className="fill-foreground/10" />
      <path d="M12.5 60h23l-2.2 35h-6.6L24 72l-2.7 23h-6.6z" fill="currentColor" opacity="0.42" />
      <path d="M9 48c0-14 6.5-21 15-21s15 7 15 21v14H9z" fill="currentColor" opacity="0.78" />
      <circle cx="24" cy="14" r="9" fill="currentColor" />
      {pose === "phone" && (
        <>
          <path
            d="M34 33c5 5 6 10 3 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.78"
          />
          <rect x="33" y="34" width="7" height="11.5" rx="1.6" className="fill-foreground/70" transform="rotate(-14 36.5 40)" />
        </>
      )}
      {pose === "think" && (
        <path
          d="M13 33Q11 47 16.5 45.5Q21 41 21.5 25"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.9"
        />
      )}
    </svg>
  )
}

/** A seated figure at a desk, seen from the side. */
export function Workstation({
  role,
  device = "monitor",
  pose = "type",
  className,
  style,
}: {
  role: Role
  device?: "monitor" | "laptop"
  pose?: "type" | "call"
  className?: string
  style?: CSSProperties
}) {
  return (
    <svg
      viewBox="0 0 124 100"
      className={cn("h-24 w-auto shrink-0 overflow-visible", ROLE_TEXT[role], className)}
      style={style}
      aria-hidden="true"
    >
      <ellipse cx="62" cy="97" rx="58" ry="2.5" className="fill-foreground/10" />
      <rect x="5" y="38" width="4.5" height="38" rx="2.2" className="fill-foreground/20" />
      <rect x="5" y="70" width="36" height="5" rx="2.5" className="fill-foreground/20" />
      <rect x="21" y="75" width="3.5" height="21" rx="1.5" className="fill-foreground/20" />
      <rect x="18" y="62" width="31" height="9" rx="4" fill="currentColor" opacity="0.42" />
      <rect x="42" y="64" width="8" height="32" rx="3" fill="currentColor" opacity="0.42" />
      <path d="M14 66V50c0-13 5-20 13-20s13 6.5 13 18v18z" fill="currentColor" opacity="0.78" />
      <circle cx="28" cy="18" r="8.5" fill="currentColor" />
      {pose === "type" ? (
        <path
          d="M34 38c5 9 12 15 25 17"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.9"
        />
      ) : (
        <>
          <path
            d="M35 37c7 4 6-8 1-13"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.9"
          />
          <rect x="34" y="11" width="5" height="12" rx="1.5" className="fill-foreground/75" />
        </>
      )}
      <rect x="44" y="58" width="80" height="4.5" rx="2.2" className="fill-foreground/30" />
      <rect x="114" y="62" width="4" height="34" rx="1.5" className="fill-foreground/20" />
      {device === "monitor" ? (
        <>
          <polygon points="93,17 60,25 60,42 93,46" className="fill-foreground/[0.05]" />
          <rect x="96" y="46" width="3" height="12" className="fill-foreground/35" />
          <rect x="93" y="14" width="5" height="34" rx="2" className="fill-foreground/45" />
        </>
      ) : (
        <>
          <rect x="62" y="55" width="30" height="3" rx="1.2" className="fill-foreground/45" />
          <polygon points="89,57 93,57 101,33 97,33" className="fill-foreground/45" />
        </>
      )}
    </svg>
  )
}

export function RoleTag({
  role,
  children,
  className,
  style,
}: {
  role: Role
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-card/90 px-2 py-0.5 text-[11px] font-medium leading-5 text-foreground shadow-sm",
        className,
      )}
      style={style}
    >
      <span className={cn("size-2 shrink-0 rounded-full", ROLE_DOT[role])} />
      <span className="truncate">{children}</span>
    </span>
  )
}

export function Phone({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-[1.25rem] border-[3px] border-foreground/70 bg-card shadow-md",
        className,
      )}
      style={style}
    >
      <span className="mx-auto mt-1.5 h-1 w-8 shrink-0 rounded-full bg-foreground/20" />
      <div className="flex min-h-0 flex-1 flex-col gap-1.5 p-2">{children}</div>
    </div>
  )
}

export function Browser({
  url,
  children,
  className,
  style,
}: {
  url: string
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      className={cn("flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-md", className)}
      style={style}
    >
      <div className="flex shrink-0 items-center gap-1 border-b border-border bg-muted/70 px-2.5 py-1.5">
        <span className="size-1.5 rounded-full bg-foreground/20" />
        <span className="size-1.5 rounded-full bg-foreground/20" />
        <span className="size-1.5 rounded-full bg-foreground/20" />
        <span className="ml-1.5 min-w-0 flex-1 truncate rounded-full bg-background px-2 py-0.5 text-[10px] text-muted-foreground">
          {url}
        </span>
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  )
}

export function Monitor({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={cn("flex flex-col items-center", className)} style={style}>
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-xl border-[3px] border-foreground/65 bg-card shadow-md">
        {children}
      </div>
      <span className="h-2 w-3 shrink-0 bg-foreground/35" />
      <span className="h-1 w-14 shrink-0 rounded-full bg-foreground/35" />
    </div>
  )
}

export function Cursor({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 16 20"
      className={cn("pointer-events-none absolute z-20 h-5 w-4 drop-shadow-sm", className)}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M1.5 1.5l12.5 9.2-5.8 1.2 3.3 6.4-2.6 1.3-3.3-6.5-4.1 4z"
        className="fill-foreground stroke-background"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <span className={cn("block h-1.5 rounded-full bg-foreground/10", className)} />
}

export function FictionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border border-dashed border-foreground/30 px-2 py-0.5 text-[10px] font-medium leading-4 text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  )
}
