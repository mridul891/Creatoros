import type { DealFileCategory, DealFileStatus } from "@/enums/dealFile"

export interface DealFileListItem {
  id: string
  dealId: string
  fileName: string
  storagePath: string
  mimeType: string | null
  sizeBytes: number | null
  category: DealFileCategory
  status: DealFileStatus
  metadata: Record<string, unknown> | null
  uploadedBy: string
  createdAt: Date
  updatedAt: Date
  archivedAt: Date | null
}

export interface DealFileListData {
  items: DealFileListItem[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
  filters: {
    search: string
    archive: "active" | "archived"
    category?: DealFileCategory
  }
}

export type DealFileField = "dealId" | "fileName" | "storagePath" | "category"
