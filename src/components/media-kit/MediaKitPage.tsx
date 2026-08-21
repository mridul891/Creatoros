import { MediaKitPageClient } from "@/components/media-kit/MediaKitPageClient"
import type { MediaKitPageProps } from "@/types/media-kit-page"

export function MediaKitPage({ creatorsDetails, mediaKit }: MediaKitPageProps) {
  return (
    <MediaKitPageClient creatorsDetails={creatorsDetails} mediaKit={mediaKit} />
  )
}
