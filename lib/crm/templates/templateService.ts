import type { Prisma, PrismaClient } from "@prisma/client"

import { ACTIVITY_ENTITY, ACTIVITY_TYPE } from "@/enums/activity"
import { normalizeTaskTitle } from "@/lib/crm/tasks/taskValidation"
import { normalizeDeliverableType } from "@/lib/crm/deliverables/deliverableValidation"
import { normalizeTemplateName, type CampaignTemplateCreateUpdateInput } from "@/lib/crm/templates/templateValidation"
import { recordActivity } from "@/lib/crm/activity/activityService"
import { prisma } from "@/lib/prisma"
import type { CampaignTemplateItem } from "@/types/campaignTemplate"

type PrismaTx = Prisma.TransactionClient | PrismaClient

type OwnedDeal = {
  id: string
  userId: string
  brandId: string
  contactId: string | null
  campaignName: string
  status: "Active" | "Archived"
}

export class TemplateServiceError extends Error {
  code: "NOT_FOUND" | "DUPLICATE" | "INVALID_OPERATION" | "FORBIDDEN" | "UNKNOWN"
  field?: "name"

  constructor(message: string, code: TemplateServiceError["code"], field?: TemplateServiceError["field"]) {
    super(message)
    this.name = "TemplateServiceError"
    this.code = code
    this.field = field
  }
}

const SYSTEM_TEMPLATE_NAME = "Instagram Reel Campaign"

async function getOwnedDeal(tx: PrismaTx, userId: string, dealId: string): Promise<OwnedDeal> {
  const deal = await tx.deal.findFirst({
    where: { id: dealId, userId },
    select: {
      id: true,
      userId: true,
      brandId: true,
      contactId: true,
      campaignName: true,
      status: true,
    },
  })

  if (!deal) {
    throw new TemplateServiceError("Deal not found.", "NOT_FOUND")
  }

  return deal
}

async function getOwnedTemplate(tx: PrismaTx, userId: string, templateId: string) {
  const template = await tx.campaignTemplate.findFirst({
    where: { id: templateId, userId },
    include: {
      tasks: {
        orderBy: { orderIndex: "asc" },
      },
      deliverables: {
        orderBy: { orderIndex: "asc" },
      },
    },
  })

  if (!template) {
    throw new TemplateServiceError("Template not found.", "NOT_FOUND")
  }

  return template
}

function toTemplateItem(template: {
  id: string
  name: string
  description: string | null
  isSystem: boolean
  tasks: Array<{ id: string; title: string; description: string | null; priority: string; dueOffsetDays: number; orderIndex: number }>
  deliverables: Array<{ id: string; platform: string; deliverableType: string; dueOffsetDays: number; orderIndex: number }>
  createdAt: Date
  updatedAt: Date
}): CampaignTemplateItem {
  return {
    id: template.id,
    name: template.name,
    description: template.description,
    isSystem: template.isSystem,
    tasks: template.tasks.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      priority: item.priority as CampaignTemplateItem["tasks"][number]["priority"],
      dueOffsetDays: item.dueOffsetDays,
      orderIndex: item.orderIndex,
    })),
    deliverables: template.deliverables.map((item) => ({
      id: item.id,
      platform: item.platform,
      deliverableType: item.deliverableType,
      dueOffsetDays: item.dueOffsetDays,
      orderIndex: item.orderIndex,
    })),
    createdAt: template.createdAt,
    updatedAt: template.updatedAt,
  }
}

export async function ensureSystemCampaignTemplates(userId: string) {
  const existing = await prisma.campaignTemplate.findFirst({
    where: {
      userId,
      normalizedName: SYSTEM_TEMPLATE_NAME.toLowerCase(),
    },
    select: { id: true },
  })

  if (existing) {
    return existing.id
  }

  const created = await prisma.campaignTemplate.create({
    data: {
      userId,
      name: SYSTEM_TEMPLATE_NAME,
      normalizedName: SYSTEM_TEMPLATE_NAME.toLowerCase(),
      description: "Default workflow for a sponsored Instagram Reel campaign.",
      isSystem: true,
      tasks: {
        create: [
          { title: "Align brief with brand", dueOffsetDays: 0, orderIndex: 0, priority: "High" },
          { title: "Draft script and shot list", dueOffsetDays: 1, orderIndex: 1, priority: "High" },
          { title: "Shoot reel content", dueOffsetDays: 2, orderIndex: 2, priority: "Medium" },
          { title: "Edit reel and caption", dueOffsetDays: 3, orderIndex: 3, priority: "Medium" },
          { title: "Submit for brand approval", dueOffsetDays: 4, orderIndex: 4, priority: "High" },
        ],
      },
      deliverables: {
        create: [{ platform: "Instagram", deliverableType: "Reel", dueOffsetDays: 4, orderIndex: 0 }],
      },
    },
    select: { id: true },
  })

  return created.id
}

export async function listCampaignTemplates(userId: string): Promise<CampaignTemplateItem[]> {
  await ensureSystemCampaignTemplates(userId)

  const templates = await prisma.campaignTemplate.findMany({
    where: { userId },
    include: {
      tasks: {
        orderBy: { orderIndex: "asc" },
      },
      deliverables: {
        orderBy: { orderIndex: "asc" },
      },
    },
    orderBy: [{ isSystem: "desc" }, { updatedAt: "desc" }],
  })

  return templates.map((item) => toTemplateItem(item))
}

function mapPrismaError(error: unknown): never {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string" &&
    error.code === "P2002"
  ) {
    throw new TemplateServiceError("A template with this name already exists.", "DUPLICATE", "name")
  }

  throw error
}

function buildTemplateWriteData(input: CampaignTemplateCreateUpdateInput) {
  return {
    name: input.name,
    normalizedName: normalizeTemplateName(input.name),
    description: input.description ?? null,
    tasks: {
      create: input.tasks.map((task, index) => ({
        title: task.title,
        description: task.description ?? null,
        priority: task.priority,
        dueOffsetDays: task.dueOffsetDays,
        orderIndex: index,
      })),
    },
    deliverables: {
      create: input.deliverables.map((deliverable, index) => ({
        platform: deliverable.platform,
        deliverableType: deliverable.deliverableType,
        dueOffsetDays: deliverable.dueOffsetDays,
        orderIndex: index,
      })),
    },
  }
}

export async function createCampaignTemplate(userId: string, input: CampaignTemplateCreateUpdateInput): Promise<CampaignTemplateItem> {
  try {
    const created = await prisma.campaignTemplate.create({
      data: {
        userId,
        isSystem: false,
        ...buildTemplateWriteData(input),
      },
      include: {
        tasks: {
          orderBy: { orderIndex: "asc" },
        },
        deliverables: {
          orderBy: { orderIndex: "asc" },
        },
      },
    })

    return toTemplateItem(created)
  } catch (error) {
    mapPrismaError(error)
  }
}

export async function updateCampaignTemplate(
  userId: string,
  templateId: string,
  input: CampaignTemplateCreateUpdateInput
): Promise<CampaignTemplateItem> {
  return prisma.$transaction(async (tx) => {
    const existing = await getOwnedTemplate(tx, userId, templateId)
    if (existing.isSystem) {
      throw new TemplateServiceError("System templates cannot be edited.", "FORBIDDEN")
    }

    let updated: Awaited<ReturnType<typeof getOwnedTemplate>>
    try {
      updated = await tx.campaignTemplate.update({
        where: { id: existing.id },
        data: {
          name: input.name,
          normalizedName: normalizeTemplateName(input.name),
          description: input.description ?? null,
          tasks: {
            deleteMany: {},
            create: input.tasks.map((task, index) => ({
              title: task.title,
              description: task.description ?? null,
              priority: task.priority,
              dueOffsetDays: task.dueOffsetDays,
              orderIndex: index,
            })),
          },
          deliverables: {
            deleteMany: {},
            create: input.deliverables.map((deliverable, index) => ({
              platform: deliverable.platform,
              deliverableType: deliverable.deliverableType,
              dueOffsetDays: deliverable.dueOffsetDays,
              orderIndex: index,
            })),
          },
        },
        include: {
          tasks: {
            orderBy: { orderIndex: "asc" },
          },
          deliverables: {
            orderBy: { orderIndex: "asc" },
          },
        },
      })
    } catch (error) {
      mapPrismaError(error)
    }

    return toTemplateItem(updated)
  })
}

export async function deleteCampaignTemplate(userId: string, templateId: string) {
  return prisma.$transaction(async (tx) => {
    const template = await getOwnedTemplate(tx, userId, templateId)
    if (template.isSystem) {
      throw new TemplateServiceError("System templates cannot be deleted.", "FORBIDDEN")
    }

    await tx.campaignTemplate.delete({
      where: { id: template.id },
    })

    return {
      id: template.id,
      name: template.name,
    }
  })
}

function addDays(date: Date, offsetDays: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + offsetDays)
  return result
}

export async function applyCampaignTemplateInTransaction(tx: PrismaTx, userId: string, dealId: string, templateId: string) {
  const deal = await getOwnedDeal(tx, userId, dealId)
  if (deal.status === "Archived") {
    throw new TemplateServiceError("Templates cannot be applied to archived deals.", "INVALID_OPERATION")
  }

  const template = await getOwnedTemplate(tx, userId, templateId)
  const baseDate = new Date()

  for (const [index, task] of template.tasks.entries()) {
    const taskDue = addDays(baseDate, task.dueOffsetDays)
    await tx.task.create({
      data: {
        userId,
        dealId: deal.id,
        title: task.title,
        normalizedTitle: normalizeTaskTitle(task.title),
        description: task.description ?? null,
        status: "Todo",
        priority: task.priority,
        dueDate: taskDue,
        orderIndex: index,
        createdBy: userId,
        updatedBy: userId,
      },
    })
  }

  for (const [index, deliverable] of template.deliverables.entries()) {
    const dueDate = addDays(baseDate, deliverable.dueOffsetDays)
    await tx.deliverable.create({
      data: {
        userId,
        dealId: deal.id,
        platform: deliverable.platform,
        deliverableType: deliverable.deliverableType,
        normalizedDeliverableType: normalizeDeliverableType(deliverable.deliverableType),
        dueDate,
        status: "Draft",
        approvalStatus: "NotSubmitted",
        revisionCount: 0,
        orderIndex: index,
        createdBy: userId,
        updatedBy: userId,
      },
    })
  }

  await tx.dealNote.create({
    data: {
      userId,
      dealId: deal.id,
      title: `${template.name} checklist`,
      content: `Template applied: ${template.name}\n\n- Review campaign brief\n- Confirm approval checkpoints\n- Track deliverable submission timeline`,
      isPinned: true,
      status: "Active",
      createdBy: userId,
      updatedBy: userId,
    },
  })

  await recordActivity(tx, {
    userId,
    type: ACTIVITY_TYPE.DEAL_UPDATED,
    entityType: ACTIVITY_ENTITY.DEAL,
    entityId: deal.id,
    dealId: deal.id,
    brandId: deal.brandId,
    contactId: deal.contactId,
    title: "Campaign template applied",
    description: `${template.name} template was applied to ${deal.campaignName}.`,
    metadata: {
      templateId: template.id,
      templateName: template.name,
      tasksCreated: template.tasks.length,
      deliverablesCreated: template.deliverables.length,
    },
  })
}

export async function applyCampaignTemplate(userId: string, dealId: string, templateId: string) {
  return prisma.$transaction(async (tx) => {
    await applyCampaignTemplateInTransaction(tx, userId, dealId, templateId)
  })
}
