"use client"

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-8 text-center">
      <h2 className="mb-2 font-bold text-foreground text-xl tracking-[-0.03em]">
        Something went wrong
      </h2>
      <p className="mb-5 max-w-[460px] text-muted-foreground text-sm leading-[1.7]">
        The dashboard could not be rendered. Try again, or refresh the page if
        the issue persists.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="cursor-pointer rounded-[10px] bg-primary px-5 py-2 font-semibold text-primary-foreground text-sm"
      >
        Retry
      </button>
    </div>
  )
}
