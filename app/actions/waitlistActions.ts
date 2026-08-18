"use server"

import { createInsforgeServerClient } from "@/lib/insforge/server"

function getErrorCode(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code
  }

  return ""
}

export async function joinWaitlist(formData: FormData) {
  const insforge = await createInsforgeServerClient()
  const email = formData.get("email") as string
  const name = formData.get("name") as string

  if (!email) {
    return {
      success: false,
      message: "Email is required",
    }
  }

  const { error } = await insforge.database
    .from("waitlist")
    .insert([{ email, name }])

  if (error) {
    if (getErrorCode(error) === "23505") {
      return {
        success: false,
        message: "You're already on the waitlist.",
      }
    }

    console.error("waitlist.join_failed", { error })
    return {
      success: false,
      message: "Something went wrong.",
    }
  }

  return {
    success: true,
    message: "You're on the waitlist",
  }
}
