import { cn } from "@/lib/utils"

/**
 * Stellara wordmark — a tight, confident text lockup with no icon.
 */
export function StellaraLogo({
  className,
  showWordmark = true,
  labelledById,
}: {
  className?: string
  showWordmark?: boolean
  labelledById?: string
}) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      {showWordmark && (
        <span
          id={labelledById}
          className="font-display text-[1.8rem] font-medium tracking-[-0.02em] leading-none text-foreground"
        >
          stellara
          <span className="text-[0.6em] font-normal tracking-normal text-brand align-baseline">.ai</span>
        </span>
      )}
    </span>
  )
}
