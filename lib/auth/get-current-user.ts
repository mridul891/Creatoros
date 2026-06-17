"use server"

import "server-only"

import { cache } from "react"

import { prisma } from "@/lib/prisma"
import { createSupabaseServerClient } from "@/lib/supabase/server-client"
import { syncUserFromSupabaseUser } from "@/lib/auth/sync-user"

export const getCurrentUser = cache(async () => {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.error("auth.get_user_failed", { error })
    return null
  }

  if (!user) {
    return null
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { supabaseUserId: user.id },
    })
    if (existingUser) {
      return existingUser
    }

    return syncUserFromSupabaseUser(user)
  } catch (error) {
    throw error
  }
})
