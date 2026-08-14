import type {
  TaskArchiveFilter,
  TaskDueDateFilter,
  TaskPriority,
  TaskSortOption,
  TaskStatus,
} from "@/enums/task"

export interface TaskListItem {
  id: string
  dealId: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  dueDate: Date | null
  orderIndex: number
  isArchived: boolean
  archivedAt: Date | null
  createdBy: string
  updatedBy: string
  createdAt: Date
  updatedAt: Date
}

export interface TaskListData {
  items: TaskListItem[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
  filters: {
    search: string
    archive: TaskArchiveFilter
    sort: TaskSortOption
    dueDate: TaskDueDateFilter
    status?: TaskStatus
    priority?: TaskPriority
  }
  summary: {
    total: number
    completed: number
    upcoming: number
    overdue: number
    progress: number
  }
}

export interface TaskDetail extends TaskListItem {
  userId: string
}

export type TaskField =
  | "title"
  | "description"
  | "dealId"
  | "status"
  | "priority"
  | "dueDate"
  | "orderIndex"
  | "archived"
  | "taskId"
