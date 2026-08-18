"use server"

import { z } from "zod"
import { CREATOR_TYPES } from "@/features/onboarding/enums/creators"
import {
  getCreatorForUser,
  upsertCreatorAndCompleteOnboarding,
} from "@/features/onboarding/services/creatorService"
import { requireUser } from "@/lib/auth/require-user"
import { sanitizeOptionalString } from "@/lib/utils/form"
import { getFieldErrors } from "@/lib/utils/form-errors"
import { getCurrentUserId } from "@/lib/auth/get-current-user"

const HANDLE_REGEX = /^[A-Za-z0-9._]{1,30}$/

const creatorOnboardingSchema = z.object({
  creatorType: z.enum(CREATOR_TYPES),
  niche: z
    .string()
    .trim()
    .min(2, "Please enter your niche.")
    .max(80, "Niche cannot exceed 80 characters."),
  instagramHandle: z
    .string()
    .trim()
    .max(30, "Instagram handle cannot exceed 30 characters.")
    .optional()
    .refine((value) => !value || HANDLE_REGEX.test(value), {
      message: "Instagram handle can only include letters, numbers, . and _",
    }),
  youtubeHandle: z
    .string()
    .trim()
    .max(30, "YouTube handle cannot exceed 30 characters.")
    .optional()
    .refine((value) => !value || HANDLE_REGEX.test(value), {
      message: "YouTube handle can only include letters, numbers, . and _",
    }),
  bio: z
    .string()
    .trim()
    .max(280, "Bio cannot exceed 280 characters.")
    .optional(),
})

type CreatorOnboardingField =
  | "creatorType"
  | "niche"
  | "instagramHandle"
  | "youtubeHandle"
  | "bio"

export type CreatorOnboardingResult = {
  success: boolean
  message?: string
  fieldErrors?: Partial<Record<CreatorOnboardingField, string>>
}

function normalizeHandle(value: string | undefined) {
  if (!value) {
    return undefined
  }

  return value.replace(/^@+/, "")
}

export async function getCreatorForOnboarding() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return null
  }
  return getCreatorForUser(userId)
}

export async function saveCreatorOnboarding(
  formData: FormData
): Promise<CreatorOnboardingResult> {
  const parsed = creatorOnboardingSchema.safeParse({
    creatorType: formData.get("creatorType"),
    niche: formData.get("niche"),
    instagramHandle: normalizeHandle(
      sanitizeOptionalString(formData.get("instagramHandle"))
    ),
    youtubeHandle: normalizeHandle(
      sanitizeOptionalString(formData.get("youtubeHandle"))
    ),
    bio: sanitizeOptionalString(formData.get("bio")),
  })

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: getFieldErrors<CreatorOnboardingField>(parsed.error),
    }
  }

  const user = await requireUser()

  try {
    await upsertCreatorAndCompleteOnboarding(user.id, parsed.data)

    return {
      success: true,
      message: "Onboarding complete. Redirecting to your dashboard.",
    }
  } catch (error) {
    console.error("creator.onboarding_save_failed", {
      userId: user.id,
      error,
    })

    return {
      success: false,
      message: "We could not save your profile. Please try again.",
    }
  }
}
