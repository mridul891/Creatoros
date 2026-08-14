import type {
  AnalyticsRange,
  AnalyticsSortBy,
  AnalyticsViewMode,
} from "@/enums/analytics"
import type { PlatformFilter, PostType, SocialPlatform } from "@/enums/post"

export interface AnalyticsFiltersState {
  range: AnalyticsRange
  platform: PlatformFilter
  sortBy: AnalyticsSortBy
}

export interface AnalyticsUiState {
  viewMode: AnalyticsViewMode
  regeneratingInsightId: number | null
}

export interface PlatformMeta {
  id: SocialPlatform
  label: string
  connected: boolean
  color: string
}

export interface RecentContentItem {
  id: number
  title: string
  platform: SocialPlatform
  type: Exclude<PostType, PostType.STORY>
  views: number
  er: number
  thumb: string
}
