import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Geist_Mono } from "next/font/google"
import localFont from "next/font/local"
import { headers } from "next/headers"
import { ThemeProvider, themeScript } from "@/components/providers/theme-provider"
import { isLocale } from "@/lib/locale"
import { siteUrl } from "@/lib/routes"
import "./globals.css"

const poppins = localFont({
  src: [
    { path: "./fonts/poppins/Poppins-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/poppins/Poppins-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/poppins/Poppins-Italic.ttf", weight: "400", style: "italic" },
    { path: "./fonts/poppins/Poppins-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/poppins/Poppins-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/poppins/Poppins-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/poppins/Poppins-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-poppins",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: ["400", "500", "600"],
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
    { media: "(prefers-color-scheme: dark)", color: "#0a0e1a" },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headerLocale = (await headers()).get("x-locale")
  const lang = isLocale(headerLocale) ? headerLocale : "en"

  return (
    <html lang={lang} className={`${poppins.variable} ${geistMono.variable}`} suppressHydrationWarning>
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
