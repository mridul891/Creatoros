"use server"

import "server-only"

import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/auth/get-current-user"

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
