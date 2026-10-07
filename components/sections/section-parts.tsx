import { cn } from "@/lib/utils"

export function Eyebrow({
  children,
  className,
  tone = "default",
}: {
  children: React.ReactNode
  className?: string
  tone?: "default" | "ink"
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider",
        tone === "ink" ? "bg-white/10 text-ink-foreground" : "bg-brand-tint text-brand",
        className,
      )}
    >
      <span
        className={cn("size-1.5 rounded-full", tone === "ink" ? "bg-white" : "bg-brand")}
        aria-hidden="true"
      />
      {children}
    </span>
  )
}

const STATUS_STYLES = {
  done: "bg-status-done text-white",
  work: "bg-status-work text-white",
  stuck: "bg-status-stuck text-white",
  purple: "bg-status-purple text-white",
  indigo: "bg-brand text-white",
} as const

export function StatusLabel({
  children,
  tone = "done",
  className,
}: {
  children: React.ReactNode
  tone?: keyof typeof STATUS_STYLES
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md px-3 py-1 text-xs font-bold",
        STATUS_STYLES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function SectionHeading({
  title,
  description,
  align = "left",
  tone = "default",
  className,
}: {
  title: React.ReactNode
  description?: string
  align?: "left" | "center"
  tone?: "default" | "ink"
  className?: string
}) {
  return (
    <div className={cn(align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl", className)}>
      <h2
        className={cn(
          "text-balance text-3xl font-semibold leading-[1.12] tracking-monday sm:text-4xl md:text-[2.9rem]",
          tone === "ink" ? "text-ink-foreground" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-5 text-pretty text-base leading-relaxed sm:text-lg",
            tone === "ink" ? "text-ink-muted" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}
