"use server"

import { requireOnboardedUser } from "@/lib/auth/require-user"
import {
  type CommandCenterData,
  getCommandCenterData,
} from "@/lib/crm/dashboard/commandCenterService"

export type CommandCenterResult =
  | {
      success: true
      data: CommandCenterData
    }
  | {
      success: false
      message: string
    }

export async function getCommandCenterAction(): Promise<CommandCenterResult> {
  const user = await requireOnboardedUser()

  try {
    const data = await getCommandCenterData(user.id)
    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("dashboard.command_center_failed", { userId: user.id, error })
    return {
      success: false,
      message: "We could not load your command center. Please refresh.",
    }
  }
}
