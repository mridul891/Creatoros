"use server"

import { createInsforgeServerClient } from "@/lib/inforge/server"

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

  const response = await insforge.database
    .from("waitlist")
    .insert([{ email, name }])
  console.log(response)
  // if (error) {
  //   if (error.code === "23505") {
  //     return {
  //       success: false,
  //       message: "You're already on the waitlist.",
  //     }
  //   }

  //   return {
  //     success: false,
  //     message: "Something went wrong.",
  //   }
  // }

  return {
    success: true,
    message: "You're on the waitlist",
  }
}
