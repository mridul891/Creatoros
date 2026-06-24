"use server"

import { revalidatePath } from "next/cache"

import { requireOnboardedUser } from "@/lib/auth/require-user"
import { sanitizeOptionalString } from "@/lib/crm/shared/form"
import {
  taskArchiveSchema,
  taskCreateSchema,
  taskDeleteSchema,
  taskListSchema,
  taskReorderSchema,
  taskRestoreSchema,
  taskStatusUpdateSchema,
  taskUpdateSchema,
} from "@/lib/crm/tasks/taskValidation"
import {
  archiveTask,
  createTask,
  deleteTask,
  getTask,
  listDealTasks,
  reorderTasks,
  restoreTask,
  TaskServiceError,
  updateTask,
  updateTaskStatus,
} from "@/lib/crm/tasks/taskService"
import { getFieldErrors } from "@/lib/crm/shared/action"
import type { TaskDetail, TaskField, TaskListData } from "@/types/task"

export type TaskMutationResult = {
  success: boolean
  message?: string
  data?: {
    id: string
    title?: string
    status?: TaskListData["items"][number]["status"]
  }
  fieldErrors?: Partial<Record<TaskField, string>>
}

type TaskGetResult =
  | {
      success: true
      data: TaskDetail
    }
  | {
      success: false
      message: string
    }

export type TaskListResult = {
  success: boolean
  message?: string
  data?: TaskListData
}

function mapTaskServiceError(error: unknown, fallbackMessage: string): TaskMutationResult {
  if (error instanceof TaskServiceError) {
    if ((error.code === "DUPLICATE" || error.code === "INVALID_OPERATION") && error.field) {
      return {
        success: false,
        message: error.message,
        fieldErrors: {
          [error.field]: error.message,
        },
      }
    }
    return {
      success: false,
      message: error.message,
    }
  }

  return {
    success: false,
    message: fallbackMessage,
  }
}

function parseTaskMutationFormData(formData: FormData) {
  return taskCreateSchema.safeParse({
    dealId: formData.get("dealId"),
    title: formData.get("title"),
    description: sanitizeOptionalString(formData.get("description")),
    status: formData.get("status"),
    priority: formData.get("priority"),
    dueDate: sanitizeOptionalString(formData.get("dueDate")),
    orderIndex: sanitizeOptionalString(formData.get("orderIndex")),
  })
}

function revalidateTaskPaths(dealId?: string) {
  revalidatePath("/dashboard/deals")
  if (dealId) {
    revalidatePath(`/dashboard/deals/${dealId}`)
  }
}

export async function listDealTasksAction(input: {
  dealId: string
  search?: string
  status?: string
  priority?: string
  archive?: string
  dueDate?: string
  sort?: string
  page?: number
  pageSize?: number
}): Promise<TaskListResult> {
  const user = await requireOnboardedUser()
  const parsed = taskListSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid tasks list request.",
    }
  }

  try {
    const data = await listDealTasks(user.id, parsed.data)
    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("tasks.list_failed", { userId: user.id, input: parsed.data, error })
    return {
      success: false,
      message: "We could not load tasks. Please try again.",
    }
  }
}

export async function getTaskAction(taskId: string): Promise<TaskGetResult> {
  const user = await requireOnboardedUser()
  const parsed = taskArchiveSchema.safeParse({ taskId })
  if (!parsed.success) {
    return {
      success: false,
      message: "Task id is invalid.",
    }
  }

  try {
    const data = await getTask(user.id, parsed.data.taskId)
    return {
      success: true,
      data,
    }
  } catch (error) {
    if (error instanceof TaskServiceError) {
      return {
        success: false,
        message: error.message,
      }
    }
    console.error("tasks.get_failed", { userId: user.id, taskId: parsed.data.taskId, error })
    return {
      success: false,
      message: "We could not load this task. Please try again.",
    }
  }
}

export async function createTaskAction(formData: FormData): Promise<TaskMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = parseTaskMutationFormData(formData)

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: getFieldErrors(parsed.error),
    }
  }

  try {
    const data = await createTask(user.id, parsed.data)
    revalidateTaskPaths(parsed.data.dealId)
    return {
      success: true,
      message: "Task created successfully.",
      data,
    }
  } catch (error) {
    console.error("tasks.create_failed", { userId: user.id, error })
    return mapTaskServiceError(error, "We could not create this task. Please try again.")
  }
}

export async function updateTaskAction(formData: FormData): Promise<TaskMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = taskUpdateSchema.safeParse({
    taskId: formData.get("taskId"),
    dealId: formData.get("dealId"),
    title: formData.get("title"),
    description: sanitizeOptionalString(formData.get("description")),
    status: formData.get("status"),
    priority: formData.get("priority"),
    dueDate: sanitizeOptionalString(formData.get("dueDate")),
    orderIndex: sanitizeOptionalString(formData.get("orderIndex")),
  })

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: getFieldErrors(parsed.error),
    }
  }

  try {
    const { taskId, ...payload } = parsed.data
    const data = await updateTask(user.id, taskId, payload)
    revalidateTaskPaths(payload.dealId)
    return {
      success: true,
      message: "Task updated successfully.",
      data,
    }
  } catch (error) {
    console.error("tasks.update_failed", { userId: user.id, taskId: parsed.data.taskId, error })
    return mapTaskServiceError(error, "We could not update this task. Please try again.")
  }
}

export async function updateTaskStatusAction(taskId: string, status: string): Promise<TaskMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = taskStatusUpdateSchema.safeParse({ taskId, status })

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid task status update request.",
    }
  }

  try {
    const data = await updateTaskStatus(user.id, parsed.data)
    revalidateTaskPaths(data.dealId)
    return {
      success: true,
      message: "Task status updated.",
      data,
    }
  } catch (error) {
    console.error("tasks.status_update_failed", { userId: user.id, taskId: parsed.data.taskId, status: parsed.data.status, error })
    return mapTaskServiceError(error, "We could not update this task status. Please try again.")
  }
}

export async function archiveTaskAction(taskId: string): Promise<TaskMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = taskArchiveSchema.safeParse({ taskId })
  if (!parsed.success) {
    return {
      success: false,
      message: "Task id is invalid.",
    }
  }

  try {
    const data = await archiveTask(user.id, parsed.data.taskId)
    revalidateTaskPaths(data.dealId)
    return {
      success: true,
      message: "Task archived successfully.",
    }
  } catch (error) {
    console.error("tasks.archive_failed", { userId: user.id, taskId: parsed.data.taskId, error })
    return mapTaskServiceError(error, "We could not archive this task. Please try again.")
  }
}

export async function restoreTaskAction(taskId: string): Promise<TaskMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = taskRestoreSchema.safeParse({ taskId })
  if (!parsed.success) {
    return {
      success: false,
      message: "Task id is invalid.",
    }
  }

  try {
    const data = await restoreTask(user.id, parsed.data.taskId)
    revalidateTaskPaths(data.dealId)
    return {
      success: true,
      message: "Task restored successfully.",
    }
  } catch (error) {
    console.error("tasks.restore_failed", { userId: user.id, taskId: parsed.data.taskId, error })
    return mapTaskServiceError(error, "We could not restore this task. Please try again.")
  }
}

export async function deleteTaskAction(taskId: string): Promise<TaskMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = taskDeleteSchema.safeParse({ taskId })
  if (!parsed.success) {
    return {
      success: false,
      message: "Task id is invalid.",
    }
  }

  try {
    const data = await deleteTask(user.id, parsed.data.taskId)
    revalidateTaskPaths(data.dealId)
    return {
      success: true,
      message: "Task deleted successfully.",
    }
  } catch (error) {
    console.error("tasks.delete_failed", { userId: user.id, taskId: parsed.data.taskId, error })
    return mapTaskServiceError(error, "We could not delete this task. Please try again.")
  }
}

export async function reorderTasksAction(dealId: string, orderedTaskIds: string[]): Promise<TaskMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = taskReorderSchema.safeParse({ dealId, orderedTaskIds })

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid reorder request.",
    }
  }

  try {
    await reorderTasks(user.id, parsed.data.dealId, parsed.data.orderedTaskIds)
    revalidateTaskPaths(parsed.data.dealId)
    return {
      success: true,
      message: "Tasks reordered.",
    }
  } catch (error) {
    console.error("tasks.reorder_failed", { userId: user.id, dealId: parsed.data.dealId, error })
    return mapTaskServiceError(error, "We could not reorder tasks. Please try again.")
  }
}
