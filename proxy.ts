// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const response = NextResponse.next();

  const hasSupabaseSession = req.cookies.getAll().some(({ name }) => {
    return (
      name === "sb-access-token" ||
      name.endsWith("-auth-token") ||
      name.endsWith("-auth-token.0")
    );
  });

  if (
    req.nextUrl.pathname.startsWith("/dashboard") &&
    !hasSupabaseSession
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
}; 