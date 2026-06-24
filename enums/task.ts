export const TASK_STATUSES = ["Todo", "InProgress", "Blocked", "InReview", "Done"] as const
export const TASK_PRIORITIES = ["Low", "Medium", "High", "Urgent"] as const
export const TASK_SORT_OPTIONS = ["order", "dueDate", "updatedAt", "priority"] as const
export const TASK_ARCHIVE_FILTERS = ["active", "archived"] as const
export const TASK_DUE_DATE_FILTERS = ["all", "upcoming", "overdue", "none"] as const

export type TaskStatus = (typeof TASK_STATUSES)[number]
export type TaskPriority = (typeof TASK_PRIORITIES)[number]
export type TaskSortOption = (typeof TASK_SORT_OPTIONS)[number]
export type TaskArchiveFilter = (typeof TASK_ARCHIVE_FILTERS)[number]
export type TaskDueDateFilter = (typeof TASK_DUE_DATE_FILTERS)[number]

const ALLOWED_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  Todo: ["InProgress", "Blocked"],
  InProgress: ["Blocked", "InReview"],
  Blocked: ["Todo", "InProgress"],
  InReview: ["InProgress", "Done"],
  Done: ["InProgress"],
}

export function isValidTaskStatusTransition(from: TaskStatus, to: TaskStatus) {
  if (from === to) {
    return true
  }
  return ALLOWED_TRANSITIONS[from].includes(to)
}

export function getAllowedNextStatuses(from: TaskStatus) {
  return [from, ...ALLOWED_TRANSITIONS[from]]
}

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  Todo: "Todo",
  InProgress: "In Progress",
  Blocked: "Blocked",
  InReview: "In Review",
  Done: "Done",
}
