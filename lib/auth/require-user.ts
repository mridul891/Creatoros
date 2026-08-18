"use server"

import "server-only"

import { redirect } from "next/navigation"

import { prisma } from "@/lib/db/prisma"
import { getCurrentUserId } from "@/lib/auth/get-current-user"

export async function requireUser() {
  const userId = await getCurrentUserId()

  console.log("userId", userId)

  if (!userId) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  console.log("found user", user)
  if (!user) {
    redirect("/login")
  }

  return user
}

export async function requireOnboardedUser() {
  const user = await requireUser()

  if (!user.isOnboardingComplete) {
    redirect("/onboarding")
  }

  return user
}