export const DEAL_NOTE_STATUSES = ["Active", "Archived"] as const

export type DealNoteStatus = (typeof DEAL_NOTE_STATUSES)[number]
