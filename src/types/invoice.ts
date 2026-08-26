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

export type InvoiceParty = {
  name: string
  email: string
  phone: string
  addressLine: string
  city: string
  state: string
  postalCode: string
  country: string
  taxId: string
}

export type InvoiceShippingDetails = {
  name: string
  phone: string
  addressLine: string
  city: string
  state: string
  postalCode: string
  country: string
}

export type InvoicePaymentDetails = {
  accountName: string
  accountNumber: string
  ifscOrSwift: string
  bankName: string
  upiOrPaypal: string
}

export type InvoiceSellerDetails = InvoiceParty & {
  businessName: string
  logoUrl: string
  website: string
}

export type InvoiceItemData = {
  id: string
  name: string
  description: string
  quantity: number
  unitPrice: number
  discountPercent: number
}

export type InvoiceDiscountType = "none" | "percent" | "fixed"

export type InvoiceTotals = {
  subtotal: number
  discountAmount: number
  taxableAmount: number
  taxAmount: number
  total: number
}

export type InvoiceStatusValue =
  | "Draft"
  | "Sent"
  | "Paid"
  | "PartiallyPaid"
  | "Unpaid"
  | "Overdue"
  | "Archived"

export type InvoiceItemRow = InvoiceItemData & {
  lineSubtotal: number
  lineDiscount: number
  lineTotal: number
}

export type InvoiceDetailData = {
  id: string
  invoiceNumber: string
  status: InvoiceStatusValue
  currency: string
  issuedAt: string
  dueDate: string | null
  paidDate: string | null
  seller: InvoiceSellerDetails
  customer: InvoiceParty
  shipping: InvoiceShippingDetails | null
  shippingSameAsBilling: boolean
  items: InvoiceItemRow[]
  discountType: InvoiceDiscountType
  discountValue: number
  taxLabel: string
  taxRate: number
  totals: InvoiceTotals
  amountPaid: number
  balanceDue: number
  notes: string
  terms: string
  paymentDetails: InvoicePaymentDetails
  createdAt: Date
  updatedAt: Date
}

export type InvoiceListItem = {
  id: string
  invoiceNumber: string
  customerName: string | null
  status: InvoiceStatusValue
  amount: number
  currency: string
  issuedAt: Date
  dueDate: Date | null
  updatedAt: Date
}
