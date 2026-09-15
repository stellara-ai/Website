"use client"

import Link from "next/link"
import type { SiteContent } from "@/content/schema"
import { pathFor } from "@/lib/routes"
import { useInteraction } from "@/components/providers/interaction-context"
import { StellaraLogo } from "@/components/brand/stellara-logo"
import { ThemeToggle } from "./theme-toggle"

export function SiteFooter({ content }: { content: SiteContent }) {
  const { openAppointment } = useInteraction()
  const homePath = pathFor("home", content.locale)
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background">
      <div className="container-editorial py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <StellaraLogo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground text-pretty">{content.footer.descriptor}</p>
          </div>

          <FooterColumn title={content.footer.navTitle}>
            {content.nav.map((item) => (
              <Link
                key={item.id}
                href={`${homePath}${item.href}`}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </FooterColumn>

          <FooterColumn title={content.footer.contactTitle}>
            <button
              type="button"
              onClick={() => openAppointment({ source: "footer" })}
              className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {content.footer.contactPlaceholder}
            </button>
          </FooterColumn>

          <FooterColumn title={content.footer.legalTitle}>
            <Link
              href={pathFor("privacy", content.locale)}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {content.footer.privacy}
            </Link>
            <Link
              href={pathFor("terms", content.locale)}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {content.footer.terms}
            </Link>
          </FooterColumn>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.06em]">
            {content.footer.crafted}
          </p>
          <div className="flex items-center gap-4">
            <p>
              © {year} Stellara AI LLC. {content.footer.rights}
            </p>
            <ThemeToggle content={content} />
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="label-mono mb-4 text-muted-foreground">{title}</h3>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  )
}
