import { updateSession } from "@insforge/sdk/ssr/middleware"
import { cookies } from "next/headers"
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
    requestCookies: await cookies(),
    responseCookies: await cookies(),
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
