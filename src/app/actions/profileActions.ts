"use server"

import { revalidatePath } from "next/cache"
import { requireUser } from "@/lib/auth/require-user"
import { prisma } from "@/lib/db/prisma"
import { getFieldErrors } from "@/lib/utils/form-errors"
import { updateProfileSchema } from "@/schemas/profile"

export type UpdateProfileResult =
  | { status: "success" }
  | {
      status: "error"
      message: string
      fieldErrors?: Partial<Record<string, string>>
    }

export async function updateProfileAction(
  input: unknown
): Promise<UpdateProfileResult> {
  const user = await requireUser()

  const parsed = updateProfileSchema.safeParse(input)

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      fieldErrors: getFieldErrors<string>(parsed.error),
    }
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: parsed.data.name,
        avatarUrl: parsed.data.avatarUrl ? parsed.data.avatarUrl : null,
      },
    })

    revalidatePath("/profile")
    revalidatePath("/dashboard/invoice")
    revalidatePath("/dashboard/media-kit")

    return { status: "success" }
  } catch (error) {
    console.error("profile.update_failed", { userId: user.id, error })

    return {
      status: "error",
      message: "We could not update your profile right now. Please try again.",
    }
  }
}
