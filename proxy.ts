import { type NextRequest, NextResponse } from "next/server"

const SESSION_COOKIE = "better-auth.session_token"

const PROTECTED_PREFIXES = ["/dashboard", "/onboarding"]

/**
 * Fast-path route protection based on session-cookie presence.
 * Real session validation happens server-side in layouts and actions.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )

  if (isProtected && !request.cookies.get(SESSION_COOKIE)) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/login", "/onboarding", "/dashboard", "/dashboard/:path*"],
}
