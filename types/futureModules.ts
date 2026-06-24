export interface CalendarEventContract {
  id: string
  source: "Task" | "Deliverable" | "Deal" | "Invoice" | "Payment"
  sourceId: string
  dealId?: string
  title: string
  startAt: Date
  endAt?: Date
  metadata?: Record<string, unknown>
}

export interface NotificationContract {
  id: string
  userId: string
  entityType: "Deal" | "Task" | "Deliverable" | "File" | "Invoice" | "Payment" | "Note"
  entityId: string
  title: string
  message: string
  status: "Unread" | "Read" | "Archived"
  createdAt: Date
}

export interface IntegrationAccountContract {
  id: string
  platform: "Instagram" | "YouTube"
  externalAccountId: string
  scopes: string[]
  connectedAt: Date
  lastSyncedAt?: Date
}

export interface AiAssistantContextContract {
  dealId: string
  noteIds: string[]
  fileIds: string[]
  deliverableIds: string[]
  taskIds: string[]
}
