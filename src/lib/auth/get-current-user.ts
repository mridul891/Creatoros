import "server-only"

import { headers } from "next/headers"
import { cache } from "react"
import { auth } from "@/lib/auth/server"
import { prisma } from "@/lib/db/prisma"

/**
 * Returns the database user for the current session, or null when
 * unauthenticated. The user row itself is created by Better Auth on
 * first sign-in; this only reads it.
 */
export const getCurrentUser = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    return null
  }

  return prisma.user.findUnique({
    where: { id: session.user.id },
  })
})
