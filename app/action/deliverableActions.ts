"use server"

import { revalidatePath } from "next/cache"

import { requireOnboardedUser } from "@/lib/auth/require-user"
import { getFieldErrors } from "@/lib/crm/shared/action"
import { sanitizeOptionalString } from "@/lib/crm/shared/form"
import {
  deliverableArchiveSchema,
  deliverableCreateSchema,
  deliverableDeleteSchema,
  deliverableListSchema,
  deliverableRestoreSchema,
  deliverableUpdateSchema,
} from "@/lib/crm/deliverables/deliverableValidation"
import {
  archiveDeliverable,
  createDeliverable,
  deleteDeliverable,
  DeliverableServiceError,
  getDeliverable,
  listDealDeliverables,
  restoreDeliverable,
  updateDeliverable,
} from "@/lib/crm/deliverables/deliverableService"
import type { DeliverableDetail, DeliverableField, DeliverableListData } from "@/types/deliverable"

export type DeliverableMutationResult = {
  success: boolean
  message?: string
  data?: {
    id: string
  }
  fieldErrors?: Partial<Record<DeliverableField, string>>
}

type DeliverableGetResult =
  | {
      success: true
      data: DeliverableDetail
    }
  | {
      success: false
      message: string
    }

export type DeliverableListResult = {
  success: boolean
  message?: string
  data?: DeliverableListData
}

function revalidateDeliverablePaths(dealId?: string) {
  revalidatePath("/dashboard/deals")
  if (dealId) {
    revalidatePath(`/dashboard/deals/${dealId}`)
  }
}

function mapDeliverableServiceError(error: unknown, fallbackMessage: string): DeliverableMutationResult {
  if (error instanceof DeliverableServiceError) {
    if ((error.code === "DUPLICATE" || error.code === "INVALID_OPERATION") && error.field) {
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

function parseDeliverableMutationFormData(formData: FormData) {
  return deliverableCreateSchema.safeParse({
    dealId: formData.get("dealId"),
    platform: formData.get("platform"),
    deliverableType: formData.get("deliverableType"),
    dueDate: sanitizeOptionalString(formData.get("dueDate")),
    status: formData.get("status"),
    approvalStatus: formData.get("approvalStatus"),
    submissionUrl: sanitizeOptionalString(formData.get("submissionUrl")),
    publishedUrl: sanitizeOptionalString(formData.get("publishedUrl")),
    internalNotes: sanitizeOptionalString(formData.get("internalNotes")),
    brandNotes: sanitizeOptionalString(formData.get("brandNotes")),
    revisionCount: sanitizeOptionalString(formData.get("revisionCount")),
    orderIndex: sanitizeOptionalString(formData.get("orderIndex")),
  })
}

export async function listDealDeliverablesAction(input: {
  dealId: string
  search?: string
  status?: string
  platform?: string
  archive?: string
  sort?: string
  page?: number
  pageSize?: number
}): Promise<DeliverableListResult> {
  const user = await requireOnboardedUser()
  const parsed = deliverableListSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid deliverables list request.",
    }
  }

  try {
    const data = await listDealDeliverables(user.id, parsed.data)
    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("deliverables.list_failed", { userId: user.id, input: parsed.data, error })
    return {
      success: false,
      message: "We could not load deliverables. Please try again.",
    }
  }
}

export async function getDeliverableAction(deliverableId: string): Promise<DeliverableGetResult> {
  const user = await requireOnboardedUser()
  const parsed = deliverableArchiveSchema.safeParse({ deliverableId })
  if (!parsed.success) {
    return {
      success: false,
      message: "Deliverable id is invalid.",
    }
  }

  try {
    const data = await getDeliverable(user.id, parsed.data.deliverableId)
    return {
      success: true,
      data,
    }
  } catch (error) {
    if (error instanceof DeliverableServiceError) {
      return {
        success: false,
        message: error.message,
      }
    }
    console.error("deliverables.get_failed", { userId: user.id, deliverableId: parsed.data.deliverableId, error })
    return {
      success: false,
      message: "We could not load this deliverable. Please try again.",
    }
  }
}

export async function createDeliverableAction(formData: FormData): Promise<DeliverableMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = parseDeliverableMutationFormData(formData)

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: getFieldErrors(parsed.error),
    }
  }

  try {
    const data = await createDeliverable(user.id, parsed.data)
    revalidateDeliverablePaths(data.dealId)
    return {
      success: true,
      message: "Deliverable created successfully.",
      data: { id: data.id },
    }
  } catch (error) {
    console.error("deliverables.create_failed", { userId: user.id, error })
    return mapDeliverableServiceError(error, "We could not create this deliverable. Please try again.")
  }
}

export async function updateDeliverableAction(formData: FormData): Promise<DeliverableMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = deliverableUpdateSchema.safeParse({
    deliverableId: formData.get("deliverableId"),
    dealId: formData.get("dealId"),
    platform: formData.get("platform"),
    deliverableType: formData.get("deliverableType"),
    dueDate: sanitizeOptionalString(formData.get("dueDate")),
    status: formData.get("status"),
    approvalStatus: formData.get("approvalStatus"),
    submissionUrl: sanitizeOptionalString(formData.get("submissionUrl")),
    publishedUrl: sanitizeOptionalString(formData.get("publishedUrl")),
    internalNotes: sanitizeOptionalString(formData.get("internalNotes")),
    brandNotes: sanitizeOptionalString(formData.get("brandNotes")),
    revisionCount: sanitizeOptionalString(formData.get("revisionCount")),
    orderIndex: sanitizeOptionalString(formData.get("orderIndex")),
  })

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: getFieldErrors(parsed.error),
    }
  }

  try {
    const data = await updateDeliverable(user.id, parsed.data.deliverableId, parsed.data)
    revalidateDeliverablePaths(data.dealId)
    return {
      success: true,
      message: "Deliverable updated successfully.",
      data: { id: data.id },
    }
  } catch (error) {
    console.error("deliverables.update_failed", { userId: user.id, deliverableId: parsed.data.deliverableId, error })
    return mapDeliverableServiceError(error, "We could not update this deliverable. Please try again.")
  }
}

export async function archiveDeliverableAction(deliverableId: string): Promise<DeliverableMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = deliverableArchiveSchema.safeParse({ deliverableId })
  if (!parsed.success) {
    return {
      success: false,
      message: "Deliverable id is invalid.",
    }
  }

  try {
    const data = await archiveDeliverable(user.id, parsed.data.deliverableId)
    revalidateDeliverablePaths(data.dealId)
    return {
      success: true,
      message: "Deliverable archived successfully.",
      data: { id: data.id },
    }
  } catch (error) {
    console.error("deliverables.archive_failed", { userId: user.id, deliverableId: parsed.data.deliverableId, error })
    return mapDeliverableServiceError(error, "We could not archive this deliverable. Please try again.")
  }
}

export async function restoreDeliverableAction(deliverableId: string): Promise<DeliverableMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = deliverableRestoreSchema.safeParse({ deliverableId })
  if (!parsed.success) {
    return {
      success: false,
      message: "Deliverable id is invalid.",
    }
  }

  try {
    const data = await restoreDeliverable(user.id, parsed.data.deliverableId)
    revalidateDeliverablePaths(data.dealId)
    return {
      success: true,
      message: "Deliverable restored successfully.",
      data: { id: data.id },
    }
  } catch (error) {
    console.error("deliverables.restore_failed", { userId: user.id, deliverableId: parsed.data.deliverableId, error })
    return mapDeliverableServiceError(error, "We could not restore this deliverable. Please try again.")
  }
}

export async function deleteDeliverableAction(deliverableId: string): Promise<DeliverableMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = deliverableDeleteSchema.safeParse({ deliverableId })
  if (!parsed.success) {
    return {
      success: false,
      message: "Deliverable id is invalid.",
    }
  }

  try {
    const data = await deleteDeliverable(user.id, parsed.data.deliverableId)
    revalidateDeliverablePaths(data.dealId)
    return {
      success: true,
      message: "Deliverable deleted successfully.",
      data: { id: data.id },
    }
  } catch (error) {
    console.error("deliverables.delete_failed", { userId: user.id, deliverableId: parsed.data.deliverableId, error })
    return mapDeliverableServiceError(error, "We could not delete this deliverable. Please try again.")
  }
}
