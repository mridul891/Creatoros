"use server"

import "server-only"

import { cache } from "react"
import { createInsforgeServerClient } from "@/lib/insforge/server"

export const getCurrentUserId = cache(async () => {
  const insforge = await createInsforgeServerClient()

  const { data, error } = await insforge.auth.getCurrentUser()

  if (error || !data?.user) {
    return null
  }

  return data.user.id
})