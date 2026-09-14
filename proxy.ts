import { NextResponse, type NextRequest } from "next/server"
import { LOCALE_COOKIE, detectLocaleFromHeader, isLocale } from "@/lib/locale"
import { localeFromPathname } from "@/lib/routes"

/**
 * Locale handling:
 * - Browser-language detection runs ONLY on first entry to the root homepage.
 * - A saved manual choice always wins and is never overridden.
 * - Deep links are never redirected based on browser language.
 * - The resolved locale is passed to the layout via the `x-locale` header so
 *   the correct `<html lang>` is rendered on the server.
 */
export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value

  // Only the root path is eligible for first-visit detection.
  if (pathname === "/") {
    const hasManualChoice = isLocale(cookieLocale)
    if (!hasManualChoice) {
      const detected = detectLocaleFromHeader(request.headers.get("accept-language"))
      if (detected === "es") {
        const url = request.nextUrl.clone()
        url.pathname = "/es"
        return NextResponse.redirect(url)
      }
    }
  }

  const locale = localeFromPathname(pathname)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-locale", locale)
  requestHeaders.set("x-pathname", pathname)
  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
}
