"use client";

import { useRef } from "react";

import { MediaKitActionsBar } from "@/features/media-kit/components/MediaKitActionsBar";
import { MediaKitPreviewContent } from "@/features/media-kit/components/preview/MediaKitPreviewContent";
import type { MediaKitFormData } from "@/features/media-kit/schema";

type MediaKitPublicViewProps = {
  data: MediaKitFormData;
  updatedAt: Date;
};

export function MediaKitPublicView({ data, updatedAt }: MediaKitPublicViewProps) {
  const kitRef = useRef<HTMLElement>(null);
  const displayName = data.profile.name.trim() || "media-kit";

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
  );
}
