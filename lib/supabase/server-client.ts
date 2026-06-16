"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

function getEnvironmentVariable() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
    throw new Error(`Environment variable ${name} is not set`)
  }
  return { supabaseUrl, supabaseAnonKey, supabaseServiceRoleKey }
}

export async function createSupabaseServerClient() {
  const { supabaseUrl, supabaseServiceRoleKey } = getEnvironmentVariable()

  const cookieStore = await cookies()
  return createServerClient(supabaseUrl, supabaseServiceRoleKey, {
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
