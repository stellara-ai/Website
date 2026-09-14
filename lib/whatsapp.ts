/**
 * Builds a wa.me link from an environment-configured number. The number is
 * never hard-coded in source. Returns null when unconfigured so the UI can
 * hide or disable the option gracefully.
 */
export function whatsappLink(message: string): string | null {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  if (!raw) return null
  const digits = raw.replace(/[^\d]/g, "")
  if (!digits) return null
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export function isWhatsappConfigured(): boolean {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  return Boolean(raw && raw.replace(/[^\d]/g, ""))
}
