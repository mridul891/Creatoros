import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { updateSession } from "@insforge/sdk/ssr/middleware"

export default async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request })

  const insforgeUrl = process.env.NEXT_PUBLIC_INSFORGE_URL
  const insforgeAnonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY

  if (!insforgeUrl || !insforgeAnonKey) {
    return response
  }

  await updateSession({
    requestCookies: request.cookies,
    responseCookies: response.cookies,
  })

  const accessToken = request.cookies.get("insforge_access_token")?.value

  if (request.nextUrl.pathname.startsWith("/dashboard") && !accessToken) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return response
}

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
}
