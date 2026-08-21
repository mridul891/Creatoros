import "server-only"

import { dash } from "@better-auth/infra"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"

import { prisma } from "@/lib/db/prisma"

const baseURL =
  process.env.NODE_ENV === "development"
    ? undefined
    : (process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL)

export const auth = betterAuth({
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  plugins: [dash()],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
  },
  user: {
    fields: {
      image: "avatarUrl",
    },
    additionalFields: {
      isOnboardingComplete: {
        type: "boolean",
        defaultValue: false,
        input: false,
      },
    },
  },
  account: {
    accountLinking: {
      // Google is a trusted provider: link an existing user row with the
      // same verified email instead of failing sign-in.
      trustedProviders: ["google"],
    },
  },
  advanced: {
    database: {
      // Keep generated ids compatible with the uuid primary keys.
      generateId: () => crypto.randomUUID(),
    },
  },
})

export type Session = typeof auth.$Infer.Session
