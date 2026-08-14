"use client"

import { GoogleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { FieldDescription, FieldGroup } from "@/components/ui/field"
import { initiateGoogleOAuth } from "@/lib/insforge/auth-actions"
import { cn } from "@/lib/utils"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleGoogleSignIn = () => {
    setErrorMessage(null)
    startTransition(async () => {
      try {
        await initiateGoogleOAuth()
      } catch {
        setErrorMessage("Unable to sign in with Google. Please try again.")
      }
    })
  }

  return (
    <div className={cn("p-6 sm:p-8", className)} {...props}>
      <div className="mb-5 flex flex-col gap-7">
        <FieldGroup className="gap-7">
          <h1 className="font-semibold text-3xl text-black tracking-tight sm:text-4xl">
            Welcome back
          </h1>

          <Button
            variant="default"
            size="lg"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isPending}
            className="h-12 w-full cursor-pointer rounded-lg border-black! bg-card! text-foreground! shadow-sm hover:bg-card! focus-visible:ring-black/30!"
          >
            <HugeiconsIcon
              icon={GoogleIcon}
              className="size-4 text-foreground transition-colors group-hover/button:text-foreground"
            />
            {isPending ? "Redirecting..." : "Sign in with Google"}
          </Button>
          {errorMessage ? (
            <FieldDescription className="text-center text-destructive">
              {errorMessage}
            </FieldDescription>
          ) : null}
        </FieldGroup>
      </div>
      <FieldDescription className="mt-8 text-left text-black/55 text-xs leading-relaxed">
        By signing in, you agree to our{" "}
        <Link href="/terms-and-conditions">Terms & Conditions</Link> and{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  )
}
