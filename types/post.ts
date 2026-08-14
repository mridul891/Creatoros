import type {
  PlatformFilter,
  PostStatus,
  PostType,
  SocialPlatform,
} from "@/enums/post"

export interface Post {
  id: number
  day: number
  title: string
  caption: string
  platform: SocialPlatform
  type: PostType
  status: PostStatus
  time: string
  views?: string
}

export interface PostModalState {
  day: number
  post?: Post
}

export interface PostFormState {
  title: string
  caption: string
  platform: SocialPlatform
  type: PostType
  status: PostStatus
  time: string
  day: number
}

export interface CalendarFiltersState {
  platform: PlatformFilter
  status: PostStatus | PlatformFilter
}
