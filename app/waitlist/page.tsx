import type { Metadata } from "next"
import Particles from "@/components/motion-primitives/particle"
import HeroSection from "@/components/modules/Landing/herosection"

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
    <main className="flex min-h-screen flex-col items-center justify-center overflow-x-clip bg-black text-white">
      <section className="flex flex-col items-center px-4 sm:px-6 lg:px-8">
        <HeroSection />

        <Particles
          quantityDesktop={350}
          quantityMobile={100}
          ease={80}
          color={"#F7FF9B"}
          refresh
        />
      </section>
    </main>
  )
}
