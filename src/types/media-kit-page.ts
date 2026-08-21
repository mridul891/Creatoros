import type { MediaKitFormData } from "@/schemas/mediaKit"
import type { CreatorProfileDetails } from "@/server/creatorService"

export type MediaKitPageProps = {
  creatorsDetails: CreatorProfileDetails | null
  mediaKit: MediaKitFormData | null
}
