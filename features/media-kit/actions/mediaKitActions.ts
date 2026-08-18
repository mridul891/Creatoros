"use server"

import { revalidatePath } from "next/cache"

import {
  deleteMediaKitForUser,
  getMediaKitForUser,
  MediaKitServiceError,
  upsertMediaKit,
} from "@/features/media-kit/services/mediaKitService"
import {
  mediaKitFormSchema,
  type MediaKitFormData,
} from "@/features/media-kit/schema"
import { requireOnboardedUser } from "@/lib/auth/require-user"

export type MediaKitMutationResult = {
  success: boolean
  message?: string
  data?: {
    id: string
    updatedAt: Date
  }
  fieldErrors?: Record<string, string[] | undefined>
}

export type MediaKitGetResult =
  | {
      success: true
      data: MediaKitFormData | null
    }
  | {
      success: false
      message: string
    }

function mapMediaKitServiceError(error: unknown): MediaKitMutationResult | null {
  if (!(error instanceof MediaKitServiceError)) {
    return null
  }

  return {
    success: false,
    message: error.message,
  }
}

function revalidateMediaKitPath() {
  revalidatePath("/dashboard/media-kit")
}

export async function getMediaKitAction(): Promise<MediaKitGetResult> {
  const user = await requireOnboardedUser()

  try {
    const data = await getMediaKitForUser(user.id)
    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("media_kit.get_failed", { userId: user.id, error })
    return {
      success: false,
      message: "We could not load your media kit. Please try again.",
    }
  }
}

export async function saveMediaKitAction(
  input: unknown
): Promise<MediaKitMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = mediaKitFormSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    const saved = await upsertMediaKit(user.id, parsed.data)

    revalidateMediaKitPath()

    return {
      success: true,
      message: "Media kit saved successfully.",
      data: {
        id: saved.id,
        updatedAt: saved.updatedAt,
      },
    }
  } catch (error) {
    const mappedError = mapMediaKitServiceError(error)
    if (mappedError) {
      return mappedError
    }

    console.error("media_kit.save_failed", { userId: user.id, error })
    return {
      success: false,
      message: "We could not save your media kit. Please try again.",
    }
  }
}

export async function deleteMediaKitAction(): Promise<MediaKitMutationResult> {
  const user = await requireOnboardedUser()

  try {
    const deleted = await deleteMediaKitForUser(user.id)

    if (!deleted) {
      return {
        success: false,
        message: "Media kit not found.",
      }
    }

    revalidateMediaKitPath()

    return {
      success: true,
      message: "Media kit deleted successfully.",
    }
  } catch (error) {
    const mappedError = mapMediaKitServiceError(error)
    if (mappedError) {
      return mappedError
    }

    console.error("media_kit.delete_failed", { userId: user.id, error })
    return {
      success: false,
      message: "We could not delete your media kit. Please try again.",
    }
  }
}
