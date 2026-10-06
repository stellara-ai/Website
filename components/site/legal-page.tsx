import Link from "next/link"
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr"
import type { LegalPageContent, SiteContent } from "@/content/schema"
import { InteractionProvider } from "@/components/providers/interaction-provider"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { pathFor } from "@/lib/routes"

export function LegalPage({ content, page }: { content: SiteContent; page: LegalPageContent }) {
  const updated = new Intl.DateTimeFormat(content.locale === "es" ? "es-US" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date())

  return (
    <InteractionProvider content={content}>
      <SiteHeader content={content} isHome={false} />
      <main id="main" className="container-editorial py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          <Link
            href={pathFor("home", content.locale)}
            className="label-mono inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeftIcon weight="bold" className="size-4" />
            {page.backHome}
          </Link>

          <h1 className="mt-8 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{page.title}</h1>
          <p className="mt-3 label-mono text-muted-foreground">
            {page.updated}: {updated}
          </p>

          <p className="mt-4 rounded-xl border border-border bg-muted/50 p-4 text-sm leading-relaxed text-muted-foreground text-pretty">
            {page.reviewNote}
          </p>

          <p className="mt-8 text-pretty leading-relaxed text-muted-foreground">{page.intro}</p>

          <div className="mt-10 space-y-10">
            {page.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-lg font-semibold text-foreground">{section.heading}</h2>
                <div className="mt-3 space-y-3">
                  {section.body.map((paragraph, i) => (
                    <p key={i} className="text-pretty leading-relaxed text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter content={content} />
    </InteractionProvider>
  )
}
