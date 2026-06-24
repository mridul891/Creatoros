import { z } from "zod"

import {
  TASK_ARCHIVE_FILTERS,
  TASK_DUE_DATE_FILTERS,
  TASK_PRIORITIES,
  TASK_SORT_OPTIONS,
  TASK_STATUSES,
  type TaskPriority,
} from "@/enums/task"
import type { TaskField } from "@/types/task"
import type { TaskFormValues } from "./taskForm"
import { getFieldErrors } from "../shared/action"
import { parseTaskDateInput } from "./taskDate"

const stringDateToDate = z.preprocess((value) => {
  if (value instanceof Date) {
    return value
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    return undefined
  }

  const date = parseTaskDateInput(value)
  if (!date) {
    return undefined
  }

  if (Number.isNaN(date.getTime())) {
    return undefined
  }

  return date
}, z.date().optional())

const taskBaseSchema = z.object({
  dealId: z.uuid("Deal id is invalid."),
  title: z.string().trim().min(2, "Task title must be at least 2 characters.").max(180, "Task title cannot exceed 180 characters."),
  description: z.string().trim().max(5000, "Description cannot exceed 5000 characters.").optional(),
  status: z.enum(TASK_STATUSES),
  priority: z.enum(TASK_PRIORITIES),
  dueDate: stringDateToDate,
  orderIndex: z.coerce.number().int().nonnegative().optional(),
})

export const taskCreateSchema = taskBaseSchema.extend({
  status: z.literal("Todo"),
})

export const taskCreateUpdateSchema = taskBaseSchema

export const taskUpdateSchema = taskBaseSchema.extend({
  taskId: z.uuid("Task id is invalid."),
})

export const taskListSchema = z.object({
  dealId: z.uuid("Deal id is invalid."),
  search: z.string().trim().max(120).optional(),
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  archive: z.enum(TASK_ARCHIVE_FILTERS).default("active"),
  dueDate: z.enum(TASK_DUE_DATE_FILTERS).default("all"),
  sort: z.enum(TASK_SORT_OPTIONS).default("order"),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
})

export const taskArchiveSchema = z.object({
  taskId: z.uuid("Task id is invalid."),
})

export const taskRestoreSchema = taskArchiveSchema
export const taskDeleteSchema = taskArchiveSchema

export const taskStatusUpdateSchema = z.object({
  taskId: z.uuid("Task id is invalid."),
  status: z.enum(TASK_STATUSES),
})

export const taskReorderSchema = z.object({
  dealId: z.uuid("Deal id is invalid."),
  orderedTaskIds: z.array(z.uuid("Task id is invalid.")).min(1, "At least one task is required."),
})

export type TaskCreateUpdateInput = z.infer<typeof taskCreateUpdateSchema>
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>
export type TaskListInput = z.infer<typeof taskListSchema>
export type TaskStatusUpdateInput = z.infer<typeof taskStatusUpdateSchema>
export type TaskReorderInput = z.infer<typeof taskReorderSchema>

export function normalizeTaskTitle(title: string) {
  return title.toLowerCase().replace(/\s+/g, " ").trim()
}

function toOptionalString(value: string) {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

export function toPrioritySortValue(priority: TaskPriority) {
  switch (priority) {
    case "Urgent":
      return 4
    case "High":
      return 3
    case "Medium":
      return 2
    default:
      return 1
  }
}

export function getTaskFormFieldErrors(values: TaskFormValues): Partial<Record<TaskField, string>> {
  const parsed = taskCreateUpdateSchema.safeParse({
    dealId: values.dealId,
    title: values.title,
    description: toOptionalString(values.description),
    status: values.status,
    priority: values.priority,
    dueDate: toOptionalString(values.dueDate),
    orderIndex: toOptionalString(values.orderIndex),
  })

  if (parsed.success) {
    return {}
  }

  return getFieldErrors<TaskField>(parsed.error)
}
