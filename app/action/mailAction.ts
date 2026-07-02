"use server"

import { Resend } from "resend"

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

function buildWaitlistEmailHtml(userFirstname: string) {
  return `
    <div style="font-family: Inter, Arial, sans-serif; background:#000; color:#d4d4d8; padding:24px;">
      <div style="max-width:620px; margin:0 auto; background:#0a0a0a; border:1px solid #1f1f1f; border-radius:16px; padding:32px;">
        <p style="color:#fff; font-size:18px; margin:0 0 16px;">Hi ${userFirstname},</p>
        <p style="margin:0 0 14px;">Thanks for joining the <strong>NotYetLaunched</strong> waitlist.</p>
        <p style="margin:0 0 14px;">You are among the first creators getting access to a platform built to manage the business side of content creation.</p>
        <p style="margin:0 0 14px;">We will share early access updates with you soon.</p>
        <p style="margin:22px 0 0; color:#fff;">- NotYetLaunched Team</p>
      </div>
    </div>
  `
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
      html: buildWaitlistEmailHtml(userFirstname),
    })

    if (error) {
      return { success: false, message: error.message }
    }

    return { success: true, id: data?.id ?? null }
  } catch {
    return { success: false, message: "Failed to send email. Please try again." }
  }
}
