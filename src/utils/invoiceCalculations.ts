import type {
  InvoiceDiscountType,
  InvoiceItemData,
  InvoiceItemRow,
  InvoiceTotals,
} from "@/types/invoice"

export function round2(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function computeLineTotals(item: InvoiceItemData): InvoiceItemRow {
  const quantity = Number.isFinite(item.quantity) ? item.quantity : 0
  const unitPrice = Number.isFinite(item.unitPrice) ? item.unitPrice : 0
  const discountPercent = Number.isFinite(item.discountPercent)
    ? Math.min(Math.max(item.discountPercent, 0), 100)
    : 0

  const lineSubtotal = round2(quantity * unitPrice)
  const lineDiscount = round2((lineSubtotal * discountPercent) / 100)

  return {
    ...item,
    lineSubtotal,
    lineDiscount,
    lineTotal: round2(lineSubtotal - lineDiscount),
  }
}

type DiscountInput = {
  discountType: InvoiceDiscountType
  discountValue: number
}

type TaxInput = {
  taxRate: number
}

export function computeInvoiceTotals(
  items: InvoiceItemData[],
  discount: DiscountInput,
  tax: TaxInput
): InvoiceTotals & { items: InvoiceItemRow[] } {
  const rows = items.map(computeLineTotals)

  const subtotal = round2(rows.reduce((sum, row) => sum + row.lineSubtotal, 0))
  const lineDiscountTotal = round2(
    rows.reduce((sum, row) => sum + row.lineDiscount, 0)
  )

  let invoiceLevelDiscount = 0
  if (discount.discountType === "percent") {
    const percent = Math.min(Math.max(discount.discountValue || 0, 0), 100)
    invoiceLevelDiscount = round2(
      ((subtotal - lineDiscountTotal) * percent) / 100
    )
  } else if (discount.discountType === "fixed") {
    invoiceLevelDiscount = round2(Math.max(discount.discountValue || 0, 0))
  }

  const discountAmount = round2(
    Math.min(lineDiscountTotal + invoiceLevelDiscount, subtotal)
  )
  const taxableAmount = round2(subtotal - discountAmount)

  const taxRate = Number.isFinite(tax.taxRate) ? Math.max(tax.taxRate, 0) : 0
  const taxAmount = round2((taxableAmount * taxRate) / 100)

  return {
    items: rows,
    subtotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    total: round2(taxableAmount + taxAmount),
  }
}

export function computeBalanceDue(total: number, amountPaid: number) {
  const paid = Number.isFinite(amountPaid) ? Math.max(amountPaid, 0) : 0
  return round2(Math.max(total - paid, 0))
}

const CURRENCY_LOCALES: Record<string, string> = {
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  INR: "en-IN",
  AUD: "en-AU",
  CAD: "en-CA",
  AED: "ar-AE",
  SGD: "en-SG",
}

export function formatInvoiceMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(CURRENCY_LOCALES[currency] ?? "en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number.isFinite(amount) ? amount : 0)
  } catch {
    return `${currency} ${(Number.isFinite(amount) ? amount : 0).toFixed(2)}`
  }
}

export function formatInvoiceDate(value: string | null | undefined) {
  if (!value) {
    return "—"
  }

  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
