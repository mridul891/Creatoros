import { z } from "zod"

import { DEAL_ARCHIVE_FILTERS, DEAL_PRIORITIES, DEAL_SORT_OPTIONS, DEAL_STAGES, DEAL_VIEW_MODES } from "@/enums/deal"

const stringDateToDate = z.preprocess((value) => {
  if (value instanceof Date) {
    return value
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    return undefined
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return undefined
  }
  return date
}, z.date().optional())

const valueSchema = z.coerce.number().positive("Deal value must be greater than 0.").max(99_999_999, "Deal value is too high.")

export const dealCreateUpdateSchema = z
  .object({
    brandId: z.uuid("Brand id is invalid."),
    contactId: z.uuid("Contact id is invalid.").optional(),
    campaignName: z
      .string()
      .trim()
      .min(2, "Campaign name must be at least 2 characters.")
      .max(160, "Campaign name cannot exceed 160 characters."),
    dealValue: valueSchema,
    currency: z.string().trim().toUpperCase().length(3, "Currency must be a 3-letter code."),
    stage: z.enum(DEAL_STAGES),
    priority: z.enum(DEAL_PRIORITIES),
    startDate: stringDateToDate,
    dueDate: stringDateToDate,
    expectedCloseDate: stringDateToDate,
    paymentDueDate: stringDateToDate,
    paymentTerms: z.string().trim().max(1000, "Payment terms cannot exceed 1000 characters.").optional(),
    campaignDescription: z.string().trim().max(5000, "Description cannot exceed 5000 characters.").optional(),
    deliverablesSummary: z.string().trim().max(5000, "Deliverables cannot exceed 5000 characters.").optional(),
    notes: z.string().trim().max(5000, "Notes cannot exceed 5000 characters.").optional(),
    source: z.string().trim().max(120, "Source cannot exceed 120 characters.").optional(),
    probability: z.coerce.number().int().min(0).max(100).optional(),
    externalRef: z.string().trim().max(255).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.startDate && value.dueDate && value.startDate > value.dueDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dueDate"],
        message: "Due date must be after start date.",
      })
    }

    if (value.expectedCloseDate && value.startDate && value.expectedCloseDate < value.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expectedCloseDate"],
        message: "Expected close date must be after start date.",
      })
    }
  })

export const dealListSchema = z.object({
  search: z.string().trim().max(120).optional(),
  stage: z.enum(DEAL_STAGES).optional(),
  priority: z.enum(DEAL_PRIORITIES).optional(),
  brandId: z.uuid().optional(),
  archive: z.enum(DEAL_ARCHIVE_FILTERS).default("active"),
  sort: z.enum(DEAL_SORT_OPTIONS).default("updatedAt"),
  view: z.enum(DEAL_VIEW_MODES).default("table"),
  fromDate: z.string().date().optional(),
  toDate: z.string().date().optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
})

export const dealStageUpdateSchema = z.object({
  dealId: z.uuid("Deal id is invalid."),
  stage: z.enum(DEAL_STAGES),
})

export const dealPriorityUpdateSchema = z.object({
  dealId: z.uuid("Deal id is invalid."),
  priority: z.enum(DEAL_PRIORITIES),
})

export const dealArchiveSchema = z.object({
  dealId: z.uuid("Deal id is invalid."),
})

export const dealRestoreSchema = z.object({
  dealId: z.uuid("Deal id is invalid."),
})

export type DealCreateUpdateInput = z.infer<typeof dealCreateUpdateSchema>
export type DealListInput = z.infer<typeof dealListSchema>
export type DealStageUpdateInput = z.infer<typeof dealStageUpdateSchema>
export type DealPriorityUpdateInput = z.infer<typeof dealPriorityUpdateSchema>

export function normalizeCampaignName(name: string) {
  return name.toLowerCase().replace(/\s+/g, " ").trim()
}

export function normalizeCurrency(currency: string) {
  return currency.trim().toUpperCase()
}
