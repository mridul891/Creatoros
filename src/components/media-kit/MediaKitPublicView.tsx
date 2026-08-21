"use client"

import { useRef } from "react"

import { MediaKitActionsBar } from "@/components/media-kit/MediaKitActionsBar"
import { MediaKitPreviewContent } from "@/components/media-kit/MediaKitPreviewContent"
import type { MediaKitFormData } from "@/schemas/mediaKit"

type MediaKitPublicViewProps = {
  data: MediaKitFormData
  updatedAt: Date
}

export function MediaKitPublicView({
  data,
  updatedAt,
}: MediaKitPublicViewProps) {
  const kitRef = useRef<HTMLElement>(null)
  const displayName = data.profile.name.trim() || "media-kit"

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <MediaKitActionsBar
        handle={data.profile.handle}
        displayName={displayName}
        kitRef={kitRef}
        showCopyLink={false}
      />
      <MediaKitPreviewContent
        data={data}
        updatedAt={updatedAt}
        kitRef={kitRef}
      />
    </div>
  )
}
