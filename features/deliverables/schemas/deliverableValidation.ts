import { z } from "zod"

import {
  DELIVERABLE_APPROVAL_STATUSES,
  DELIVERABLE_DEFAULT_PLATFORMS,
  DELIVERABLE_DEFAULT_TYPES,
  DELIVERABLE_STATUSES,
} from "@/features/deliverables/enums/deliverable"
import type { DeliverableField } from "@/features/deliverables/types/deliverable"
import type { DeliverableFormValues } from "@/features/deliverables/utils/deliverableForm"
import { parseDateOnlyInput } from "@/lib/formatting/date-input"
import { getFieldErrors } from "@/lib/utils/form-errors"

const stringDateToDate = z.preprocess((value) => {
  if (value instanceof Date) {
    return value
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    return undefined
  }

  const date = parseDateOnlyInput(value)
  if (!date || Number.isNaN(date.getTime())) {
    return undefined
  }

  return date
}, z.date().optional())

const urlField = z.string().trim().url("Please enter a valid URL.").optional()

const deliverableBaseSchema = z.object({
  dealId: z.uuid("Deal id is invalid."),
  platform: z
    .string()
    .trim()
    .min(2, "Platform is required.")
    .max(80, "Platform cannot exceed 80 characters."),
  deliverableType: z
    .string()
    .trim()
    .min(2, "Deliverable type is required.")
    .max(120, "Deliverable type cannot exceed 120 characters."),
  dueDate: stringDateToDate,
  status: z.enum(DELIVERABLE_STATUSES),
  approvalStatus: z.enum(DELIVERABLE_APPROVAL_STATUSES),
  submissionUrl: urlField,
  publishedUrl: urlField,
  internalNotes: z
    .string()
    .trim()
    .max(5000, "Internal notes cannot exceed 5000 characters.")
    .optional(),
  brandNotes: z
    .string()
    .trim()
    .max(5000, "Brand notes cannot exceed 5000 characters.")
    .optional(),
  revisionCount: z.coerce.number().int().nonnegative().max(1000),
  orderIndex: z.coerce.number().int().nonnegative().optional(),
})

export const deliverableCreateSchema = deliverableBaseSchema
export const deliverableUpdateSchema = deliverableBaseSchema.extend({
  deliverableId: z.uuid("Deliverable id is invalid."),
})

export const deliverableListSchema = z.object({
  dealId: z.uuid("Deal id is invalid."),
  search: z.string().trim().max(120).optional(),
  status: z.enum(DELIVERABLE_STATUSES).optional(),
  platform: z.string().trim().max(80).optional(),
  archive: z.enum(["active", "archived"]).default("active"),
  sort: z.enum(["order", "dueDate", "updatedAt", "status"]).default("order"),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
})

export const deliverableArchiveSchema = z.object({
  deliverableId: z.uuid("Deliverable id is invalid."),
})

export const deliverableRestoreSchema = deliverableArchiveSchema
export const deliverableDeleteSchema = deliverableArchiveSchema

export type DeliverableCreateInput = z.infer<typeof deliverableCreateSchema>
export type DeliverableUpdateInput = z.infer<typeof deliverableUpdateSchema>
export type DeliverableListInput = z.infer<typeof deliverableListSchema>

export function normalizeDeliverableType(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim()
}

function toOptionalString(value: string) {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

export function getDeliverableFormFieldErrors(
  values: DeliverableFormValues
): Partial<Record<DeliverableField, string>> {
  const parsed = deliverableCreateSchema.safeParse({
    dealId: values.dealId,
    platform: values.platform,
    deliverableType: values.deliverableType,
    dueDate: toOptionalString(values.dueDate),
    status: values.status,
    approvalStatus: values.approvalStatus,
    submissionUrl: toOptionalString(values.submissionUrl),
    publishedUrl: toOptionalString(values.publishedUrl),
    internalNotes: toOptionalString(values.internalNotes),
    brandNotes: toOptionalString(values.brandNotes),
    revisionCount: toOptionalString(values.revisionCount),
    orderIndex: toOptionalString(values.orderIndex),
  })

  if (parsed.success) {
    return {}
  }

  return getFieldErrors<DeliverableField>(parsed.error)
}

export const DELIVERABLE_PLATFORM_SUGGESTIONS = [
  ...DELIVERABLE_DEFAULT_PLATFORMS,
]
export const DELIVERABLE_TYPE_SUGGESTIONS = [...DELIVERABLE_DEFAULT_TYPES]
