export interface BrandListItem {
  id: string
  name: string
  category: string | null
  website: string | null
  primaryContactName: string | null
  primaryContactEmail: string | null
  notes: string | null
  updatedAt: Date
}

export interface BrandListData {
  items: BrandListItem[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export type BrandField =
  | "name"
  | "category"
  | "website"
  | "primaryContactName"
  | "primaryContactEmail"
  | "notes"
