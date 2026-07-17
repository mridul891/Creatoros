"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { joinWaitlist } from "@/app/action/waitlistActions"
import { toast } from "sonner"
import { sendEmail } from "@/app/action/mailAction"

export function WaitlistForm() {
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)


  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      if (!email) {
        toast.error("Email is required")
        return
      }
      await joinWaitlist(formData)
      await sendEmail(email)

      toast.success("You're on the waitlist 🎉")
    } catch {
      toast.error("Failed to join waitlist")
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 rounded-2xl border border-border bg-muted p-3 shadow-[0_8px_40px_-12px_rgba(247,255,155,0.15)] backdrop-blur-md"
    >
      <Input
        type="text"
        name="firstName"
        placeholder="First name"
        value={firstName}
        onChange={(event) => setFirstName(event.target.value)}
        required
        className="h-12 w-full rounded-xl border border-border bg-muted px-4 text-base text-foreground shadow-none transition-colors placeholder:text-foreground focus-visible:border-[#F7FF9B]/60 focus-visible:ring-2 focus-visible:ring-[#F7FF9B]/30"
      />
      <Input
        type="email"
        name="email"
        placeholder="you@example.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        className="h-12 w-full rounded-xl border border-border bg-muted px-4 text-base text-foreground shadow-none transition-colors placeholder:text-foreground focus-visible:border-[#F7FF9B]/60 focus-visible:ring-2 focus-visible:ring-[#F7FF9B]/30"
      />
      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="h-12 w-full rounded-xl bg-[#F7FF9B] text-base font-semibold text-black transition-all hover:bg-[#F7FF9B]/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Joining..." : "Join waitlist"}
      </Button>
    </form>
  )
}
