"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@insforge/sdk/ssr"

export async function createInsforgeServerClient() {
  return createServerClient({
    cookies: await cookies(),
  })
}
