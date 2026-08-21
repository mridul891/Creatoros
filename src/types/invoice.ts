import type { RateAddOn } from "@/utils/mediaKitRateBreakdown"

export type InvoiceLineItem = {
  description: string
  amount: number
}

export type GeneratedInvoice = {
  id: string
  invoiceNumber: string
  clientName: string
  clientEmail: string | null
  currency: string
  amount: number
  issuedAt: string
  dueDate: string
  lineItems: InvoiceLineItem[]
  notes: string | null
}

export type GenerateInvoiceResult =
  | {
      status: "success"
      invoice: GeneratedInvoice
    }
  | {
      status: "error"
      message: string
      fieldErrors?: Partial<Record<string, string>>
    }

export type RateCardOption = {
  id: string
  title: string
  price: number
}

export type InvoiceDraftData = {
  currency: string
  paymentTerms: string
  deliverables: RateCardOption[]
  addOns: RateAddOn[]
}

export type RecentInvoice = {
  id: string
  invoiceNumber: string
  clientName: string | null
  amount: number
  currency: string
  issuedAt: Date
}
