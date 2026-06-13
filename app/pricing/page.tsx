import { PricingPage } from "@/components/individualPages/pricing-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Review NotYetLaunched pricing for creators and choose the plan to manage brand deals, invoices, deadlines, and sponsorship operations.",
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingRoutePage() {
  return <PricingPage />;
}
