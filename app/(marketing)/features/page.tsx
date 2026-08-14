import type { Metadata } from "next"
import { FeaturesPage } from "@/components/marketing/features-page"

export const metadata: Metadata = {
  title: "Features",
  description:
    "See the creator-focused features in NotYetLaunched, including deal tracking, calendar planning, invoice management, analytics, and media kit tools.",
  alternates: {
    canonical: "/features",
  },
}

export default function FeaturesRoutePage() {
  return <FeaturesPage />
}
