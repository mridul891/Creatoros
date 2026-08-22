"use client"

import posthog from "posthog-js"
import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    posthog.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center px-8 text-center">
          <h1 className="mb-2 font-bold text-foreground text-xl tracking-[-0.03em]">
            Something went wrong
          </h1>
          <p className="mb-5 max-w-[460px] text-muted-foreground text-sm leading-[1.7]">
            We couldn&apos;t load this page. Try again, or refresh the page if
            the issue persists.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="cursor-pointer rounded-[10px] bg-primary px-5 py-2 font-semibold text-primary-foreground text-sm"
          >
            Retry
          </button>
        </main>
      </body>
    </html>
  )
}
