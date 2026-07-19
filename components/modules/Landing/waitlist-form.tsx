"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { joinWaitlist } from "@/app/action/waitlistActions"
import { toast } from "sonner"
import { sendEmail } from "@/app/action/mailAction"
import { ArrowRight, CircleNotch } from "@phosphor-icons/react"

export function WaitlistForm() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get("email") as string
      const name = formData.get("name") as string
      if (!email) {
        toast.error("Email is required")
        return
      }
      await joinWaitlist(formData)
      await sendEmail(email)

      toast.success("You're on the waitlist 🎉")
      setEmail("")
      setName("")
    } catch {
      toast.error("Failed to join waitlist")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-black">
          First name
        </Label>
        <Input
          id="name"
          type="text"
          name="name"
          placeholder="Enter your  name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className="h-12 w-full rounded-md border border-black/10 bg-white px-4 text-base text-black shadow-sm transition-all placeholder:text-black/40 focus-visible:border-black/30 focus-visible:ring-2 focus-visible:ring-black/10"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-black">
          Email address
        </Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="h-12 w-full rounded-md border border-black/10 bg-white px-4 text-base text-black shadow-sm transition-all placeholder:text-black/40 focus-visible:border-black/30 focus-visible:ring-2 focus-visible:ring-black/10"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="mt-2 h-12 w-full rounded-md border border-black bg-card text-base font-semibold text-black shadow-sm transition-all hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <CircleNotch className="h-5 w-5 animate-spin" />
            Joining...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Join the waitlist
            <ArrowRight className="h-4 w-4" />
          </span>
        )}
      </Button>

      <p className="text-center text-xs text-black/50">
        Be the first to know when we launch. No spam, ever.
      </p>
    </form>
  )
}
