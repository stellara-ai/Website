# Stellara

Marketing site for Stellara AI LLC — a bilingual (English / Spanish) landing site
covering AI automation and custom software. Built with the Next.js App Router and
Tailwind CSS.

## Tech stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript + React 19
- **Styling:** Tailwind CSS v4
- **UI:** shadcn / base-ui components, Phosphor icons (@phosphor-icons/react, weight="fill")
- **Analytics:** Vercel Analytics
- **Package manager:** pnpm

## Prerequisites

- **Node.js** 20 or newer
- **pnpm** 12+ (`npm install -g pnpm`, or run via `corepack enable`)

## Getting started

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Set up environment variables**

   Copy the example file and adjust the values as needed:

   ```bash
   cp .env.example .env.local
   ```

   | Variable | Required | Description |
   | --- | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | Yes (for correct SEO) | Absolute site URL used for canonical tags, hreflang alternates, the sitemap, and Open Graph metadata. |
   | `NEXT_PUBLIC_WHATSAPP_NUMBER` | No | WhatsApp contact number in international format, digits only (e.g. `15551234567`). When unset, the floating WhatsApp button is hidden automatically. |

   > The appointment/booking flow ships with a local dev adapter that only simulates a
   > submission (see `lib/appointments.ts`). Wire it to a real scheduling/CRM endpoint
   > (Cal.com, Calendly, HubSpot, a lead webhook, etc.) before collecting real leads.

3. **Start the dev server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser. The page
   hot-reloads as you edit files.

## Available scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server with hot reloading. |
| `pnpm build` | Create an optimized production build. |
| `pnpm start` | Serve the production build (run `pnpm build` first). |

## Production build

```bash
pnpm build
pnpm start
```

## Localization

Content lives in `content/en.ts` and `content/es.ts` (typed against
`content/schema.ts`). English is served at the root (`/`) and Spanish under
`/es`. The active locale is tracked with the `stellara_locale` cookie and routed
in `proxy.ts`.

## Project structure

```
app/            Routes (App Router): home, /es, legal pages, sitemap, robots
components/     UI, layout, sections, interactive, and provider components
content/        Bilingual content dictionaries and their shared schema
lib/            Helpers: SEO, routing, locale, analytics, appointments, WhatsApp
public/         Static assets and icons
```

## Deployment

The site is optimized for [Vercel](https://vercel.com). Set the environment
variables above in your Vercel project settings, then deploy — Vercel detects the
Next.js build automatically.
