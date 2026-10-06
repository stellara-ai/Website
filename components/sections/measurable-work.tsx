import { ArrowRightIcon, CheckIcon } from "@phosphor-icons/react/dist/ssr"
import type { BriefItem, SiteContent } from "@/content/schema"
import { SectionHeading } from "@/components/sections/section-parts"
import { Reveal } from "@/components/util/reveal"
import { cn } from "@/lib/utils"

type Section = SiteContent["measurableWork"]

export function MeasurableWork({ content }: { content: SiteContent }) {
  const section = content.measurableWork
  const unresolvedIndex = section.monthMetrics.length - 1

  return (
    <section id="measurement" className="scroll-mt-20">
      <div className="container-editorial py-20 md:py-24">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} description={section.description} />

        <Reveal className="mt-10">
          <article aria-labelledby="brief-heading" className="overflow-hidden rounded-2xl bg-surface-alt">
          <header className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-5">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 id="brief-heading" className="text-lg font-semibold tracking-tight text-foreground">
                {section.briefLabel}
              </h3>
              <p className="text-sm text-muted-foreground">
                {section.briefFirm} <span aria-hidden="true">·</span> {section.briefTime}
              </p>
            </div>
            <p className="w-fit rounded-full border border-border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
              {section.illustrative}
            </p>
          </header>

          <div
            className="hidden grid-cols-[5rem_minmax(0,1fr)_minmax(0,1fr)] gap-x-8 border-b border-border px-8 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground md:grid"
            aria-hidden="true"
          >
            <span />
            <span>{section.movedLabel}</span>
            <span>{section.actionLabel}</span>
          </div>

          <ol className="divide-y divide-border">
            {section.items.map((item, index) => (
              <BriefRow key={item.label} item={item} section={section} delay={index * 90} />
            ))}
          </ol>
          </article>
        </Reveal>

        <Reveal delay={120} className="mt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-foreground pb-3">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">{section.monthLabel}</h3>
            <p className="text-sm text-muted-foreground">
              {section.monthPeriod} <span aria-hidden="true">·</span> {section.illustrative}
            </p>
          </div>
          <dl className="grid grid-cols-2 md:grid-cols-4">
            {section.monthMetrics.map((metric, index) => (
              <div
                key={metric.label}
                className={cn(
                  "flex flex-col-reverse gap-1 border-b border-border py-5 pr-4 md:border-b-0 md:py-6",
                  index % 2 === 1 && "border-l pl-4 md:pl-6",
                  index > 0 && "md:border-l md:pl-6",
                )}
              >
                <dt className="text-sm leading-snug text-muted-foreground">{metric.label}</dt>
                <dd
                  className={cn(
                    "text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl",
                    index === unresolvedIndex ? "text-status-work" : "text-foreground",
                  )}
                >
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground">{section.footnote}</p>
        </Reveal>
      </div>
    </section>
  )
}

function BriefRow({ item, section, delay }: { item: BriefItem; section: Section; delay: number }) {
  const needsStaff = item.tone === "handoff"

  return (
    <Reveal
      as="li"
      delay={delay}
      className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-4 gap-y-4 px-5 py-6 sm:px-8 md:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1fr)] md:items-start md:gap-x-8"
    >
      <p className="text-4xl font-semibold leading-none tabular-nums tracking-tight text-foreground md:text-5xl">
        {item.count}
      </p>

      <div className="min-w-0">
        <p className="text-base font-semibold text-foreground">{item.label}</p>
        <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
      </div>

      <div
        className={cn(
          "col-start-2 flex items-start gap-3 rounded-xl px-4 py-3 md:col-start-3",
          needsStaff ? "bg-card" : "bg-transparent px-0 md:px-4",
        )}
      >
        <span
          className={cn(
            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
            needsStaff ? "bg-status-work text-background" : "bg-status-done-tint text-status-done",
          )}
          aria-hidden="true"
        >
          {needsStaff ? (
            <ArrowRightIcon weight="bold" className="size-3" />
          ) : (
            <CheckIcon weight="bold" className="size-3" />
          )}
        </span>
        <div className="min-w-0">
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-[0.08em]",
              needsStaff ? "text-status-work" : "text-status-done",
            )}
          >
            {needsStaff ? section.handoffStatus : section.doneStatus}
          </p>
          <p
            className={cn(
              "mt-1 text-pretty text-sm leading-relaxed",
              needsStaff ? "font-medium text-foreground" : "text-muted-foreground",
            )}
          >
            {item.action}
          </p>
        </div>
      </div>
    </Reveal>
  )
}
