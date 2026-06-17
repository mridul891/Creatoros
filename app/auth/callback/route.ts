import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server-client"
import { syncUserFromSupabaseUser } from "@/lib/auth/sync-user"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") ?? "/dashboard"
  const safeNext = next.startsWith("/") ? next : "/dashboard"

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=oauth_callback_missing_code", request.url)
    )
  }

  try {
    const supabase = await createSupabaseServerClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (exchangeError) {
      console.error("auth.oauth_exchange_failed", { error: exchangeError.message })
      return NextResponse.redirect(new URL("/login?error=oauth_callback_failed", request.url))
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("auth.callback_user_fetch_failed", {
        error: userError?.message,
      })
      return NextResponse.redirect(new URL("/login?error=oauth_callback_failed", request.url))
    }

    await syncUserFromSupabaseUser(user)
  } catch (error) {
    console.error("auth.callback_sync_failed", { error })
    return NextResponse.redirect(new URL("/login?error=oauth_sync_failed", request.url))
  }

  return NextResponse.redirect(new URL(safeNext, request.url))
}
