export const DELIVERABLE_STATUSES = [
  "Draft",
  "Ready",
  "Submitted",
  "NeedsRevision",
  "Approved",
  "Published",
] as const
export const DELIVERABLE_APPROVAL_STATUSES = [
  "NotSubmitted",
  "Pending",
  "ChangesRequested",
  "Approved",
] as const

export const DELIVERABLE_STATUS_LABELS: Record<DeliverableStatus, string> = {
  Draft: "Draft",
  Ready: "Ready",
  Submitted: "Submitted",
  NeedsRevision: "Needs Revision",
  Approved: "Approved",
  Published: "Published",
}

export const DELIVERABLE_DEFAULT_PLATFORMS = [
  "Instagram",
  "YouTube",
  "TikTok",
  "Podcast",
  "Newsletter",
  "Other",
] as const
export const DELIVERABLE_DEFAULT_TYPES = [
  "Reel",
  "Story",
  "Feed Post",
  "YouTube Integration",
  "Shorts",
  "Live",
  "Other",
] as const

export type DeliverableStatus = (typeof DELIVERABLE_STATUSES)[number]
export type DeliverableApprovalStatus =
  (typeof DELIVERABLE_APPROVAL_STATUSES)[number]
