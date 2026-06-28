import type { TaskPriority } from "@/enums/task"

export interface CampaignTemplateTaskItem {
  id: string
  title: string
  description: string | null
  priority: TaskPriority
  dueOffsetDays: number
  orderIndex: number
}

export interface CampaignTemplateDeliverableItem {
  id: string
  platform: string
  deliverableType: string
  dueOffsetDays: number
  orderIndex: number
}

export interface CampaignTemplateItem {
  id: string
  name: string
  description: string | null
  isSystem: boolean
  tasks: CampaignTemplateTaskItem[]
  deliverables: CampaignTemplateDeliverableItem[]
  createdAt: Date
  updatedAt: Date
}

export interface CampaignTemplateTaskInput {
  title: string
  description?: string
  priority: TaskPriority
  dueOffsetDays: number
}

export interface CampaignTemplateDeliverableInput {
  platform: string
  deliverableType: string
  dueOffsetDays: number
}

export interface CampaignTemplateInput {
  name: string
  description?: string
  tasks: CampaignTemplateTaskInput[]
  deliverables: CampaignTemplateDeliverableInput[]
}

export type CampaignTemplateField =
  | "name"
  | "description"
  | "tasks"
  | "deliverables"
