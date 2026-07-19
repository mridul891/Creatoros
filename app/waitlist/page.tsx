import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { WaitlistForm } from "@/components/modules/Landing/waitlist-form"

export const metadata: Metadata = {
  title: "Waitlist",
  description:
    "Join the NotYetLaunched waitlist to get early access to the creator CRM for tracking brand deals, sponsorship deliverables, and payments.",
  alternates: {
    canonical: "/waitlist",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
}

export default function WaitlistPage() {
  return (
    <div className="min-h-svh bg-white text-black">
      <div className="grid min-h-svh lg:grid-cols-2">
        <section className="relative flex flex-col p-6 md:p-10">
          <div className="flex items-center justify-center md:justify-start">
            <Link
              href="/"
              prefetch={false}
              className="inline-flex items-center gap-2 px-1 py-1 font-medium"
            >
              <span className="text-sm font-semibold tracking-wide text-black">
                !notyetlaunched
              </span>
            </Link>
          </div>

          <div className="relative flex flex-1 items-center justify-center py-8 md:py-0">
            <div className="w-full max-w-md">
              <div className="flex flex-col gap-6 p-6 sm:p-8">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      Coming soon
                    </span>
                  </div>
                  <h1 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
                    Never Lose Track of a Brand Deal Again.
                  </h1>
                  <p className="text-base leading-relaxed text-black/60">
                    Track brand deals, sponsorships, invoices, payments, and deadlines from one beautifully organized workspace built specifically for content creators.
                  </p>
                </div>

                <WaitlistForm />
              </div>
            </div>
          </div>
        </section>

        <section className="relative hidden p-4 lg:block">
          <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-[0_24px_90px_-45px_rgba(0,0,0,0.8)]">
            <Image
              src="/signup.png"
              alt="Creator workspace"
              fill
              sizes="100vw 100vh"
              priority
              className="object-cover brightness-[0.92] saturate-[1.06]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-white/25 via-transparent to-white/10" />
          </div>
        </section>
      </div>
    </div>
  )
}
