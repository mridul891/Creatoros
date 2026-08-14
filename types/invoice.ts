import type { InvoiceStatus, InvoiceTab } from "@/enums/invoice"

export interface Invoice {
  id: string
  invoiceId: string
  client: string
  logo: string
  color: string
  amount: number
  currency: string
  issued: string
  due: string
  status: InvoiceStatus
  desc: string
  dealId: string | null
  metadata: Record<string, unknown> | null
}

export interface InvoiceModalState {
  invoice?: Invoice
}

export interface InvoiceFormState {
  client: string
  logo: string
  desc: string
  amount: number
  due: string
  status: InvoiceStatus
}

export interface InvoiceFiltersState {
  tab: InvoiceTab
  search: string
}

export interface InvoiceListItem {
  id: string
  invoiceNumber: string
  dealId: string | null
  client: string
  brandName: string | null
  campaignName: string | null
  amount: number
  currency: string
  issuedAt: Date
  dueDate: Date | null
  status: InvoiceStatus
  description: string
  metadata: Record<string, unknown> | null
  createdAt: Date
  updatedAt: Date
}

export interface InvoiceListData {
  items: InvoiceListItem[]
  summary: {
    total: number
    paidAmount: number
    sentAmount: number
    overdueAmount: number
  }
  filters: {
    search: string
    status?: InvoiceStatus
  }
}
