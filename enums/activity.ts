export const ACTIVITY_ENTITY = {
  BRAND: "Brand",
  CONTACT: "Contact",
  DEAL: "Deal",
  DELIVERABLE: "Deliverable",
  TASK: "Task",
  INVOICE: "Invoice",
  PAYMENT: "Payment",
  FILE: "File",
  NOTE: "Note",
} as const

export const ACTIVITY_TYPE = {
  BRAND_CREATED: "BrandCreated",
  BRAND_UPDATED: "BrandUpdated",
  BRAND_ARCHIVED: "BrandArchived",
  CONTACT_CREATED: "ContactCreated",
  CONTACT_UPDATED: "ContactUpdated",
  CONTACT_ARCHIVED: "ContactArchived",
  CONTACT_PRIMARY_CHANGED: "ContactPrimaryChanged",
  DEAL_CREATED: "DealCreated",
  DEAL_UPDATED: "DealUpdated",
  DEAL_STAGE_CHANGED: "DealStageChanged",
  DEAL_ARCHIVED: "DealArchived",
  DEAL_RESTORED: "DealRestored",
} as const

export const ACTIVITY_ENTITY_TYPES = Object.values(ACTIVITY_ENTITY)
export const ACTIVITY_TYPES = Object.values(ACTIVITY_TYPE)

export type ActivityEntityType = (typeof ACTIVITY_ENTITY)[keyof typeof ACTIVITY_ENTITY]
export type ActivityType = (typeof ACTIVITY_TYPE)[keyof typeof ACTIVITY_TYPE]
