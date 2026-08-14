import type {
  DeliverableApprovalStatus,
  DeliverableStatus,
} from "@/enums/deliverable"

export interface DeliverableListItem {
  id: string
  dealId: string
  platform: string
  deliverableType: string
  dueDate: Date | null
  status: DeliverableStatus
  approvalStatus: DeliverableApprovalStatus
  submissionUrl: string | null
  publishedUrl: string | null
  internalNotes: string | null
  brandNotes: string | null
  revisionCount: number
  orderIndex: number
  isArchived: boolean
  archivedAt: Date | null
  createdBy: string
  updatedBy: string
  createdAt: Date
  updatedAt: Date
}

export interface DeliverableDetail extends DeliverableListItem {
  userId: string
}

export interface DeliverableListData {
  items: DeliverableListItem[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
  filters: {
    search: string
    archive: "active" | "archived"
    sort: "order" | "dueDate" | "updatedAt" | "status"
    status?: DeliverableStatus
    platform?: string
  }
  summary: {
    total: number
    draft: number
    submitted: number
    needsRevision: number
    approved: number
    published: number
  }
}

export type DeliverableField =
  | "dealId"
  | "platform"
  | "deliverableType"
  | "dueDate"
  | "status"
  | "approvalStatus"
  | "submissionUrl"
  | "publishedUrl"
  | "internalNotes"
  | "brandNotes"
  | "revisionCount"
  | "orderIndex"
