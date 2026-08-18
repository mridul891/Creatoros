import type { MediaKitFormData } from "@/features/media-kit/schema"
import type { CreatorUpsertInput } from "@/features/onboarding/services/creatorService"

export type MediaKitPageProps = {
  creatorsDetails:
    | (CreatorUpsertInput & {
        user: {
          name: string | null
          avatarUrl: string | null
        }
      })
    | null
  mediaKit: MediaKitFormData | null
}
