"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FieldDescription, FieldGroup } from "@/components/ui/field"
import { BadgeCheck, GalleryVerticalEndIcon, Sparkles } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import Link from "next/link"
import { useState } from "react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    const supabase = getSupabaseBrowserClient()
    setErrorMessage(null)
    setIsLoading(true)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
      },
    })

    if (error) {
      setErrorMessage("Unable to sign in with Google. Please try again.")
      setIsLoading(false)
      return
    }
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-black/50 p-6 shadow-[0_30px_80px_-40px_rgba(232,64,42,0.6)] backdrop-blur-xl sm:p-8",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-6">
        <FieldGroup>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              <Sparkles className="size-3.5 text-[#E8402A]" />
              Creator CRM for brand deals
            </div>
            <div className="flex items-center gap-3 font-medium">
              <div className="flex size-10 items-center justify-center rounded-xl bg-white text-black">
                <GalleryVerticalEndIcon className="size-5" />
              </div>
              <span className="text-lg font-semibold text-white">
                NotYetLaunched
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Welcome back, creator
            </h1>
            <FieldDescription className="max-w-xs text-center text-white/65">
              Sign in with Google to manage brand deals, sponsorship deadlines,
              invoices, and payments from one focused workspace.
            </FieldDescription>
          </div>
          <Button
            variant="default"
            size="lg"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="h-11 w-full rounded-xl bg-white text-black hover:bg-white/90"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-4"
            >
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            {isLoading ? "Redirecting..." : "Continue with Google"}
          </Button>
          <div className="rounded-xl border border-white/10 bg-white/3 p-3">
            <div className="flex items-start gap-2 text-xs text-white/70">
              <BadgeCheck className="mt-0.5 size-4 shrink-0 text-[#E8402A]" />
              <p>
                Built for solo creators. Track every deal from first outreach to
                final payment without spreadsheets.
              </p>
            </div>
          </div>
          {errorMessage ? (
            <FieldDescription className="text-center text-destructive">
              {errorMessage}
            </FieldDescription>
          ) : null}
        </FieldGroup>
      </div>
      <FieldDescription className="mt-5 text-center text-white/50">
        By continuing, you agree to our{" "}
        <Link href="/terms-and-conditions">Terms & Conditions</Link> and{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  )
}
