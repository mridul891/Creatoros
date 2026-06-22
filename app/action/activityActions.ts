"use server"

import { requireOnboardedUser } from "@/lib/auth/require-user"
import {
  ActivityServiceError,
  listActivitiesByDeal,
  listActivitiesByBrand,
} from "@/lib/crm/activity/activityService"
import { activityDealListSchema, activityListSchema } from "@/lib/crm/activity/activityValidation"
import type { ActivityListData } from "@/types/activity"

export type ActivityListResult = {
  success: boolean
  message?: string
  data?: ActivityListData
}

export async function listBrandActivitiesAction(input: {
  brandId: string
  page?: number
  pageSize?: number
}): Promise<ActivityListResult> {
  const user = await requireOnboardedUser()
  const parsed = activityListSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid list activities request.",
    }
  }

  try {
    const data = await listActivitiesByBrand(user.id, parsed.data)
    return {
      success: true,
      data,
    }
  } catch (error) {
    if (error instanceof ActivityServiceError) {
      return {
        success: false,
        message: error.message,
      }
    }

    console.error("activities.list_failed", { userId: user.id, input: parsed.data, error })
    return {
      success: false,
      message: "We could not load activities. Please try again.",
    }
  }
}

export async function listDealActivitiesAction(input: {
  dealId: string
  page?: number
  pageSize?: number
}): Promise<ActivityListResult> {
  const user = await requireOnboardedUser()
  const parsed = activityDealListSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid list activities request.",
    }
  }

  try {
    const data = await listActivitiesByDeal(user.id, parsed.data)
    return {
      success: true,
      data,
    }
  } catch (error) {
    if (error instanceof ActivityServiceError) {
      return {
        success: false,
        message: error.message,
      }
    }

    console.error("activities.list_deal_failed", { userId: user.id, input: parsed.data, error })
    return {
      success: false,
      message: "We could not load activities. Please try again.",
    }
  }
}
