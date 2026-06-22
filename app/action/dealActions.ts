"use server"

import { revalidatePath } from "next/cache"

import { DEAL_STAGES } from "@/enums/deal"
import { requireOnboardedUser } from "@/lib/auth/require-user"
import {
  dealArchiveSchema,
  dealCreateUpdateSchema,
  dealListSchema,
  dealPriorityUpdateSchema,
  dealRestoreSchema,
  dealStageUpdateSchema,
  dealUpdateSchema,
} from "@/lib/crm/deals/dealValidation"
import {
  archiveDeal,
  createDeal,
  DealServiceError,
  deleteDeal,
  getDeal,
  listDealFormOptions,
  listDeals,
  restoreDeal,
  updateDeal,
  updateDealPriority,
  updateDealStage,
} from "@/lib/crm/deals/dealService"
import { getFieldErrors } from "@/lib/crm/shared/action"
import { sanitizeOptionalString } from "@/lib/crm/shared/form"
import type { DealDetail, DealField, DealListData } from "@/types/deal"

export type DealMutationResult = {
  success: boolean
  message?: string
  data?: {
    id: string
    campaignName?: string
    stage?: (typeof DEAL_STAGES)[number]
    priority?: "High" | "Medium" | "Low"
  }
  fieldErrors?: Partial<Record<DealField, string>>
}

export type DealListResult = {
  success: boolean
  message?: string
  data?: DealListData
}

export type DealFormOptionsResult = {
  success: boolean
  message?: string
  data?: {
    brands: Array<{ id: string; name: string }>
    contactsByBrand: Record<string, Array<{ id: string; name: string }>>
  }
}

type DealGetResult =
  | {
      success: true
      data: DealDetail
    }
  | {
      success: false
      message: string
    }

function mapDealServiceError(error: unknown, fallbackMessage: string): DealMutationResult {
  if (error instanceof DealServiceError) {
    if (error.code === "DUPLICATE" && error.field) {
      return {
        success: false,
        message: error.message,
        fieldErrors: {
          [error.field]: error.message,
        },
      }
    }

    if (error.code === "INVALID_OPERATION" && error.field) {
      return {
        success: false,
        message: error.message,
        fieldErrors: {
          [error.field]: error.message,
        },
      }
    }

    return {
      success: false,
      message: error.message,
    }
  }

  return {
    success: false,
    message: fallbackMessage,
  }
}

function revalidateDealPaths(dealId?: string) {
  revalidatePath("/dashboard/deals")
  revalidatePath("/dashboard/brands")
  if (dealId) {
    revalidatePath(`/dashboard/deals/${dealId}`)
  }
}

function parseDealMutationFormData(formData: FormData) {
  return dealCreateUpdateSchema.safeParse({
    brandId: formData.get("brandId"),
    contactId: sanitizeOptionalString(formData.get("contactId")),
    campaignName: formData.get("campaignName"),
    dealValue: formData.get("dealValue"),
    currency: formData.get("currency"),
    stage: formData.get("stage"),
    priority: formData.get("priority"),
    startDate: sanitizeOptionalString(formData.get("startDate")),
    dueDate: sanitizeOptionalString(formData.get("dueDate")),
    expectedCloseDate: sanitizeOptionalString(formData.get("expectedCloseDate")),
    paymentDueDate: sanitizeOptionalString(formData.get("paymentDueDate")),
    paymentTerms: sanitizeOptionalString(formData.get("paymentTerms")),
    campaignDescription: sanitizeOptionalString(formData.get("campaignDescription")),
    deliverablesSummary: sanitizeOptionalString(formData.get("deliverablesSummary")),
    notes: sanitizeOptionalString(formData.get("notes")),
    source: sanitizeOptionalString(formData.get("source")),
    probability: sanitizeOptionalString(formData.get("probability")),
    externalRef: sanitizeOptionalString(formData.get("externalRef")),
  })
}

export async function listDealsAction(input?: {
  search?: string
  stage?: string
  priority?: string
  brandId?: string
  archive?: string
  sort?: string
  view?: string
  fromDate?: string
  toDate?: string
  page?: number
  pageSize?: number
}): Promise<DealListResult> {
  const user = await requireOnboardedUser()
  const parsed = dealListSchema.safeParse(input ?? {})

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid deals list request.",
    }
  }

  try {
    const data = await listDeals(user.id, parsed.data)
    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("deals.list_failed", { userId: user.id, input: parsed.data, error })
    return {
      success: false,
      message: "We could not load your deals. Please try again.",
    }
  }
}

export async function getDealAction(dealId: string): Promise<DealGetResult> {
  const user = await requireOnboardedUser()
  const parsed = dealArchiveSchema.safeParse({ dealId })

  if (!parsed.success) {
    return {
      success: false,
      message: "Deal id is invalid.",
    }
  }

  try {
    const data = await getDeal(user.id, parsed.data.dealId)
    return {
      success: true,
      data,
    }
  } catch (error) {
    if (error instanceof DealServiceError) {
      return {
        success: false,
        message: error.message,
      }
    }

    console.error("deals.get_failed", { userId: user.id, dealId: parsed.data.dealId, error })
    return {
      success: false,
      message: "We could not load this deal. Please try again.",
    }
  }
}

export async function createDealAction(formData: FormData): Promise<DealMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = parseDealMutationFormData(formData)

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: getFieldErrors(parsed.error),
    }
  }

  try {
    const data = await createDeal(user.id, parsed.data)
    revalidateDealPaths(data.id)
    return {
      success: true,
      message: "Deal created successfully.",
      data,
    }
  } catch (error) {
    console.error("deals.create_failed", { userId: user.id, error })
    return mapDealServiceError(error, "We could not create this deal. Please try again.")
  }
}

export async function updateDealAction(formData: FormData): Promise<DealMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = dealUpdateSchema.safeParse({
    dealId: formData.get("dealId"),
    brandId: formData.get("brandId"),
    contactId: sanitizeOptionalString(formData.get("contactId")),
    campaignName: formData.get("campaignName"),
    dealValue: formData.get("dealValue"),
    currency: formData.get("currency"),
    stage: formData.get("stage"),
    priority: formData.get("priority"),
    startDate: sanitizeOptionalString(formData.get("startDate")),
    dueDate: sanitizeOptionalString(formData.get("dueDate")),
    expectedCloseDate: sanitizeOptionalString(formData.get("expectedCloseDate")),
    paymentDueDate: sanitizeOptionalString(formData.get("paymentDueDate")),
    paymentTerms: sanitizeOptionalString(formData.get("paymentTerms")),
    campaignDescription: sanitizeOptionalString(formData.get("campaignDescription")),
    deliverablesSummary: sanitizeOptionalString(formData.get("deliverablesSummary")),
    notes: sanitizeOptionalString(formData.get("notes")),
    source: sanitizeOptionalString(formData.get("source")),
    probability: sanitizeOptionalString(formData.get("probability")),
    externalRef: sanitizeOptionalString(formData.get("externalRef")),
  })

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: getFieldErrors(parsed.error),
    }
  }

  try {
    const { dealId, ...payload } = parsed.data
    const data = await updateDeal(user.id, dealId, payload)
    revalidateDealPaths(dealId)
    return {
      success: true,
      message: "Deal updated successfully.",
      data,
    }
  } catch (error) {
    console.error("deals.update_failed", { userId: user.id, dealId: parsed.data.dealId, error })
    return mapDealServiceError(error, "We could not update this deal. Please try again.")
  }
}

export async function updateDealStageAction(dealId: string, stage: string): Promise<DealMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = dealStageUpdateSchema.safeParse({ dealId, stage })

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid stage update request.",
    }
  }

  try {
    const data = await updateDealStage(user.id, parsed.data.dealId, parsed.data.stage)
    revalidateDealPaths(parsed.data.dealId)
    return {
      success: true,
      message: "Deal stage updated.",
      data,
    }
  } catch (error) {
    console.error("deals.stage_update_failed", { userId: user.id, dealId: parsed.data.dealId, stage: parsed.data.stage, error })
    return mapDealServiceError(error, "We could not update this deal stage. Please try again.")
  }
}

export async function updateDealPriorityAction(dealId: string, priority: string): Promise<DealMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = dealPriorityUpdateSchema.safeParse({ dealId, priority })

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid priority update request.",
    }
  }

  try {
    const data = await updateDealPriority(user.id, parsed.data.dealId, parsed.data.priority)
    revalidateDealPaths(parsed.data.dealId)
    return {
      success: true,
      message: "Deal priority updated.",
      data,
    }
  } catch (error) {
    console.error("deals.priority_update_failed", {
      userId: user.id,
      dealId: parsed.data.dealId,
      priority: parsed.data.priority,
      error,
    })
    return mapDealServiceError(error, "We could not update this deal priority. Please try again.")
  }
}

export async function archiveDealAction(dealId: string): Promise<DealMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = dealArchiveSchema.safeParse({ dealId })
  if (!parsed.success) {
    return {
      success: false,
      message: "Deal id is invalid.",
    }
  }

  try {
    await archiveDeal(user.id, parsed.data.dealId)
    revalidateDealPaths(parsed.data.dealId)
    return {
      success: true,
      message: "Deal archived successfully.",
    }
  } catch (error) {
    console.error("deals.archive_failed", { userId: user.id, dealId: parsed.data.dealId, error })
    return mapDealServiceError(error, "We could not archive this deal. Please try again.")
  }
}

export async function restoreDealAction(dealId: string): Promise<DealMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = dealRestoreSchema.safeParse({ dealId })
  if (!parsed.success) {
    return {
      success: false,
      message: "Deal id is invalid.",
    }
  }

  try {
    await restoreDeal(user.id, parsed.data.dealId)
    revalidateDealPaths(parsed.data.dealId)
    return {
      success: true,
      message: "Deal restored successfully.",
    }
  } catch (error) {
    console.error("deals.restore_failed", { userId: user.id, dealId: parsed.data.dealId, error })
    return mapDealServiceError(error, "We could not restore this deal. Please try again.")
  }
}

export async function deleteDealAction(dealId: string): Promise<DealMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = dealArchiveSchema.safeParse({ dealId })
  if (!parsed.success) {
    return {
      success: false,
      message: "Deal id is invalid.",
    }
  }

  try {
    await deleteDeal(user.id, parsed.data.dealId)
    revalidateDealPaths(parsed.data.dealId)
    return {
      success: true,
      message: "Deal deleted successfully.",
    }
  } catch (error) {
    console.error("deals.delete_failed", { userId: user.id, dealId: parsed.data.dealId, error })
    return mapDealServiceError(error, "We could not delete this deal. Please try again.")
  }
}

export async function listDealFormOptionsAction(): Promise<DealFormOptionsResult> {
  const user = await requireOnboardedUser()

  try {
    const data = await listDealFormOptions(user.id)
    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("deals.form_options_failed", { userId: user.id, error })
    return {
      success: false,
      message: "We could not load deal form options.",
    }
  }
}
