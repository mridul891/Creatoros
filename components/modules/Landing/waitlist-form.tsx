"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { joinWaitlist } from "@/app/action/waitlistActions"

export function WaitlistForm() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)


  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      if (!email) {
        setMessage({ type: "error", text: "Email is required" })
        return
      }
      await joinWaitlist(formData)
      setMessage({ type: "success", text: "You've joined the waitlist! We'll be in touch soon." })
    } catch (error) {
      setMessage({ type: "error", text: "Failed to join waitlist" })
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <>
      <form
        onSubmit={onSubmit}
        className="mx-auto mt-6 flex w-md max-w-lg items-center gap-1.5 rounded-xl border border-input bg-background p-1.5 shadow-sm focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50"
      >
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="h-9 border-0 bg-transparent shadow-none focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent w-full"
        />
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="shrink-0"
        >
          {isSubmitting ? "Joining..." : "Join waitlist"}
        </Button>
      </form>

      {message && (
        <p
          className={cn(
            "mt-3 text-sm",
            message.type === "success" ? "text-green-500" : "text-destructive"
          )}
        >
          {message.text}
        </p>
      )}
    </>
  )
}
