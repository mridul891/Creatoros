import type { Metadata } from "next"

import { MediaKitPage } from "@/features/media-kit/components/MediaKitPage"
import { getMediaKitForUser } from "@/features/media-kit/services/mediaKitService"
import { requireOnboardedUser } from "@/lib/auth/require-user"
import { getCreatorsDetails } from "@/lib/utils/get-creators-details"

export const metadata: Metadata = {
  title: "Media Kit",
  alternates: {
    canonical: "/dashboard/media-kit",
  },
}

export default async function DashboardMediaKitPage() {
  const user = await requireOnboardedUser()
  const [creatorsDetails, mediaKit] = await Promise.all([
    getCreatorsDetails(),
    getMediaKitForUser(user.id),
  ])

  return (
    <MediaKitPage creatorsDetails={creatorsDetails} mediaKit={mediaKit} />
  )
}
