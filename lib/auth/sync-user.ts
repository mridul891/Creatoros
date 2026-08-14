"use server"

import "server-only"

import { prisma } from "@/lib/db/prisma"

interface InsforgeUser {
  id: string
  email?: string | null
  profile?: {
    name?: string | null
    avatar_url?: string | null
    full_name?: string | null
    picture?: string | null
  } | null
}

function getDisplayName(user: InsforgeUser) {
  const profile = user.profile ?? {}
  const rawName = profile.full_name ?? profile.name
  return typeof rawName === "string" && rawName.trim().length > 0
    ? rawName.trim()
    : null
}

function getAvatarUrl(user: InsforgeUser) {
  const profile = user.profile ?? {}
  const rawAvatar = profile.avatar_url ?? profile.picture
  return typeof rawAvatar === "string" && rawAvatar.length > 0
    ? rawAvatar
    : null
}

export async function syncUserFromInsforgeUser(user: InsforgeUser) {
  if (!user.id) {
    throw new Error("Authenticated InsForge user is missing id")
  }
  if (!user.email) {
    throw new Error("Authenticated InsForge user is missing email")
  }

  try {
    const existingById = await prisma.user.findUnique({
      where: { id: user.id },
    })

    if (existingById) {
      return await prisma.user.update({
        where: { id: user.id },
        data: {
          email: user.email,
          name: getDisplayName(user),
          avatarUrl: getAvatarUrl(user),
          lastSignInAt: new Date(),
        },
      })
    }

    const existingByEmail = await prisma.user.findUnique({
      where: { email: user.email },
    })

    if (existingByEmail) {
      return await prisma.user.update({
        where: { email: user.email },
        data: {
          id: user.id,
          name: getDisplayName(user),
          avatarUrl: getAvatarUrl(user),
          lastSignInAt: new Date(),
        },
      })
    }

    return await prisma.user.create({
      data: {
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
