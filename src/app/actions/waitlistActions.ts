"use server"

import { Prisma } from "@prisma/client"
import { z } from "zod"

import { prisma } from "@/lib/db/prisma"

const waitlistSchema = z.object({
  email: z.email("Enter a valid email address").max(254),
  name: z.string().trim().max(120).optional(),
})

export async function joinWaitlist(formData: FormData) {
  const parsed = waitlistSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name") ?? undefined,
  })

  if (!parsed.success) {
    return {
      success: false,
      message: "Please enter a valid email address.",
    }
  }

  try {
    await prisma.waitlistEntry.create({
      data: {
        email: parsed.data.email.toLowerCase(),
        name: parsed.data.name || null,
      },
    })

    return {
      success: true,
      message: "You're on the waitlist",
    }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "You're already on the waitlist.",
      }
    }

    console.error("waitlist.join_failed", { error })
    return {
      success: false,
      message: "Something went wrong.",
    }
  }
}
