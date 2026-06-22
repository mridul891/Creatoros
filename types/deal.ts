import type { DealArchiveFilter, DealPriority, DealSortOption, DealStage, DealViewMode } from "@/enums/deal"

export interface DealListItem {
  id: string
  brandId: string
  brandName: string
  contactId: string | null
  contactName: string | null
  campaignName: string
  dealValue: number
  currency: string
  stage: DealStage
  priority: DealPriority
  status: "Active" | "Archived"
  startDate: Date | null
  dueDate: Date | null
  expectedCloseDate: Date | null
  paymentDueDate: Date | null
  updatedAt: Date
}

export interface DealListData {
  items: DealListItem[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
  filters: {
    search: string
    brandId?: string
    stage?: DealStage
    priority?: DealPriority
    archive: DealArchiveFilter
    sort: DealSortOption
    fromDate?: string
    toDate?: string
    view: DealViewMode
  }
  widgets: {
    activeDeals: number
    revenueInProgress: number
    dealsClosingSoon: number
    overdueDeals: number
    highestValueDeals: DealListItem[]
  }
}

export interface DealDetail {
  id: string
  userId: string
  brandId: string
  brandName: string
  brandCategory: string | null
  contactId: string | null
  contactName: string | null
  contactEmail: string | null
  campaignName: string
  dealValue: number
  currency: string
  stage: DealStage
  priority: DealPriority
  status: "Active" | "Archived"
  startDate: Date | null
  dueDate: Date | null
  expectedCloseDate: Date | null
  paymentDueDate: Date | null
  paymentTerms: string | null
  campaignDescription: string | null
  deliverablesSummary: string | null
  notes: string | null
  source: string | null
  probability: number | null
  externalRef: string | null
  deliveredAt: Date | null
  completedAt: Date | null
  paidAt: Date | null
  archivedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export type DealField =
  | "brandId"
  | "contactId"
  | "campaignName"
  | "dealValue"
  | "currency"
  | "stage"
  | "priority"
  | "startDate"
  | "dueDate"
  | "expectedCloseDate"
  | "paymentDueDate"
  | "paymentTerms"
  | "campaignDescription"
  | "deliverablesSummary"
  | "notes"
  | "source"
  | "probability"
  | "externalRef"
  | "status"
