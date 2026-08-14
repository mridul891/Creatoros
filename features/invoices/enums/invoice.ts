export enum InvoiceStatus {
  DRAFT = "Draft",
  SENT = "Sent",
  PAID = "Paid",
  OVERDUE = "Overdue",
  ARCHIVED = "Archived",
}

export enum InvoiceTab {
  ALL = "All",
  SENT = "Sent",
  PAID = "Paid",
  OVERDUE = "Overdue",
  DRAFT = "Draft",
  ARCHIVED = "Archived",
}

export const INVOICE_STATUSES = [
  InvoiceStatus.DRAFT,
  InvoiceStatus.SENT,
  InvoiceStatus.PAID,
  InvoiceStatus.OVERDUE,
  InvoiceStatus.ARCHIVED,
] as const
