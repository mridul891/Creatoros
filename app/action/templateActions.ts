"use server"

import { revalidatePath } from "next/cache"

import { requireOnboardedUser } from "@/lib/auth/require-user"
import { getFieldErrors } from "@/lib/crm/shared/action"
import {
  campaignTemplateCreateUpdateSchema,
  type CampaignTemplateCreateUpdateInput,
} from "@/lib/crm/templates/templateValidation"
import {
  applyCampaignTemplate,
  createCampaignTemplate,
  deleteCampaignTemplate,
  listCampaignTemplates,
  TemplateServiceError,
  updateCampaignTemplate,
} from "@/lib/crm/templates/templateService"
import type { CampaignTemplateField, CampaignTemplateItem } from "@/types/campaignTemplate"

export type CampaignTemplateListResult =
  | {
      success: true
      data: CampaignTemplateItem[]
    }
  | {
      success: false
      message: string
    }

export type CampaignTemplateApplyResult = {
  success: boolean
  message?: string
}

export type CampaignTemplateMutationResult =
  | {
      success: true
      data: CampaignTemplateItem
      message?: string
    }
  | {
      success: false
      message: string
      fieldErrors?: Partial<Record<CampaignTemplateField, string>>
    }

export type CampaignTemplateDeleteResult = {
  success: boolean
  message?: string
  data?: {
    id: string
    name: string
  }
}

export async function listCampaignTemplatesAction(): Promise<CampaignTemplateListResult> {
  const user = await requireOnboardedUser()

  try {
    const data = await listCampaignTemplates(user.id)
    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("templates.list_failed", { userId: user.id, error })
    return {
      success: false,
      message: "Could not load campaign templates.",
    }
  }
}

export async function applyCampaignTemplateAction(dealId: string, templateId: string): Promise<CampaignTemplateApplyResult> {
  const user = await requireOnboardedUser()

  try {
    await applyCampaignTemplate(user.id, dealId, templateId)
    revalidatePath("/dashboard/deals")
    revalidatePath(`/dashboard/deals/${dealId}`)
    return {
      success: true,
      message: "Template applied successfully.",
    }
  } catch (error) {
    if (error instanceof TemplateServiceError) {
      return {
        success: false,
        message: error.message,
      }
    }
    console.error("templates.apply_failed", { userId: user.id, dealId, templateId, error })
    return {
      success: false,
      message: "Could not apply template. Please try again.",
    }
  }
}

function mapTemplateServiceError(error: unknown): CampaignTemplateMutationResult | null {
  if (!(error instanceof TemplateServiceError)) {
    return null
  }

  if (error.code === "DUPLICATE" && error.field) {
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

function parseTemplatePayload(input: unknown) {
  return campaignTemplateCreateUpdateSchema.safeParse(input)
}

export async function createCampaignTemplateAction(input: unknown): Promise<CampaignTemplateMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = parseTemplatePayload(input)

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: getFieldErrors(parsed.error),
    }
  }

  try {
    const created = await createCampaignTemplate(user.id, parsed.data)
    revalidatePath("/dashboard/templates")
    return {
      success: true,
      data: created,
      message: "Template created successfully.",
    }
  } catch (error) {
    const mappedError = mapTemplateServiceError(error)
    if (mappedError) {
      return mappedError
    }
    console.error("templates.create_failed", { userId: user.id, error })
    return {
      success: false,
      message: "Could not create template. Please try again.",
    }
  }
}

export async function updateCampaignTemplateAction(
  templateId: string,
  input: CampaignTemplateCreateUpdateInput
): Promise<CampaignTemplateMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = parseTemplatePayload(input)

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: getFieldErrors(parsed.error),
    }
  }

  try {
    const updated = await updateCampaignTemplate(user.id, templateId, parsed.data)
    revalidatePath("/dashboard/templates")
    revalidatePath("/dashboard/deals")
    return {
      success: true,
      data: updated,
      message: "Template updated successfully.",
    }
  } catch (error) {
    const mappedError = mapTemplateServiceError(error)
    if (mappedError) {
      return mappedError
    }
    console.error("templates.update_failed", { userId: user.id, templateId, error })
    return {
      success: false,
      message: "Could not update template. Please try again.",
    }
  }
}

export async function deleteCampaignTemplateAction(templateId: string): Promise<CampaignTemplateDeleteResult> {
  const user = await requireOnboardedUser()

  try {
    const deleted = await deleteCampaignTemplate(user.id, templateId)
    revalidatePath("/dashboard/templates")
    revalidatePath("/dashboard/deals")
    return {
      success: true,
      data: deleted,
      message: "Template deleted successfully.",
    }
  } catch (error) {
    if (error instanceof TemplateServiceError) {
      return {
        success: false,
        message: error.message,
      }
    }
    console.error("templates.delete_failed", { userId: user.id, templateId, error })
    return {
      success: false,
      message: "Could not delete template. Please try again.",
    }
  }
}
