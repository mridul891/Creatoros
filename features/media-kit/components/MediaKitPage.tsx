import { MediaKitPageClient } from "@/features/media-kit/components/MediaKitPageClient";
import type { MediaKitPageProps } from "@/features/media-kit/types/media-kit-page";

export function MediaKitPage({
  creatorsDetails,
  mediaKit,
}: MediaKitPageProps) {
  return (
    <MediaKitPageClient
      creatorsDetails={creatorsDetails}
      mediaKit={mediaKit}
    />
  );
}
