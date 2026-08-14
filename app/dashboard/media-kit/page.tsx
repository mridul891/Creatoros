import type { Metadata } from "next"
import { MediaKitPage } from "@/components/modules/dashboard/MediaKitPage"

export const metadata: Metadata = {
  title: "Media Kit",
  alternates: {
    canonical: "/dashboard/media-kit",
  },
}

export default function DashboardMediaKitPage() {
  return <MediaKitPage />
}
