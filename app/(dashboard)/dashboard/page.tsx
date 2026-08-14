import type { Metadata } from "next"
import { DashboardOverview } from "@/features/analytics/components/overview"

export const metadata: Metadata = {
  title: "Overview",
  alternates: {
    canonical: "/dashboard",
  },
}

export default function DashboardPage() {
  return <DashboardOverview />
}
