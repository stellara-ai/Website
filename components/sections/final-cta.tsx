"use client"

import { ArrowRight } from "lucide-react"
import type { SiteContent } from "@/content/schema"
import { useInteraction } from "@/components/providers/interaction-context"
import { ActionButton } from "@/components/ui/action"
import { StellaraField } from "@/components/util/stellara-field"

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
}

export function FinalCta({ content }: { content: SiteContent }) {
  const { finalCta } = content
  const { openAppointment } = useInteraction()

  return (
    <section className="relative overflow-hidden border-t border-border">
      <StellaraField />
      <div className="container-editorial relative py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-semibold leading-[1.06] tracking-tight sm:text-5xl">
            {finalCta.headline}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {finalCta.description}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ActionButton
              variant="primary"
              size="lg"
              onClick={() => scrollToId("explorer")}
            >
              {finalCta.primaryCta}
              <ArrowRight className="size-4" />
            </ActionButton>
            <ActionButton variant="outline" size="lg" onClick={() => openAppointment({ source: "final-cta" })}>
              {finalCta.secondaryCta}
            </ActionButton>
          </div>
        </div>
      </div>
    </section>
  )
}
