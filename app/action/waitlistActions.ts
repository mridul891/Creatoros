// app/actions/join-waitlist.ts

"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server-client"

export async function joinWaitlist(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const email = formData.get("email") as string

  if (!email) {
    return {
      success: false,
      message: "Email is required",
    }
  }

  const { error } = await supabase.from("waitlist").insert([{ email }])

  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        message: "You're already on the waitlist.",
      }
    }

    return {
      success: false,
      message: "Something went wrong.",
    }
  }

  return {
    success: true,
    message: "You're on the waitlist 🎉",
  }
}
