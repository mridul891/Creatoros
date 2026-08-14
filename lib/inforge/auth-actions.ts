"use server"

import { createAuthActions } from "@insforge/sdk/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function signInWithPassword(formData: FormData) {
  const cookieStore = await cookies()
  const auth = createAuthActions({ cookies: cookieStore })

  const { data, error } = await auth.signInWithPassword({
    email: String(formData.get("email")),
    password: String(formData.get("password")),
  })

  return { user: data?.user ?? null, error }
}

export async function signOut() {
  const cookieStore = await cookies()
  const auth = createAuthActions({ cookies: cookieStore })
  await auth.signOut()
  redirect("/login")
}

export async function initiateGoogleOAuth() {
  const cookieStore = await cookies()
  const auth = createAuthActions({ cookies: cookieStore })

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_INSFORGE_URL?.replace(/\.insforge\.app$/, "") ||
    "http://localhost:3000"

  const { data, error } = await auth.signInWithOAuth("google", {
    redirectTo: `${appUrl}/api/auth/callback`,
    skipBrowserRedirect: true,
  })

  if (error || !data?.url || !data?.codeVerifier) {
    throw new Error(error?.message ?? "OAuth init failed")
  }

  cookieStore.set("insforge_code_verifier", data.codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  })

  redirect(data.url)
}
