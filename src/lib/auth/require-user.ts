import "server-only"

import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/auth/get-current-user"

/** Requires an authenticated user; redirects to login otherwise. */
export async function requireUser() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return user
}

/** Requires a user who has completed onboarding; redirects otherwise. */
export async function requireOnboardedUser() {
  const user = await requireUser()

  if (!user.isOnboardingComplete) {
    redirect("/onboarding")
  }

  return user
}
