import type {
  ContactFilter,
  ContactStatus,
} from "@/features/contacts/enums/contact"

export interface ContactListItem {
  id: string
  brandId: string
  name: string
  email: string | null
  phoneNumber: string | null
  jobTitle: string | null
  isPrimary: boolean
  status: ContactStatus
  updatedAt: Date
}

export interface ContactListData {
  items: ContactListItem[]
  total: number
  filters: {
    search: string
    status: ContactFilter
  }
}

export type ContactField =
  | "name"
  | "email"
  | "phoneNumber"
  | "jobTitle"
  | "notes"
  | "isPrimary"
