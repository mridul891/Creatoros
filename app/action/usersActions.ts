"use server"
import { createSupabaseServerClient } from "@/lib/supabase/server-client"
import { syncUserFromSupabaseUser } from "@/lib/auth/sync-user"

export async function insertUser() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      throw new Error(error.message)
    }
    if (!data.user) {
      throw new Error("Unable to sync user because there is no active session")
    }

    await syncUserFromSupabaseUser(data.user)
  } catch (error) {
    console.error("Failed to upsert user with Prisma", error)
    throw new Error("Unable to save user")
  }

  return { success: true, message: "User updated successfully" }
}
