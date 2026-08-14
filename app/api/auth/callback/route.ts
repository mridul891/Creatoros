import { createAuthActions } from "@insforge/sdk/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { syncUserFromInsforgeUser } from "@/lib/auth/sync-user"

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("insforge_code")
  const oauthError = request.nextUrl.searchParams.get("error")

  if (oauthError || !code) {
    if (oauthError) {
      console.warn("OAuth callback failed", { error: oauthError })
    }
    return NextResponse.redirect(
      new URL("/login?error=oauth_failed", request.url)
    )
  }

  const cookieStore = await cookies()
  const codeVerifier = cookieStore.get("insforge_code_verifier")?.value
  if (!codeVerifier) {
    return NextResponse.redirect(
      new URL("/login?error=missing_verifier", request.url)
    )
  }

  const response = NextResponse.redirect(new URL("/onboarding", request.url))
  const auth = createAuthActions({
    requestCookies: request.cookies,
    responseCookies: response.cookies,
  })

  const { data, error } = await auth.exchangeOAuthCode(code, codeVerifier)

  if (error) {
    console.error("OAuth code exchange failed", { error })
    return NextResponse.redirect(
      new URL("/login?error=exchange_failed", request.url)
    )
  }

  response.cookies.delete("insforge_code_verifier")

  try {
    const user = data?.user
    if (user) {
      const syncedUser = await syncUserFromInsforgeUser(user)
      const destination = syncedUser.isOnboardingComplete
        ? "/dashboard"
        : "/onboarding"
      return NextResponse.redirect(new URL(destination, request.url), {
        headers: response.headers,
      })
    }

    return NextResponse.redirect(new URL("/onboarding", request.url), {
      headers: response.headers,
    })
  } catch (syncError) {
    console.error("User sync failed", syncError)
    return NextResponse.redirect(new URL("/onboarding", request.url), {
      headers: response.headers,
    })
  }
}
