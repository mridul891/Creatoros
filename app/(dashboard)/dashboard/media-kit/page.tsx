import type { Metadata } from "next"

import { MediaKitPage } from "@/features/media-kit/components/MediaKitPage"
import { requireOnboardedUser } from "@/lib/auth/require-user"

export const metadata: Metadata = {
  title: "Media Kit",
  alternates: {
    canonical: "/dashboard/media-kit",
  },
}

export default async function DashboardMediaKitPage() {
  const user = await requireOnboardedUser()
  return <MediaKitPage user={user} />
}
