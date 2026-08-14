export const DEAL_STAGES = [
  "Lead",
  "Contacted",
  "Negotiation",
  "ProposalSent",
  "ContractSigned",
  "Active",
  "Delivered",
  "Completed",
  "Paid",
  "Cancelled",
] as const

export const DEAL_PRIORITIES = ["High", "Medium", "Low"] as const

export const DEAL_PRIORITY_THEME: Record<
  (typeof DEAL_PRIORITIES)[number],
  {
    row: string
    badge: string
    select: string
  }
> = {
  High: {
    row: "bg-[rgba(232,64,42,0.06)]",
    badge:
      "border-[rgba(232,64,42,0.35)] bg-[rgba(232,64,42,0.14)] text-[#FF9A8B]",
    select:
      "border-[rgba(232,64,42,0.4)] bg-[rgba(232,64,42,0.12)] text-[#FFB1A5]",
  },
  Medium: {
    row: "bg-[rgba(245,158,11,0.06)]",
    badge:
      "border-[rgba(245,158,11,0.35)] bg-[rgba(245,158,11,0.14)] text-[#FDD78C]",
    select:
      "border-[rgba(245,158,11,0.35)] bg-[rgba(245,158,11,0.12)] text-[#FDE68A]",
  },
  Low: {
    row: "bg-[rgba(34,197,94,0.06)]",
    badge:
      "border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.14)] text-[#9CE7BA]",
    select:
      "border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.12)] text-[#86EFAC]",
  },
}

export const DEAL_STATUSES = ["Active", "Archived"] as const

export const DEAL_SORT_OPTIONS = ["updatedAt", "value", "dueDate"] as const

export const DEAL_VIEW_MODES = ["table", "kanban"] as const

export const DEAL_ARCHIVE_FILTERS = ["active", "archived"] as const

export type DealStage = (typeof DEAL_STAGES)[number]
export type DealPriority = (typeof DEAL_PRIORITIES)[number]
export type DealStatus = (typeof DEAL_STATUSES)[number]
export type DealSortOption = (typeof DEAL_SORT_OPTIONS)[number]
export type DealViewMode = (typeof DEAL_VIEW_MODES)[number]
export type DealArchiveFilter = (typeof DEAL_ARCHIVE_FILTERS)[number]

const STAGE_INDEX: Record<DealStage, number> = DEAL_STAGES.reduce(
  (accumulator, stage, index) => {
    accumulator[stage] = index
    return accumulator
  },
  {} as Record<DealStage, number>
)

export function isValidStageTransition(from: DealStage, to: DealStage) {
  if (from === to) {
    return true
  }

  if (from === "Paid" || from === "Cancelled") {
    return false
  }

  if (to === "Cancelled") {
    return true
  }

  const fromIndex = STAGE_INDEX[from]
  const toIndex = STAGE_INDEX[to]

  return toIndex > fromIndex
}

export const DEAL_STAGE_LABEL: Record<DealStage, string> = {
  Lead: "Lead",
  Contacted: "Contacted",
  Negotiation: "Negotiation",
  ProposalSent: "Proposal Sent",
  ContractSigned: "Contract Signed",
  Active: "Active",
  Delivered: "Delivered",
  Completed: "Completed",
  Paid: "Paid",
  Cancelled: "Cancelled",
}
