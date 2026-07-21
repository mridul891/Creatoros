export type ScriptType = "brand_deal" | "personal"

export type Script = {
  id: string
  title: string
  type: ScriptType
  brandId?: string
  brandName?: string
  dealId?: string
  dealName?: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export const TYPE_CFG: Record<ScriptType, { label: string; color: string }> = {
  brand_deal: {
    label: "Brand Deal",
    color: "var(--primary)",
  },
  personal: {
    label: "Personal",
    color: "var(--muted-foreground)",
  },
}

export function formatRelativeDate(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return `Today at ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
  }
  if (diffDays === 1) {
    return "Yesterday"
  }
  if (diffDays < 7) {
    return `${diffDays} days ago`
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function getReadingTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min`
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + "..."
}
