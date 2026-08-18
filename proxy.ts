import { updateSession, type CookieStore } from "@insforge/sdk/ssr/middleware"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export default async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request })

  const insforgeUrl = process.env.NEXT_PUBLIC_INSFORGE_URL
  const insforgeAnonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY

  if (!insforgeUrl || !insforgeAnonKey) {
    return response
  }

  await updateSession({
    requestCookies: request.cookies as unknown as CookieStore,
    responseCookies: response.cookies as unknown as CookieStore,
  })

  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get("insforge_access_token")?.value
  const requiresAuth =
    pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding")

  if (requiresAuth && !accessToken) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return response
}

export const config = {
  matcher: ["/login", "/onboarding", "/dashboard", "/dashboard/:path*"],
}
