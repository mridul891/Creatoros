import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "@/lib/db/prisma";

const baseURL = process.env.BETTER_AUTH_URL;

export const auth = betterAuth({
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    "https://www.notyetlaunched.xyz",
    "https://notyetlaunched.xyz",
    "http://localhost:3000"
  ],
  database: prismaAdapter(prisma, { provider: "postgresql" }),
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
});

export type Session = typeof auth.$Infer.Session;
