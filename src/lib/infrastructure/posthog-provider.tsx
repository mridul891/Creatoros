"use client"
import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // posthog-js is initialized once in instrumentation-client.ts using
  // NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN / NEXT_PUBLIC_POSTHOG_HOST.
  // Here we only mount the React provider when analytics is configured.
  if (!process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) return <>{children}</>

  return <PHProvider client={posthog}>{children}</PHProvider>
}
