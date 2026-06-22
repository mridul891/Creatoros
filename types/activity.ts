import type { ActivityEntityType, ActivityType } from "@/enums/activity"

export interface ActivityListItem {
  id: string
  type: ActivityType
  entityType: ActivityEntityType
  entityId: string
  brandId: string | null
  contactId: string | null
  dealId: string | null
  title: string
  description: string | null
  metadata: Record<string, unknown> | null
  createdAt: Date
}

export interface ActivityListData {
  items: ActivityListItem[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
  filters: {
    brandId?: string
    dealId?: string
  }
}

export type ActivityListField = "brandId" | "dealId" | "page" | "pageSize"
