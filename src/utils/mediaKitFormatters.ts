import { MEDIA_KIT_CATEGORY_LABELS } from "@/config/mediaKitForm"
import type { creatorCategorySchema } from "@/schemas/mediaKit"

const CURRENCY_LOCALES: Record<string, string> = {
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  INR: "en-IN",
}

export function formatCompactNumber(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return "0"
  }

  if (value >= 100_000) {
    return `${(value / 100_000)
      .toFixed(value >= 1_000_000 ? 1 : 1)
      .replace(/\.0$/, "")}L`
  }

  if (value >= 1_000) {
    return `${(value / 1_000)
      .toFixed(value >= 10_000 ? 0 : 1)
      .replace(/\.0$/, "")}K`
  }

  return String(Math.round(value))
}

export function formatMoney(amount: number, currency: string) {
  const locale = CURRENCY_LOCALES[currency] ?? "en-US"

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatHandle(handle: string) {
  const trimmed = handle.replace(/^@/, "").trim()
  return trimmed ? `@${trimmed}` : "@handle"
}

export function getInstagramUrl(handle: string) {
  const trimmed = handle.replace(/^@/, "").trim()
  return trimmed ? `https://instagram.com/${encodeURIComponent(trimmed)}` : "#"
}

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) {
    return ""
  }

  const first = parts[0]?.[0] ?? ""
  const second = parts[1]?.[0] ?? ""
  return `${first}${second}`.toUpperCase()
}

export function formatGenderSplit(womenPercentage: number) {
  if (womenPercentage <= 0) {
    return null
  }

  const menPercentage = Math.max(0, 100 - womenPercentage)
  return `${womenPercentage}% women · ${menPercentage}% men`
}

export function formatCategoryLabel(
  category: (typeof creatorCategorySchema.options)[number]
) {
  return MEDIA_KIT_CATEGORY_LABELS[category] ?? category
}

export function parseCommaSeparatedValues(value: string | undefined | null) {
  if (!value?.trim()) {
    return []
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

export function formatUpdatedDate(date = new Date()) {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
