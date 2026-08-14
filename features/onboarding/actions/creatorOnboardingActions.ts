"use server"

import { z } from "zod"
import { CREATOR_TYPES } from "@/features/onboarding/enums/creators"
import { requireUser } from "@/lib/auth/require-user"
import { prisma } from "@/lib/db/prisma"

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

function sanitizeOptionalString(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return undefined
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function normalizeHandle(value: string | undefined) {
  if (!value) {
    return undefined
  }

  return value.replace(/^@+/, "")
}

function getFieldErrors(
  error: z.ZodError
): Partial<Record<CreatorOnboardingField, string>> {
  const fields: Partial<Record<CreatorOnboardingField, string>> = {}
  for (const issue of error.issues) {
    const path = issue.path[0]
    if (typeof path !== "string") {
      continue
    }

    const field = path as CreatorOnboardingField
    if (fields[field]) {
      continue
    }

    fields[field] = issue.message
  }

  return fields
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
      fieldErrors: getFieldErrors(parsed.error),
    }
  }

  const user = await requireUser()

  try {
    await prisma.$transaction([
      prisma.creator.upsert({
        where: { userId: user.id },
        update: {
          creatorType: parsed.data.creatorType,
          niche: parsed.data.niche,
          instagramHandle: parsed.data.instagramHandle ?? null,
          youtubeHandle: parsed.data.youtubeHandle ?? null,
          bio: parsed.data.bio ?? null,
        },
        create: {
          id: user.id,
          userId: user.id,
          creatorType: parsed.data.creatorType,
          niche: parsed.data.niche,
          instagramHandle: parsed.data.instagramHandle ?? null,
          youtubeHandle: parsed.data.youtubeHandle ?? null,
          bio: parsed.data.bio ?? null,
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          isOnboardingComplete: true,
        },
      }),
    ])

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
