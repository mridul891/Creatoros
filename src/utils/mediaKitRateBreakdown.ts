import type { MediaKitFormData } from "@/schemas/mediaKit"
import { formatMoney } from "@/utils/mediaKitFormatters"

const PAID_AD_MULTIPLIERS: Record<number, number> = {
  1: 1.25,
  3: 1.5,
  6: 1.8,
  12: 2.2,
}

const EXCLUSIVITY_MULTIPLIERS: Record<number, number> = {
  3: 1.3,
  6: 1.6,
}

export type RateAddOn = {
  label: string
  multiplier: number
}

export type RateAddOnLine = {
  label: string
  amount: number
  multiplier: number
}

export type RateCardBreakdown = {
  title: string
  total: number
  base: number
  addOnLines: RateAddOnLine[]
}

export type RateInclusionLine = {
  html: string
}

type MediaKitAddOns = MediaKitFormData["rates"]["addOns"]

function formatDuration(months: number) {
  if (months === 12) {
    return "1 year"
  }

  return `${months} months`
}

export function getRateAddOns(addOns: MediaKitAddOns) {
  const rateAddOns: RateAddOn[] = []
  const inclusions: string[] = []

  if (addOns.paidAdUsage.enabled) {
    const months = addOns.paidAdUsage.durationMonths
    const multiplier = PAID_AD_MULTIPLIERS[months] ?? 1
    const duration = formatDuration(months)

    rateAddOns.push({
      label: `Paid ad usage, ${duration}`,
      multiplier,
    })
    inclusions.push(`<b>Paid ad usage</b> for ${duration}`)
  }

  if (addOns.noCompetitorWork.enabled) {
    const months = addOns.noCompetitorWork.durationMonths
    const multiplier = EXCLUSIVITY_MULTIPLIERS[months] ?? 1
    const duration = formatDuration(months)

    rateAddOns.push({
      label: `No competitor work, ${duration}`,
      multiplier,
    })
    inclusions.push(`<b>No competitor collaborations</b> for ${duration}`)
  }

  if (addOns.adsFromHandle.enabled) {
    rateAddOns.push({
      label: "Ads from your handle",
      multiplier: 1.3,
    })
    inclusions.push("<b>Ads can run from my handle</b>")
  }

  return { addOns: rateAddOns, inclusions }
}

export function buildRateCards(
  rates: MediaKitFormData["rates"]
): RateCardBreakdown[] {
  const { addOns } = getRateAddOns(rates.addOns)

  return rates.deliverables
    .filter((deliverable) => deliverable.title.trim() && deliverable.price > 0)
    .map((deliverable) => {
      const base = deliverable.price
      let runningTotal = base
      const addOnLines: RateAddOnLine[] = []

      addOns.forEach((addOn) => {
        const addAmount = runningTotal * (addOn.multiplier - 1)
        runningTotal *= addOn.multiplier
        addOnLines.push({
          label: addOn.label,
          amount: addAmount,
          multiplier: addOn.multiplier,
        })
      })

      return {
        title: deliverable.title.trim(),
        total: runningTotal,
        base,
        addOnLines,
      }
    })
}

export function buildRateInclusions(
  rates: MediaKitFormData["rates"],
  deliverableTitles: string[]
): RateInclusionLine[] {
  const { inclusions } = getRateAddOns(rates.addOns)
  const lines = inclusions.map((html) => ({ html }))

  if (deliverableTitles.some((title) => /ugc/i.test(title))) {
    lines.push({
      html: "<b>UGC</b> is shot and edited for you to post on your own channels. It is not published on my page, so it does not include access to my audience.",
    })
  }

  if (lines.length === 0) {
    lines.push({
      html: "<b>Organic posting only.</b> Paid ad usage, exclusivity and whitelisting are quoted separately.",
    })
  }

  if (rates.paymentTerms.trim()) {
    lines.push({
      html: `<b>Payment:</b> ${rates.paymentTerms.trim()}`,
    })
  }

  return lines
}

export function formatRateMoney(amount: number, currency: string) {
  return formatMoney(Math.round(amount), currency)
}
