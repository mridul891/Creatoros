import type { TaskPriority } from "@/enums/task"
import type { CampaignTemplateItem } from "@/types/campaignTemplate"

export type TemplateTaskFormValues = {
  title: string
  description: string
  priority: TaskPriority
  dueOffsetDays: string
}

export type TemplateDeliverableFormValues = {
  platform: string
  deliverableType: string
  dueOffsetDays: string
}

export type CampaignTemplateFormValues = {
  name: string
  description: string
  tasks: TemplateTaskFormValues[]
  deliverables: TemplateDeliverableFormValues[]
}

export const EMPTY_TEMPLATE_TASK: TemplateTaskFormValues = {
  title: "",
  description: "",
  priority: "Medium",
  dueOffsetDays: "0",
}

export const EMPTY_TEMPLATE_DELIVERABLE: TemplateDeliverableFormValues = {
  platform: "",
  deliverableType: "",
  dueOffsetDays: "0",
}

export const EMPTY_TEMPLATE_FORM: CampaignTemplateFormValues = {
  name: "",
  description: "",
  tasks: [{ ...EMPTY_TEMPLATE_TASK }],
  deliverables: [],
}

export function templateToFormValues(template: CampaignTemplateItem): CampaignTemplateFormValues {
  return {
    name: template.name,
    description: template.description ?? "",
    tasks: template.tasks.map((task) => ({
      title: task.title,
      description: task.description ?? "",
      priority: task.priority,
      dueOffsetDays: String(task.dueOffsetDays),
    })),
    deliverables: template.deliverables.map((deliverable) => ({
      platform: deliverable.platform,
      deliverableType: deliverable.deliverableType,
      dueOffsetDays: String(deliverable.dueOffsetDays),
    })),
  }
}

export function buildTemplateInput(values: CampaignTemplateFormValues) {
  return {
    name: values.name,
    description: values.description,
    tasks: values.tasks.map((task) => ({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueOffsetDays: Number(task.dueOffsetDays || 0),
    })),
    deliverables: values.deliverables.map((deliverable) => ({
      platform: deliverable.platform,
      deliverableType: deliverable.deliverableType,
      dueOffsetDays: Number(deliverable.dueOffsetDays || 0),
    })),
  }
}
