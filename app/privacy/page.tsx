import type { Metadata } from "next"
import { getContent } from "@/content"
import { buildMetadata } from "@/lib/seo"
import { LegalPage } from "@/components/site/legal-page"

export const metadata: Metadata = buildMetadata("privacy", "en")

export default function Page() {
  const content = getContent("en")
  return <LegalPage content={content} page={content.privacy} />
}
