export const DEAL_FILE_CATEGORIES = [
  "Contract",
  "CampaignBrief",
  "Asset",
  "RawMedia",
  "FinalDeliverable",
  "Invoice",
  "Reference",
] as const

export const DEAL_FILE_STATUSES = ["Active", "Archived"] as const

export type DealFileCategory = (typeof DEAL_FILE_CATEGORIES)[number]
export type DealFileStatus = (typeof DEAL_FILE_STATUSES)[number]
