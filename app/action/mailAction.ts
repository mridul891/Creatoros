"use server"

import { Resend } from "resend"
import { WaitlistEmail } from "@/components/modules/email/template"

const resend = new Resend(process.env.RESEND_API_KEY)

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type SendEmailResult =
  | { success: true; id: string | null }
  | { success: false; message: string }

function deriveFirstName(email: string) {
  const localPart = email.split("@")[0] ?? ""
  const name = localPart.split(/[._-]/)[0] ?? ""
  if (!name) return "there"
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export async function sendEmail(
  email: string,
  firstName?: string
): Promise<SendEmailResult> {
  if (!process.env.RESEND_API_KEY) {
    return { success: false, message: "Email service is not configured." }
  }

  const normalizedEmail = email.trim().toLowerCase()

  if (!EMAIL_REGEX.test(normalizedEmail)) {
    return { success: false, message: "Please provide a valid email address." }
  }

  const userFirstname = firstName?.trim() || deriveFirstName(normalizedEmail)

  try {
    const { data, error } = await resend.emails.send({
      from: "NotYetLaunched <support@notyetlaunched.xyz>",
      to: normalizedEmail,
      subject: "🚀 You're on the NotYetLaunched waitlist",
      react: WaitlistEmail({ userFirstname }),
    })

    if (error) {
      return { success: false, message: error.message }
    }

    return { success: true, id: data?.id ?? null }
  } catch {
    return { success: false, message: "Failed to send email. Please try again." }
  }
}
