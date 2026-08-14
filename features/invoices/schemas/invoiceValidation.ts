import { z } from "zod"

import { INVOICE_STATUSES } from "@/features/invoices/enums/invoice"

export const invoiceIdSchema = z.object({
  invoiceId: z.uuid("Invoice id is invalid."),
})

export const createInvoiceFromDeliverableSchema = z.object({
  deliverableId: z.uuid("Deliverable id is invalid."),
})

export const invoiceListSchema = z.object({
  search: z.string().trim().max(120).optional(),
  status: z.enum(INVOICE_STATUSES).optional(),
})

export type CreateInvoiceFromDeliverableInput = z.infer<
  typeof createInvoiceFromDeliverableSchema
>
export type InvoiceListInput = z.infer<typeof invoiceListSchema>
