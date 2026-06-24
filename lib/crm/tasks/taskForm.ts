import type { TaskPriority, TaskStatus } from "@/enums/task"
import type { TaskDetail, TaskListItem } from "@/types/task"
import { formatTaskDateInput } from "./taskDate"

export type TaskFormValues = {
  dealId: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  orderIndex: string

}

export const EMPTY_TASK_FORM: TaskFormValues = {
  dealId: "",
  title: "",
  description: "",
  status: "Todo",
  priority: "Medium",
  dueDate: "",
  orderIndex: "",
}

function toDateInputValue(date: Date | null) {
  return formatTaskDateInput(date)
}

export function taskToFormValues(task: Pick<TaskListItem, "dealId" | "title" | "description" | "status" | "priority" | "dueDate" | "orderIndex">): TaskFormValues {
  return {
    dealId: task.dealId,
    title: task.title,
    description: task.description ?? "",
    status: task.status,
    priority: task.priority,
    dueDate: toDateInputValue(task.dueDate),
    orderIndex: String(task.orderIndex),
  }
}

export function taskDetailToFormValues(task: TaskDetail): TaskFormValues {
  return taskToFormValues(task)
}

export function buildTaskFormData(values: TaskFormValues, taskId?: string) {
  const formData = new FormData()
  if (taskId) {
    formData.set("taskId", taskId)
  }
  formData.set("dealId", values.dealId)
  formData.set("title", values.title)
  formData.set("description", values.description)
  formData.set("status", values.status)
  formData.set("priority", values.priority)
  formData.set("dueDate", values.dueDate)
  formData.set("orderIndex", values.orderIndex)
  return formData
}
