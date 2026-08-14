export const CONTACT_STATUSES = ["Active", "Archived"] as const

export const CONTACT_FILTERS = ["active", "archived"] as const

export type ContactStatus = (typeof CONTACT_STATUSES)[number]
export type ContactFilter = (typeof CONTACT_FILTERS)[number]
