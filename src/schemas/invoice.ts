import { z } from "zod"

const dateString = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date")

export const generateInvoiceSchema = z
  .object({
    clientName: z
      .string()
      .trim()
      .min(1, "Client name is required")
      .max(120, "Client name is too long"),

    clientEmail: z
      .email("Enter a valid email address")
      .optional()
      .or(z.literal("")),

    deliverableIds: z
      .array(z.string().min(1))
      .min(1, "Select at least one deliverable")
      .max(50, "You can invoice up to 50 line items"),

    applyAddOns: z.boolean(),

    issueDate: dateString,

    dueDate: dateString,

    notes: z
      .string()
      .trim()
      .max(1000, "Notes are too long")
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.dueDate >= data.issueDate, {
    message: "Due date must be on or after the issue date",
    path: ["dueDate"],
  })

export type GenerateInvoiceInput = z.infer<typeof generateInvoiceSchema>
