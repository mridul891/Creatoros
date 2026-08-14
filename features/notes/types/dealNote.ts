import type { DealNoteStatus } from "@/features/notes/enums/dealNote"

export interface DealNoteListItem {
  id: string
  dealId: string
  title: string
  content: string
  isPinned: boolean
  status: DealNoteStatus
  createdBy: string
  updatedBy: string
  createdAt: Date
  updatedAt: Date
  archivedAt: Date | null
}

export interface DealNoteListData {
  items: DealNoteListItem[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
  filters: {
    search: string
    archive: "active" | "archived"
  }
}

export type DealNoteField = "dealId" | "title" | "content"
