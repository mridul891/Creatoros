"use server"

import "server-only"

import { redirect } from "next/navigation"

import { prisma } from "@/lib/db/prisma"
import { getCurrentUserId } from "@/lib/auth/get-current-user"

export async function getCurrentUser() {
  const userId = await getCurrentUserId()

  if (!userId) {
    return null
  }

  return prisma.user.findUnique({
    where: {
      id: userId,
    },
  })
}

export async function requireUser() {
  const user = await getCurrentUser()

  console.log("userId", user?.id)

  if (!user) {
    redirect("/login")
  }

  console.log("found user", user)

  return user
}

export async function requireOnboardedUser() {
  const user = await requireUser()

  if (!user.isOnboardingComplete) {
    redirect("/onboarding")
  }

  return user
}