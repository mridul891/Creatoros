import type { Metadata } from "next"
import { PipelinePage } from "@/components/modules/dashboard/sponsorship"

export const metadata: Metadata = {
  title: "Content Pipeline",
  alternates: {
    canonical: "/dashboard/analytics",
  },
}

export default function DashboardDealsAnalyticsPage() {
  return <PipelinePage />
}
