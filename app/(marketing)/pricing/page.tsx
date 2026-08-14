import type { Metadata } from "next"
import { PricingPage } from "@/components/marketing/pricing-page"

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Review NotYetLaunched pricing for creators and choose the plan to manage brand deals, invoices, deadlines, and sponsorship operations.",
  alternates: {
    canonical: "/pricing",
  },
}

export default function PricingRoutePage() {
  return <PricingPage />
}
