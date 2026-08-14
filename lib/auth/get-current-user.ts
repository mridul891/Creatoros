"use server"

import "server-only"

import { cache } from "react"
import { syncUserFromInsforgeUser } from "@/lib/auth/sync-user"
import { prisma } from "@/lib/db/prisma"
import { createInsforgeServerClient } from "@/lib/insforge/server"

export const getCurrentUser = cache(async () => {
  const insforge = await createInsforgeServerClient()
  const { data, error } = await insforge.auth.getCurrentUser()

  if (error) {
    console.error("auth.get_user_failed", { error })
    return null
  }

  const user = data?.user
  if (!user) {
    return null
  }
  const existingUser = await prisma.user.findUnique({
    where: { id: user.id },
  })
  if (existingUser) {
    return existingUser
  }

  return syncUserFromInsforgeUser(user)
})
