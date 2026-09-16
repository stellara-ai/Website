"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react"
import type { SiteContent } from "@/content/schema"
import { pathFor } from "@/lib/routes"
import { useInteraction } from "@/components/providers/interaction-context"
import { StellaraLogo } from "@/components/brand/stellara-logo"
import { LanguageSwitcher } from "./language-switcher"
import { ActionButton } from "@/components/ui/action"
import { cn } from "@/lib/utils"

export function SiteHeader({ content, isHome }: { content: SiteContent; isHome: boolean }) {
  const { openAppointment } = useInteraction()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState<string>("")

  const homePath = pathFor("home", content.locale)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!isHome) return
    const ids = content.nav.map((item) => item.href.replace("#", ""))
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (!sections.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [content.nav, isHome])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container-editorial flex h-[72px] items-center justify-between gap-4">
        <Link href={homePath} className="rounded-md" aria-label="Stellara">
          <StellaraLogo className="-translate-y-[3px]" />
        </Link>

        <nav aria-label="Primary" className="hidden flex-nowrap items-center gap-1 lg:flex">
          {content.nav.map((item) => {
            const id = item.href.replace("#", "")
            const isActive = isHome && active === id
            return (
              <Link
                key={item.id}
                href={`${homePath}${item.href}`}
                className={cn(
                  "flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md px-3 py-2 text-[15px] font-normal transition-colors",
                  isActive ? "text-foreground" : "text-foreground/80 hover:text-foreground",
                )}
              >
                {item.label}
                <ChevronDown className="size-4 opacity-60" aria-hidden="true" />
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher content={content} />
          <ActionButton
            variant="primary"
            size="sm"
            className="gap-1.5"
            onClick={() => openAppointment({ source: "header" })}
          >
            {content.navCta}
            <ArrowRight className="size-4" aria-hidden="true" />
          </ActionButton>
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-xl border-2 border-border text-foreground lg:hidden"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? content.common.closeMenu : content.common.openMenu}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden">
          <div className="container-editorial flex flex-col gap-1 border-t border-border bg-background pb-6 pt-2">
            {content.nav.map((item) => (
              <Link
                key={item.id}
                href={`${homePath}${item.href}`}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-3 text-base text-foreground hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex items-center gap-3">
              <LanguageSwitcher content={content} />
            </div>
            <ActionButton
              variant="primary"
              size="lg"
              className="mt-3 w-full"
              onClick={() => {
                setMenuOpen(false)
                openAppointment({ source: "mobile-menu" })
              }}
            >
              {content.navCta}
            </ActionButton>
          </div>
        </div>
      )}
    </header>
  )
}
