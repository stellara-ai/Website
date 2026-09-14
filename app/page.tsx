import type { Metadata } from "next"
import { getContent } from "@/content"
import { buildMetadata } from "@/lib/seo"
import { HomePage } from "@/components/site/home-page"

export const metadata: Metadata = buildMetadata("home", "en")

export default function Page() {
  return <HomePage content={getContent("en")} />
}
