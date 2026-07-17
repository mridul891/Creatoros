"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FieldDescription, FieldGroup } from "@/components/ui/field"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import { GoogleLogo } from "@phosphor-icons/react/dist/ssr"
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
        "p-6 sm:p-8",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-7 mb-5">
        <FieldGroup className="gap-7">
            <h1 className="text-base font-light tracking-tight text-black sm:text-[2.7rem]">
              Welcome back
            </h1>

          <Button
            variant="default"
            size="lg"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="h-12 w-full rounded-xl border-black! bg-card! text-foreground! shadow-sm hover:bg-card! focus-visible:ring-black/30!"
          >
            <GoogleLogo className="size-4 text-foreground transition-colors group-hover/button:text-foreground" />
            {isLoading ? "Redirecting..." : "Sign in with Google"}
          </Button>
          {errorMessage ? (
            <FieldDescription className="text-center text-destructive">
              {errorMessage}
            </FieldDescription>
          ) : null}
        </FieldGroup>
      </div>
      <FieldDescription className="mt-8 text-left text-xs leading-relaxed text-black/55">
        By signing in, you agree to our{" "}
        <Link href="/terms-and-conditions">Terms & Conditions</Link> and{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  )
}
