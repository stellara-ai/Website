import { cn } from "@/lib/utils"

/**
 * Stellara symbol — the three-orbit glyph. Painted with `currentColor` so it
 * inherits the brand token: gold (#a8792a) in light mode, its dark-field
 * counterpart (#e8c88a) in dark mode, no theme-swap flash required.
 */
export function StellaraSymbol({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 614 893"
      className={cn("w-auto shrink-0 text-brand", className)}
      fill="currentColor"
      role="img"
      aria-hidden="true"
    >
      <path d="M 560 391 L 510 356 L 473 339 L 435 327 L 472 350 L 509 384 L 530 412 L 544 440 L 552 470 L 553 497 L 545 531 L 529 560 L 487 600 L 454 618 L 420 630 L 341 642 L 187 643 L 151 651 L 119 666 L 92 687 L 65 724 L 55 750 L 51 771 L 52 806 L 60 832 L 72 852 L 99 876 L 139 891 L 187 891 L 236 877 L 288 850 L 345 811 L 442 735 L 532 656 L 564 623 L 586 594 L 604 558 L 613 521 L 613 490 L 603 451 L 583 416 Z" />
      <path d="M 302 322 L 279 325 L 254 333 L 231 346 L 206 369 L 193 388 L 184 407 L 177 435 L 176 452 L 179 481 L 186 503 L 193 517 L 203 532 L 221 551 L 242 566 L 264 576 L 288 582 L 316 583 L 340 579 L 357 573 L 375 564 L 390 553 L 407 536 L 420 517 L 428 501 L 432 489 L 437 462 L 437 444 L 431 413 L 421 390 L 406 368 L 390 352 L 371 339 L 352 330 L 323 323 Z" />
      <path d="M 539 24 L 508 7 L 478 0 L 431 2 L 372 21 L 324 48 L 262 93 L 163 175 L 81 250 L 28 312 L 11 345 L 1 382 L 0 418 L 5 444 L 17 473 L 41 506 L 76 536 L 104 553 L 178 581 L 139 556 L 106 526 L 88 504 L 70 472 L 61 440 L 60 408 L 68 376 L 80 353 L 95 333 L 126 306 L 156 289 L 195 275 L 265 263 L 443 260 L 486 247 L 514 231 L 539 209 L 556 187 L 569 161 L 577 128 L 577 94 L 570 66 L 558 44 Z" />
    </svg>
  )
}

/**
 * Stellara lockup — the three-orbit symbol paired with the wordmark.
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
    <span className={cn("inline-flex items-center gap-1", className)}>
      <StellaraSymbol className="h-6" />
      {showWordmark && (
        <span
          id={labelledById}
          className="font-display text-[1.8rem] font-medium tracking-[-0.02em] leading-none text-foreground"
        >
          stellara
          <span className="text-[0.6em] font-normal tracking-normal text-brand align-baseline">.one</span>
        </span>
      )}
    </span>
  )
}
