"use server"

import "server-only"

import type { User as SupabaseUser } from "@supabase/supabase-js"

import { prisma } from "@/lib/prisma"

function getDisplayName(user: SupabaseUser) {
  const metadata = user.user_metadata ?? {}
  const rawName = metadata.full_name ?? metadata.name
  return typeof rawName === "string" && rawName.trim().length > 0 ? rawName.trim() : null
}

function getAvatarUrl(user: SupabaseUser) {
  const metadata = user.user_metadata ?? {}
  const rawAvatar = metadata.avatar_url ?? metadata.picture
  return typeof rawAvatar === "string" && rawAvatar.length > 0 ? rawAvatar : null
}

export async function syncUserFromSupabaseUser(user: SupabaseUser) {
  if (!user.id) {
    throw new Error("Authenticated Supabase user is missing id")
  }
  if (!user.email) {
    throw new Error("Authenticated Supabase user is missing email")
  }

  try {
    return await prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        name: getDisplayName(user),
        avatarUrl: getAvatarUrl(user),
        lastSignInAt: new Date(),
      },
      create: {
        id: user.id,
        email: user.email,
        name: getDisplayName(user),
        avatarUrl: getAvatarUrl(user),
        lastSignInAt: new Date(),
      },
    })
  } catch (error) {

    console.error("auth.user_sync_failed", {
      userId: user.id,
      email: user.email,
      error,
    })
    throw error
  }
}
