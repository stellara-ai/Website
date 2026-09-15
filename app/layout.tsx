import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Manrope, Geist_Mono, Space_Grotesk } from "next/font/google"
import { headers } from "next/headers"
import { ThemeProvider, themeScript } from "@/components/providers/theme-provider"
import { isLocale } from "@/lib/locale"
import { siteUrl } from "@/lib/routes"
import "./globals.css"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: ["400", "500", "600"],
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500", "600", "700"],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Stellara | AI Automation & Custom Software",
    template: "%s | Stellara",
  },
  description:
    "Stellara designs AI agents, connected workflows, and custom software that help businesses respond faster, operate more clearly, and convert more opportunities.",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8fb" },
    { media: "(prefers-color-scheme: dark)", color: "#07152d" },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headerLocale = (await headers()).get("x-locale")
  const lang = isLocale(headerLocale) ? headerLocale : "en"

  return (
    <html lang={lang} className={`${manrope.variable} ${geistMono.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased font-sans">
        <ThemeProvider>{children}</ThemeProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
