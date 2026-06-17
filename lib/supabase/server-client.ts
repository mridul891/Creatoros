"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

function getEnvironmentVariables() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    throw new Error("Environment variable NEXT_PUBLIC_SUPABASE_URL is not set")
  }
  if (!supabaseAnonKey) {
    throw new Error("Environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY is not set")
  }

  return { supabaseUrl, supabaseAnonKey }
}

export async function createSupabaseServerClient() {
  const { supabaseUrl, supabaseAnonKey } = getEnvironmentVariables()

  const cookieStore = await cookies()
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch (error) {
          console.error(error)
        }
      },
    },
  })
}
