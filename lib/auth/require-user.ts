import "server-only"

import { redirect } from "next/navigation"

import { getCurrentUserId } from "@/lib/auth/get-current-user"
import { syncUserFromInsforgeUser } from "@/lib/auth/sync-user"
import { createInsforgeServerClient } from "@/lib/insforge/server"
import { prisma } from "@/lib/db/prisma"

export async function getCurrentUser() {
  const userId = await getCurrentUserId()

  if (!userId) {
    return null
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (existingUser) {
    return existingUser
  }

  const insforge = await createInsforgeServerClient()
  const { data, error } = await insforge.auth.getCurrentUser()

  if (error || !data?.user) {
    return null
  }

  try {
    return await syncUserFromInsforgeUser(data.user)
  } catch (syncError) {
    console.error("auth.user_sync_failed_on_read", {
      userId: data.user.id,
      syncError,
    })
    return null
  }
}

export async function requireUser() {
  const user = await getCurrentUser()

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
