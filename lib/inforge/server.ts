"use server"

import { createServerClient } from "@insforge/sdk/ssr"
import { cookies } from "next/headers"

export async function createInsforgeServerClient() {
  return createServerClient({
    cookies: await cookies(),
  })
}
