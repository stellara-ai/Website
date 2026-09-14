"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { track } from "@/lib/analytics"

export type Theme = "system" | "light" | "dark"
type ResolvedTheme = "light" | "dark"

export const THEME_STORAGE_KEY = "stellara-theme"

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function systemPrefersDark(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

function apply(theme: Theme) {
  if (typeof document === "undefined") return
  const root = document.documentElement
  const resolved: ResolvedTheme = theme === "system" ? (systemPrefersDark() ? "dark" : "light") : theme
  root.classList.add("theme-transition")
  root.classList.remove("light", "dark")
  root.classList.add(resolved)
  window.setTimeout(() => root.classList.remove("theme-transition"), 220)
  return resolved
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system")
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light")

  useEffect(() => {
    const stored = (localStorage.getItem(THEME_STORAGE_KEY) as Theme | null) ?? "system"
    setThemeState(stored)
    setResolvedTheme(stored === "system" ? (systemPrefersDark() ? "dark" : "light") : stored)
  }, [])

  useEffect(() => {
    if (theme !== "system") return
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => {
      apply("system")
      setResolvedTheme(systemPrefersDark() ? "dark" : "light")
    }
    media.addEventListener("change", handler)
    return () => media.removeEventListener("change", handler)
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    localStorage.setItem(THEME_STORAGE_KEY, next)
    document.cookie = `stellara-theme=${next}; path=/; max-age=31536000; samesite=lax`
    const resolved = apply(next)
    if (resolved) setResolvedTheme(resolved)
    track("theme_changed", { theme: next })
  }, [])

  const value = useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}

/** Inline, render-blocking script that sets the theme class before first paint. */
export const themeScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}')||'system';var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var r=t==='system'?(d?'dark':'light'):t;var e=document.documentElement;e.classList.remove('light','dark');e.classList.add(r);}catch(e){}})();`
