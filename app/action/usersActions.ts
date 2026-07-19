"use server"

import { createInsforgeServerClient } from "@/lib/inforge/server"
import { syncUserFromInsforgeUser } from "@/lib/auth/sync-user"

export async function insertUser() {
  try {
    const insforge = await createInsforgeServerClient()
    const { data, error } = await insforge.auth.getCurrentUser()

    if (error) {
      throw new Error(error.message)
    }
    if (!data?.user) {
      throw new Error("Unable to sync user because there is no active session")
    }

    await syncUserFromInsforgeUser(data.user)
  } catch (error) {
    console.error("Failed to upsert user with Prisma", error)
    throw new Error("Unable to save user")
  }

  return { success: true, message: "User updated successfully" }
}
