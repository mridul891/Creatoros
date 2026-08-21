import type { Metadata } from "next"

import { MediaKitPage } from "@/components/media-kit/MediaKitPage"
import { requireOnboardedUser } from "@/lib/auth/require-user"
import { getCreatorProfileDetails } from "@/server/creatorService"
import { getMediaKitForUser } from "@/server/mediaKitService"

export const metadata: Metadata = {
  title: "Media Kit",
  alternates: {
    canonical: "/dashboard/media-kit",
  },
}

export default async function DashboardMediaKitPage() {
  const user = await requireOnboardedUser()
  const [creatorsDetails, mediaKit] = await Promise.all([
    getCreatorProfileDetails(user.id),
    getMediaKitForUser(user.id),
  ])

  return <MediaKitPage creatorsDetails={creatorsDetails} mediaKit={mediaKit} />
}
