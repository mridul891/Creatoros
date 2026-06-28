import { z } from "zod"

import { TASK_PRIORITIES } from "@/enums/task"

export const campaignTemplateTaskSchema = z.object({
  title: z.string().trim().min(2, "Task title must be at least 2 characters.").max(160, "Task title cannot exceed 160 characters."),
  description: z.string().trim().max(2000, "Task description cannot exceed 2000 characters.").optional(),
  priority: z.enum(TASK_PRIORITIES),
  dueOffsetDays: z.coerce
    .number()
    .int("Task due offset must be a whole number.")
    .min(0, "Task due offset cannot be negative.")
    .max(365, "Task due offset cannot exceed 365 days."),
})

export const campaignTemplateDeliverableSchema = z.object({
  platform: z.string().trim().min(2, "Platform is required.").max(80, "Platform cannot exceed 80 characters."),
  deliverableType: z.string().trim().min(2, "Deliverable type is required.").max(120, "Deliverable type cannot exceed 120 characters."),
  dueOffsetDays: z.coerce
    .number()
    .int("Deliverable due offset must be a whole number.")
    .min(0, "Deliverable due offset cannot be negative.")
    .max(365, "Deliverable due offset cannot exceed 365 days."),
})

export const campaignTemplateCreateUpdateSchema = z.object({
  name: z.string().trim().min(2, "Template name must be at least 2 characters.").max(120, "Template name cannot exceed 120 characters."),
  description: z.string().trim().max(1000, "Template description cannot exceed 1000 characters.").optional(),
  tasks: z.array(campaignTemplateTaskSchema).min(1, "Add at least one task to this template.").max(30, "Templates can include up to 30 tasks."),
  deliverables: z
    .array(campaignTemplateDeliverableSchema)
    .max(20, "Templates can include up to 20 deliverables."),
})

export type CampaignTemplateCreateUpdateInput = z.infer<typeof campaignTemplateCreateUpdateSchema>

export function normalizeTemplateName(name: string) {
  return name.toLowerCase().replace(/\s+/g, " ").trim()
}
