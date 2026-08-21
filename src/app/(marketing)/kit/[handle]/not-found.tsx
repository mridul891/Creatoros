import Link from "next/link"

export default function MediaKitNotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-muted/30 px-4 text-center">
      <h1 className="font-heading font-semibold text-2xl tracking-tight">
        Media kit not found
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground text-sm">
        This link may be incorrect, or the creator has not published a media kit
        yet.
      </p>
      <Link
        href="/"
        className="mt-6 font-medium text-primary text-sm underline-offset-4 hover:underline"
      >
        Back to home
      </Link>
    </main>
  )
}
