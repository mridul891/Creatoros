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
