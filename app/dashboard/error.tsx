"use client";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-8 text-center">
      <h2 className="mb-2 text-xl font-bold tracking-[-0.03em] text-white">
        Something went wrong
      </h2>
      <p className="mb-5 max-w-[460px] text-sm leading-[1.7] text-[rgba(255,255,255,0.65)]">
        The dashboard could not be rendered. Try again, or refresh the page if
        the issue persists.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="cursor-pointer rounded-[10px] bg-[var(--cos-primary)] px-5 py-2 text-sm font-semibold text-white"
      >
        Retry
      </button>
    </div>
  );
}
