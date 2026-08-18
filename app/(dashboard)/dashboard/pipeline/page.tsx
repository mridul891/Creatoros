import type { Metadata } from "next"
import { PipelinePage } from "@/features/sponsorship/components"

export const metadata: Metadata = {
  title: "Content Pipeline",
  alternates: {
    canonical: "/dashboard/pipeline",
  },
}

export default function DashboardPipelinePage() {
  return <PipelinePage />
}
