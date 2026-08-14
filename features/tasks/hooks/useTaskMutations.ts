"use client"

import { useState } from "react"
import { toast } from "sonner"

import {
  archiveTaskAction,
  createTaskAction,
  deleteTaskAction,
  restoreTaskAction,
  updateTaskAction,
  updateTaskStatusAction,
} from "@/features/tasks/actions/taskActions"
import type { TaskListItem } from "@/features/tasks/types/task"
import {
  buildTaskFormData,
  type TaskFormValues,
} from "@/features/tasks/utils/taskForm"

type UseTaskMutationsOptions = {
  onRefresh: () => void
}

export function useTaskMutations({ onRefresh }: UseTaskMutationsOptions) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMutating, setIsMutating] = useState(false)
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null)

  async function submitCreate(values: TaskFormValues) {
    setIsSubmitting(true)
    try {
      return await createTaskAction(buildTaskFormData(values))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function submitUpdate(taskId: string, values: TaskFormValues) {
    setIsSubmitting(true)
    try {
      return await updateTaskAction(buildTaskFormData(values, taskId))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function runStatusChange(
    taskId: string,
    status: TaskListItem["status"]
  ) {
    setUpdatingTaskId(taskId)
    let result
    try {
      result = await updateTaskStatusAction(taskId, status)
    } finally {
      setUpdatingTaskId(null)
    }
    if (!result.success) {
      toast.error(result.message ?? "Could not update task status.")
      return result
    }
    toast.success(result.message ?? "Task status updated.")
    onRefresh()
    return result
  }

  async function runArchive(taskId: string) {
    setIsMutating(true)
    const result = await archiveTaskAction(taskId)
    setIsMutating(false)
    if (!result.success) {
      toast.error(result.message ?? "Could not archive task.")
      return result
    }
    toast.success(result.message ?? "Task archived.")
    onRefresh()
    return result
  }

  async function runRestore(taskId: string) {
    setIsMutating(true)
    const result = await restoreTaskAction(taskId)
    setIsMutating(false)
    if (!result.success) {
      toast.error(result.message ?? "Could not restore task.")
      return result
    }
    toast.success(result.message ?? "Task restored.")
    onRefresh()
    return result
  }

  async function runDelete(taskId: string) {
    setIsMutating(true)
    const result = await deleteTaskAction(taskId)
    setIsMutating(false)
    if (!result.success) {
      toast.error(result.message ?? "Could not delete task.")
      return result
    }
    toast.success(result.message ?? "Task deleted.")
    onRefresh()
    return result
  }

  return {
    isSubmitting,
    isMutating,
    updatingTaskId,
    submitCreate,
    submitUpdate,
    runStatusChange,
    runArchive,
    runRestore,
    runDelete,
  }
}
