import type { Metadata } from "next"
import { PipelinePage } from "@/features/sponsorship/components"

export const metadata: Metadata = {
  title: "Content Pipeline",
  alternates: {
    canonical: "/dashboard/analytics",
  },
}

export default function DashboardDealsAnalyticsPage() {
  return <PipelinePage />
}
