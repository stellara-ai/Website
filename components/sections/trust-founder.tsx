import Image from "next/image"
import type { SiteContent } from "@/content/schema"
import { Eyebrow } from "@/components/sections/section-parts"
import { Reveal } from "@/components/util/reveal"

export function TrustFounder({ content }: { content: SiteContent }) {
  const section = content.trustFounder
  const initials = section.name
    .split(" ")
    .map((part) => part[0])
    .join("")

  return (
    <section id="founder" aria-labelledby="founder-heading" className="scroll-mt-20 bg-ink text-ink-foreground">
      <div className="container-editorial grid gap-10 py-20 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-center md:gap-16 md:py-24">
        <Reveal as="figure" className="mx-auto w-full max-w-sm md:mx-0">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-brand-strong">
            {section.photo ? (
              <Image
                src={section.photo}
                alt={section.photoAlt}
                fill
                sizes="(min-width: 768px) 24rem, 90vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3" role="img" aria-label={section.photoAlt}>
                <span className="text-7xl font-semibold tracking-tight text-brand-strong-foreground" aria-hidden="true">
                  {initials}
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.12em] text-brand-strong-foreground/80" aria-hidden="true">
                  {section.photoPending}
                </span>
              </div>
            )}
          </div>
          <figcaption className="mt-4 flex flex-col gap-0.5">
            <span className="text-lg font-semibold tracking-tight text-ink-foreground">{section.name}</span>
            <span className="text-sm text-ink-muted">{section.role}</span>
          </figcaption>
        </Reveal>

        <Reveal delay={120}>
          <Eyebrow tone="ink">{section.eyebrow}</Eyebrow>
          <h2
            id="founder-heading"
            className="mt-5 text-balance text-3xl font-semibold leading-[1.12] tracking-monday text-ink-foreground sm:text-4xl md:text-[2.9rem]"
          >
            {section.title}
          </h2>
          <div className="mt-8 flex flex-col gap-5 border-l-2 border-brand pl-6">
            {section.paragraphs.map((paragraph, index) => (
              <p
                key={paragraph}
                className={
                  index === 0
                    ? "text-pretty text-lg leading-relaxed text-ink-foreground sm:text-xl"
                    : "text-pretty text-base leading-relaxed text-ink-muted sm:text-lg"
                }
              >
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
