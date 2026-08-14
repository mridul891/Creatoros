import type { MediaKitTab } from "@/enums/media-kit"

export interface CreatorProfile {
  name: string
  handle: string
  title: string
  bio: string
  location: string
  website: string
  email: string
  avatar: string
  cover: string
}

export interface MediaKitRate {
  type: string
  price: string
  desc: string
}

export interface MediaKitUiState {
  tab: MediaKitTab
  editMode: boolean
  copied: boolean
  regenerating: boolean
}
