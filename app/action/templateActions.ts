"use server"

import { revalidatePath } from "next/cache"

import { requireOnboardedUser } from "@/lib/auth/require-user"
import { applyCampaignTemplate, listCampaignTemplates, TemplateServiceError } from "@/lib/crm/templates/templateService"
import type { CampaignTemplateItem } from "@/types/campaignTemplate"

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
