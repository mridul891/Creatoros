import { z } from "zod"

const dateString = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date")

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((value) => value ?? "")

export const INVOICE_CURRENCIES = [
  "INR",
  "USD",
  "EUR",
  "GBP",
  "AUD",
  "CAD",
  "AED",
  "SGD",
] as const

export const INVOICE_STATUSES = [
  "Draft",
  "Sent",
  "Paid",
  "PartiallyPaid",
  "Unpaid",
  "Overdue",
  "Archived",
] as const

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

const partySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(160),
  email: z.union([z.email("Enter a valid email"), z.literal("")]).default(""),
  phone: optionalText(40),
  addressLine: optionalText(300),
  city: optionalText(80),
  state: optionalText(80),
  postalCode: optionalText(20),
  country: optionalText(80),
  taxId: optionalText(60),
})

const sellerSchema = partySchema.extend({
  businessName: optionalText(160),
  logoUrl: optionalText(500_000),
  website: optionalText(200),
})

const shippingSchema = z.object({
  name: optionalText(160),
  phone: optionalText(40),
  addressLine: optionalText(300),
  city: optionalText(80),
  state: optionalText(80),
  postalCode: optionalText(20),
  country: optionalText(80),
})

const paymentDetailsSchema = z.object({
  accountName: optionalText(120),
  accountNumber: optionalText(80),
  ifscOrSwift: optionalText(40),
  bankName: optionalText(120),
  upiOrPaypal: optionalText(120),
})

const itemSchema = z.object({
  id: z.string().min(1).max(64),
  name: z
    .string()
    .trim()
    .min(1, "Item name is required")
    .max(200, "Item name is too long"),
  description: optionalText(500),
  quantity: z.coerce.number().min(0).max(1_000_000),
  unitPrice: z.coerce.number().min(0).max(1_000_000_000),
  discountPercent: z.coerce.number().min(0).max(100).default(0),
})

export const invoiceFormSchema = z
  .object({
    invoiceNumber: z
      .string()
      .trim()
      .max(40, "Invoice number is too long")
      .optional()
      .or(z.literal("")),

    status: z.enum(INVOICE_STATUSES).default("Draft"),
    currency: z.enum(INVOICE_CURRENCIES).default("USD"),

    issueDate: dateString,
    dueDate: dateString,

    seller: sellerSchema,
    customer: partySchema,

    shippingSameAsBilling: z.boolean().default(true),
    shipping: shippingSchema.default({
      name: "",
      phone: "",
      addressLine: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    }),

    items: z
      .array(itemSchema)
      .min(1, "Add at least one line item")
      .max(100, "You can add up to 100 line items"),

    discountType: z.enum(["none", "percent", "fixed"]).default("none"),
    discountValue: z.coerce.number().min(0).max(1_000_000_000).default(0),

    taxLabel: optionalText(30),
    taxRate: z.coerce.number().min(0).max(100).default(0),

    amountPaid: z.coerce.number().min(0).max(1_000_000_000).default(0),

    paymentDetails: paymentDetailsSchema.default({
      accountName: "",
      accountNumber: "",
      ifscOrSwift: "",
      bankName: "",
      upiOrPaypal: "",
    }),

    notes: optionalText(2000),
    terms: optionalText(2000),
  })
  .refine((data) => data.dueDate >= data.issueDate, {
    message: "Due date must be on or after the issue date",
    path: ["dueDate"],
  })
  .refine(
    (data) =>
      !data.shippingSameAsBilling ||
      (!data.shipping.name &&
        !data.shipping.addressLine &&
        !data.shipping.city),
    {
      message: "Uncheck “same as billing” to enter shipping details",
      path: ["shippingSameAsBilling"],
    }
  )
  .refine(
    (data) => data.discountType !== "percent" || data.discountValue <= 100,
    {
      message: "Percentage discount cannot exceed 100%",
      path: ["discountValue"],
    }
  )

export type InvoiceFormInput = z.input<typeof invoiceFormSchema>
export type InvoiceFormData = z.output<typeof invoiceFormSchema>
