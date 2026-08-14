export const TASK_STATUSES = [
  "Todo",
  "InProgress",
  "Blocked",
  "InReview",
  "Done",
] as const
export const TASK_PRIORITIES = ["Low", "Medium", "High", "Urgent"] as const
export const TASK_SORT_OPTIONS = [
  "order",
  "dueDate",
  "updatedAt",
  "priority",
] as const
export const TASK_ARCHIVE_FILTERS = ["active", "archived"] as const
export const TASK_DUE_DATE_FILTERS = [
  "all",
  "upcoming",
  "overdue",
  "none",
] as const

export type TaskStatus = (typeof TASK_STATUSES)[number]
export type TaskPriority = (typeof TASK_PRIORITIES)[number]
export type TaskSortOption = (typeof TASK_SORT_OPTIONS)[number]
export type TaskArchiveFilter = (typeof TASK_ARCHIVE_FILTERS)[number]
export type TaskDueDateFilter = (typeof TASK_DUE_DATE_FILTERS)[number]

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  Todo: "Todo",
  InProgress: "In Progress",
  Blocked: "Blocked",
  InReview: "In Review",
  Done: "Done",
}
