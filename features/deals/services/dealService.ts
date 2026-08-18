import type { Prisma, PrismaClient } from "@prisma/client"

import { ACTIVITY_ENTITY, ACTIVITY_TYPE } from "@/enums/activity"
import { recordActivity } from "@/features/activity"
import { findOwnedBrand } from "@/features/brands"
import { isValidStageTransition } from "@/features/deals/enums/deal"
import {
  type DealCreateUpdateInput,
  type DealListInput,
  normalizeCampaignName,
  normalizeCurrency,
} from "@/features/deals/schemas/dealValidation"
import type {
  DealDetail,
  DealListData,
  DealListItem,
} from "@/features/deals/types/deal"
import { applyCampaignTemplateInTransaction } from "@/features/templates"
import { prisma } from "@/lib/db/prisma"
import {
  clampPage,
  clampPageSize,
  PAGE_SIZE_DEFAULT,
  PAGE_SIZE_MAX,
} from "@/lib/utils/pagination"

type PrismaTx = Prisma.TransactionClient | PrismaClient

const TERMINAL_STAGES = new Set(["Paid", "Cancelled"])

export class DealServiceError extends Error {
  code:
    | "NOT_FOUND"
    | "DUPLICATE"
    | "INVALID_OPERATION"
    | "FORBIDDEN"
    | "UNKNOWN"
  field?: "campaignName" | "contactId" | "stage" | "priority"

  constructor(
    message: string,
    code: DealServiceError["code"],
    field?: DealServiceError["field"]
  ) {
    super(message)
    this.name = "DealServiceError"
    this.code = code
    this.field = field
  }
}

type DealProjection = {
  id: string
  brandId: string
  campaignName: string
  dealValue: Prisma.Decimal
  currency: string
  stage: string
  priority: string
  status: string
  contactId: string | null
  startDate: Date | null
  dueDate: Date | null
  expectedCloseDate: Date | null
  paymentDueDate: Date | null
  updatedAt: Date
  brand: {
    name: string
  }
  contact: {
    name: string
  } | null
}

function toNumber(value: Prisma.Decimal) {
  return Number(value)
}

function toListItem(deal: DealProjection): DealListItem {
  return {
    id: deal.id,
    brandId: deal.brandId,
    brandName: deal.brand.name,
    contactId: deal.contactId,
    contactName: deal.contact?.name ?? null,
    campaignName: deal.campaignName,
    dealValue: toNumber(deal.dealValue),
    currency: deal.currency,
    stage: deal.stage as DealListItem["stage"],
    priority: deal.priority as DealListItem["priority"],
    status: deal.status as DealListItem["status"],
    startDate: deal.startDate,
    dueDate: deal.dueDate,
    expectedCloseDate: deal.expectedCloseDate,
    paymentDueDate: deal.paymentDueDate,
    updatedAt: deal.updatedAt,
  }
}

async function requireOwnedBrand(
  userId: string,
  brandId: string,
  tx: PrismaTx
) {
  const brand = await findOwnedBrand(userId, brandId, tx)
  if (!brand) {
    throw new DealServiceError("Brand not found.", "NOT_FOUND")
  }
}

async function assertOwnedContact(options: {
  tx: PrismaTx
  userId: string
  brandId: string
  contactId: string
}) {
  const contact = await options.tx.contact.findFirst({
    where: {
      id: options.contactId,
      userId: options.userId,
      brandId: options.brandId,
      status: "Active",
    },
    select: { id: true },
  })

  if (!contact) {
    throw new DealServiceError(
      "Selected contact is not valid for this brand.",
      "INVALID_OPERATION",
      "contactId"
    )
  }
}

async function getOwnedDeal(tx: PrismaTx, userId: string, dealId: string) {
  const deal = await tx.deal.findFirst({
    where: { id: dealId, userId },
  })

  if (!deal) {
    throw new DealServiceError("Deal not found.", "NOT_FOUND")
  }

  return deal
}

async function ensureNoActiveDuplicate(options: {
  tx: PrismaTx
  userId: string
  brandId: string
  normalizedCampaignName: string
  excludingId?: string
}) {
  const duplicate = await options.tx.deal.findFirst({
    where: {
      userId: options.userId,
      brandId: options.brandId,
      normalizedCampaignName: options.normalizedCampaignName,
      ...(options.excludingId ? { id: { not: options.excludingId } } : {}),
    },
    select: { id: true },
  })

  if (duplicate) {
    throw new DealServiceError(
      "A deal with the same campaign name already exists for this brand.",
      "DUPLICATE",
      "campaignName"
    )
  }
}

function getStageMilestones(stage: DealCreateUpdateInput["stage"]) {
  const now = new Date()
  return {
    deliveredAt: stage === "Delivered" ? now : null,
    completedAt: stage === "Completed" ? now : null,
    paidAt: stage === "Paid" ? now : null,
  }
}

function applyStageMilestones(
  stage: DealCreateUpdateInput["stage"],
  existing?: {
    deliveredAt: Date | null
    completedAt: Date | null
    paidAt: Date | null
  }
) {
  const now = new Date()
  const stageIndex = [
    "Lead",
    "Contacted",
    "Negotiation",
    "ProposalSent",
    "ContractSigned",
    "Active",
    "Delivered",
    "Completed",
    "Paid",
    "Cancelled",
  ].indexOf(stage)
  const deliveredIndex = 6
  const completedIndex = 7
  const paidIndex = 8

  return {
    deliveredAt:
      stageIndex >= deliveredIndex ? (existing?.deliveredAt ?? now) : null,
    completedAt:
      stageIndex >= completedIndex ? (existing?.completedAt ?? now) : null,
    paidAt: stageIndex >= paidIndex ? (existing?.paidAt ?? now) : null,
  }
}

function mapPrismaError(error: unknown): never {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string" &&
    error.code === "P2002"
  ) {
    throw new DealServiceError(
      "A deal with the same campaign name already exists for this brand.",
      "DUPLICATE",
      "campaignName"
    )
  }

  throw error
}

function buildListWhere(
  userId: string,
  input: DealListInput
): Prisma.DealWhereInput {
  const search = input.search?.trim() ?? ""
  const fromDate = input.fromDate ? new Date(input.fromDate) : undefined
  const toDate = input.toDate ? new Date(input.toDate) : undefined

  return {
    userId,
    status: input.archive === "archived" ? "Archived" : "Active",
    ...(input.stage ? { stage: input.stage } : {}),
    ...(input.priority ? { priority: input.priority } : {}),
    ...(input.brandId ? { brandId: input.brandId } : {}),
    ...(fromDate || toDate
      ? {
          dueDate: {
            ...(fromDate ? { gte: fromDate } : {}),
            ...(toDate ? { lte: toDate } : {}),
          },
        }
      : {}),
    ...(search
      ? {
          OR: [
            { campaignName: { contains: search, mode: "insensitive" } },
            { brand: { name: { contains: search, mode: "insensitive" } } },
            { contact: { name: { contains: search, mode: "insensitive" } } },
            { contact: { email: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {}),
  }
}

function getSortOrder(
  sort: DealListInput["sort"]
): Prisma.DealOrderByWithRelationInput {
  switch (sort) {
    case "value":
      return { dealValue: "desc" }
    case "dueDate":
      return { dueDate: "asc" }
    default:
      return { updatedAt: "desc" }
  }
}

async function buildWidgets(userId: string): Promise<DealListData["widgets"]> {
  const now = new Date()
  const soonDate = new Date()
  soonDate.setDate(now.getDate() + 14)

  const activeDealsPromise = prisma.deal.count({
    where: {
      userId,
      status: "Active",
      stage: { notIn: ["Paid", "Cancelled"] },
    },
  })

  const dealsInProgressPromise = prisma.deal.aggregate({
    where: {
      userId,
      status: "Active",
      stage: { notIn: ["Paid", "Cancelled"] },
    },
    _sum: {
      dealValue: true,
    },
  })

  const dealsClosingSoonPromise = prisma.deal.count({
    where: {
      userId,
      status: "Active",
      dueDate: { gte: now, lte: soonDate },
      stage: { notIn: ["Paid", "Cancelled"] },
    },
  })

  const overdueDealsPromise = prisma.deal.count({
    where: {
      userId,
      status: "Active",
      dueDate: { lt: now },
      stage: { notIn: ["Paid", "Cancelled", "Completed"] },
    },
  })

  const highestValueDealsPromise = prisma.deal.findMany({
    where: { userId, status: "Active" },
    orderBy: { dealValue: "desc" },
    take: 5,
    select: {
      id: true,
      brandId: true,
      campaignName: true,
      dealValue: true,
      currency: true,
      stage: true,
      priority: true,
      status: true,
      contactId: true,
      startDate: true,
      dueDate: true,
      expectedCloseDate: true,
      paymentDueDate: true,
      updatedAt: true,
      brand: { select: { name: true } },
      contact: { select: { name: true } },
    },
  })

  const [
    activeDeals,
    inProgressDeals,
    dealsClosingSoon,
    overdueDeals,
    highestValueDeals,
  ] = await Promise.all([
    activeDealsPromise,
    dealsInProgressPromise,
    dealsClosingSoonPromise,
    overdueDealsPromise,
    highestValueDealsPromise,
  ])

  return {
    activeDeals,
    revenueInProgress: inProgressDeals._sum.dealValue
      ? toNumber(inProgressDeals._sum.dealValue)
      : 0,
    dealsClosingSoon,
    overdueDeals,
    highestValueDeals: highestValueDeals.map((item) => toListItem(item)),
  }
}

export async function listDeals(
  userId: string,
  input: DealListInput
): Promise<DealListData> {
  const requestedPage = clampPage(input.page)
  const requestedPageSize = clampPageSize(input.pageSize, {
    pageSize: PAGE_SIZE_DEFAULT,
    maxPageSize: PAGE_SIZE_MAX,
  })
  const isKanbanView = input.view === "kanban"
  const page = isKanbanView ? 1 : requestedPage
  const pageSize = isKanbanView ? PAGE_SIZE_MAX : requestedPageSize
  const skip = (page - 1) * pageSize
  const where = buildListWhere(userId, input)
  const orderBy = getSortOrder(input.sort)

  const [listResult, widgets] = await Promise.all([
    prisma.$transaction(async (tx) => {
      const total = await tx.deal.count({ where })
      const items = await tx.deal.findMany({
        where,
        orderBy,
        skip: isKanbanView ? 0 : skip,
        take: isKanbanView ? total || pageSize : pageSize,
        select: {
          id: true,
          brandId: true,
          campaignName: true,
          dealValue: true,
          currency: true,
          stage: true,
          priority: true,
          status: true,
          contactId: true,
          startDate: true,
          dueDate: true,
          expectedCloseDate: true,
          paymentDueDate: true,
          updatedAt: true,
          brand: { select: { name: true } },
          contact: { select: { name: true } },
        },
      })
      return { items, total }
    }),
    buildWidgets(userId),
  ])

  const { items, total } = listResult

  return {
    items: items.map((item) => toListItem(item)),
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
    filters: {
      search: input.search ?? "",
      archive: input.archive,
      sort: input.sort,
      view: input.view,
      ...(input.stage ? { stage: input.stage } : {}),
      ...(input.priority ? { priority: input.priority } : {}),
      ...(input.brandId ? { brandId: input.brandId } : {}),
      ...(input.fromDate ? { fromDate: input.fromDate } : {}),
      ...(input.toDate ? { toDate: input.toDate } : {}),
    },
    widgets,
  }
}

export async function getDeal(
  userId: string,
  dealId: string
): Promise<DealDetail> {
  const deal = await prisma.deal.findFirst({
    where: { id: dealId, userId },
    include: {
      brand: {
        select: {
          name: true,
          category: true,
        },
      },
      contact: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  if (!deal) {
    throw new DealServiceError("Deal not found.", "NOT_FOUND")
  }

  return {
    id: deal.id,
    userId: deal.userId,
    brandId: deal.brandId,
    brandName: deal.brand.name,
    brandCategory: deal.brand.category,
    contactId: deal.contactId,
    contactName: deal.contact?.name ?? null,
    contactEmail: deal.contact?.email ?? null,
    campaignName: deal.campaignName,
    dealValue: toNumber(deal.dealValue),
    currency: deal.currency,
    stage: deal.stage as DealDetail["stage"],
    priority: deal.priority as DealDetail["priority"],
    status: deal.status as DealDetail["status"],
    startDate: deal.startDate,
    dueDate: deal.dueDate,
    expectedCloseDate: deal.expectedCloseDate,
    paymentDueDate: deal.paymentDueDate,
    paymentTerms: deal.paymentTerms,
    campaignDescription: deal.campaignDescription,
    deliverablesSummary: deal.deliverablesSummary,
    notes: deal.notes,
    source: deal.source,
    probability: deal.probability,
    externalRef: deal.externalRef,
    deliveredAt: deal.deliveredAt,
    completedAt: deal.completedAt,
    paidAt: deal.paidAt,
    archivedAt: deal.archivedAt,
    createdAt: deal.createdAt,
    updatedAt: deal.updatedAt,
  }
}

export async function createDeal(userId: string, input: DealCreateUpdateInput) {
  return prisma.$transaction(async (tx) =>
    createDealInTransaction(tx, userId, input)
  )
}

async function createDealInTransaction(
  tx: PrismaTx,
  userId: string,
  input: DealCreateUpdateInput
) {
  await requireOwnedBrand(userId, input.brandId, tx)
  if (input.contactId) {
    await assertOwnedContact({
      tx,
      userId,
      brandId: input.brandId,
      contactId: input.contactId,
    })
  }

  const normalizedCampaignName = normalizeCampaignName(input.campaignName)
  await ensureNoActiveDuplicate({
    tx,
    userId,
    brandId: input.brandId,
    normalizedCampaignName,
  })

  const milestones = getStageMilestones(input.stage)

  let created: Awaited<ReturnType<typeof tx.deal.create>>
  try {
    created = await tx.deal.create({
      data: {
        userId,
        brandId: input.brandId,
        contactId: input.contactId ?? null,
        campaignName: input.campaignName,
        normalizedCampaignName,
        dealValue: input.dealValue,
        currency: normalizeCurrency(input.currency),
        stage: input.stage,
        priority: input.priority,
        startDate: input.startDate ?? null,
        dueDate: input.dueDate ?? null,
        expectedCloseDate: input.expectedCloseDate ?? null,
        paymentDueDate: input.paymentDueDate ?? null,
        paymentTerms: input.paymentTerms ?? null,
        campaignDescription: input.campaignDescription ?? null,
        deliverablesSummary: input.deliverablesSummary ?? null,
        notes: input.notes ?? null,
        source: input.source ?? null,
        probability: input.probability ?? null,
        externalRef: input.externalRef ?? null,
        lastStageChangedAt: new Date(),
        deliveredAt: milestones.deliveredAt,
        completedAt: milestones.completedAt,
        paidAt: milestones.paidAt,
      },
      include: {
        brand: { select: { name: true } },
        contact: { select: { name: true } },
      },
    })
  } catch (error) {
    mapPrismaError(error)
  }

  await recordActivity(tx, {
    userId,
    type: ACTIVITY_TYPE.DEAL_CREATED,
    entityType: ACTIVITY_ENTITY.DEAL,
    entityId: created.id,
    brandId: created.brandId,
    contactId: created.contactId,
    dealId: created.id,
    title: "Deal created",
    description: `${created.campaignName} was created.`,
    metadata: {
      campaignName: created.campaignName,
      stage: created.stage,
      value: toNumber(created.dealValue),
      currency: created.currency,
    },
  })

  return {
    id: created.id,
    campaignName: created.campaignName,
  }
}

export async function createDealWithTemplate(
  userId: string,
  input: DealCreateUpdateInput,
  templateId: string
) {
  return prisma.$transaction(async (tx) => {
    const created = await createDealInTransaction(tx, userId, input)
    await applyCampaignTemplateInTransaction(tx, userId, created.id, templateId)
    return created
  })
}

export async function updateDeal(
  userId: string,
  dealId: string,
  input: DealCreateUpdateInput
) {
  return prisma.$transaction(async (tx) => {
    const existing = await getOwnedDeal(tx, userId, dealId)
    if (existing.status === "Archived") {
      throw new DealServiceError(
        "Archived deals cannot be edited.",
        "INVALID_OPERATION"
      )
    }

    await requireOwnedBrand(userId, input.brandId, tx)
    if (input.contactId) {
      await assertOwnedContact({
        tx,
        userId,
        brandId: input.brandId,
        contactId: input.contactId,
      })
    }

    const normalizedCampaignName = normalizeCampaignName(input.campaignName)
    await ensureNoActiveDuplicate({
      tx,
      userId,
      brandId: input.brandId,
      normalizedCampaignName,
      excludingId: existing.id,
    })

    if (
      !isValidStageTransition(
        existing.stage as DealDetail["stage"],
        input.stage
      )
    ) {
      throw new DealServiceError(
        "This stage transition is not allowed.",
        "INVALID_OPERATION",
        "stage"
      )
    }

    const milestones = applyStageMilestones(input.stage, existing)
    let updated: Awaited<ReturnType<typeof tx.deal.update>>
    try {
      updated = await tx.deal.update({
        where: { id: dealId },
        data: {
          brandId: input.brandId,
          contactId: input.contactId ?? null,
          campaignName: input.campaignName,
          normalizedCampaignName,
          dealValue: input.dealValue,
          currency: normalizeCurrency(input.currency),
          stage: input.stage,
          priority: input.priority,
          startDate: input.startDate ?? null,
          dueDate: input.dueDate ?? null,
          expectedCloseDate: input.expectedCloseDate ?? null,
          paymentDueDate: input.paymentDueDate ?? null,
          paymentTerms: input.paymentTerms ?? null,
          campaignDescription: input.campaignDescription ?? null,
          deliverablesSummary: input.deliverablesSummary ?? null,
          notes: input.notes ?? null,
          source: input.source ?? null,
          probability: input.probability ?? null,
          externalRef: input.externalRef ?? null,
          lastStageChangedAt:
            existing.stage === input.stage
              ? existing.lastStageChangedAt
              : new Date(),
          deliveredAt: milestones.deliveredAt,
          completedAt: milestones.completedAt,
          paidAt: milestones.paidAt,
        },
      })
    } catch (error) {
      mapPrismaError(error)
    }

    await recordActivity(tx, {
      userId,
      type: ACTIVITY_TYPE.DEAL_UPDATED,
      entityType: ACTIVITY_ENTITY.DEAL,
      entityId: updated.id,
      brandId: updated.brandId,
      contactId: updated.contactId,
      dealId: updated.id,
      title: "Deal updated",
      description: `${updated.campaignName} was updated.`,
      metadata: {
        campaignName: updated.campaignName,
        stage: updated.stage,
      },
    })

    return {
      id: updated.id,
      campaignName: updated.campaignName,
    }
  })
}

export async function updateDealStage(
  userId: string,
  dealId: string,
  stage: DealListItem["stage"]
) {
  return prisma.$transaction(async (tx) => {
    const existing = await getOwnedDeal(tx, userId, dealId)

    if (existing.status === "Archived") {
      throw new DealServiceError(
        "Archived deals cannot change stage.",
        "INVALID_OPERATION"
      )
    }

    if (
      !isValidStageTransition(existing.stage as DealListItem["stage"], stage)
    ) {
      throw new DealServiceError(
        "This stage transition is not allowed.",
        "INVALID_OPERATION",
        "stage"
      )
    }

    const milestones = applyStageMilestones(stage, existing)
    const updated = await tx.deal.update({
      where: { id: existing.id },
      data: {
        stage,
        lastStageChangedAt: new Date(),
        deliveredAt: milestones.deliveredAt,
        completedAt: milestones.completedAt,
        paidAt: milestones.paidAt,
      },
    })

    await recordActivity(tx, {
      userId,
      type: ACTIVITY_TYPE.DEAL_STAGE_CHANGED,
      entityType: ACTIVITY_ENTITY.DEAL,
      entityId: updated.id,
      brandId: updated.brandId,
      contactId: updated.contactId,
      dealId: updated.id,
      title: "Deal stage changed",
      description: `${updated.campaignName} moved to ${stage}.`,
      metadata: {
        previousStage: existing.stage,
        stage,
      },
    })

    return {
      id: updated.id,
      stage: updated.stage,
    }
  })
}

export async function updateDealPriority(
  userId: string,
  dealId: string,
  priority: DealListItem["priority"]
) {
  return prisma.$transaction(async (tx) => {
    const existing = await getOwnedDeal(tx, userId, dealId)

    if (existing.status === "Archived") {
      throw new DealServiceError(
        "Archived deals cannot change priority.",
        "INVALID_OPERATION",
        "priority"
      )
    }

    const updated = await tx.deal.update({
      where: { id: existing.id },
      data: {
        priority,
      },
    })

    await recordActivity(tx, {
      userId,
      type: ACTIVITY_TYPE.DEAL_UPDATED,
      entityType: ACTIVITY_ENTITY.DEAL,
      entityId: updated.id,
      brandId: updated.brandId,
      contactId: updated.contactId,
      dealId: updated.id,
      title: "Deal priority changed",
      description: `${updated.campaignName} priority changed to ${priority}.`,
      metadata: {
        previousPriority: existing.priority,
        priority,
      },
    })

    return {
      id: updated.id,
      priority: updated.priority,
    }
  })
}

export async function archiveDeal(userId: string, dealId: string) {
  return prisma.$transaction(async (tx) => {
    const existing = await getOwnedDeal(tx, userId, dealId)
    if (existing.status === "Archived") {
      throw new DealServiceError(
        "Deal is already archived.",
        "INVALID_OPERATION"
      )
    }

    const archived = await tx.deal.update({
      where: { id: existing.id },
      data: {
        status: "Archived",
        archivedAt: new Date(),
      },
    })

    await recordActivity(tx, {
      userId,
      type: ACTIVITY_TYPE.DEAL_ARCHIVED,
      entityType: ACTIVITY_ENTITY.DEAL,
      entityId: archived.id,
      brandId: archived.brandId,
      contactId: archived.contactId,
      dealId: archived.id,
      title: "Deal archived",
      description: `${archived.campaignName} was archived.`,
      metadata: {
        campaignName: archived.campaignName,
      },
    })
  })
}

export async function restoreDeal(userId: string, dealId: string) {
  return prisma.$transaction(async (tx) => {
    const existing = await getOwnedDeal(tx, userId, dealId)
    if (existing.status === "Active") {
      throw new DealServiceError("Deal is already active.", "INVALID_OPERATION")
    }

    const restored = await tx.deal.update({
      where: { id: existing.id },
      data: {
        status: "Active",
        archivedAt: null,
      },
    })

    await recordActivity(tx, {
      userId,
      type: ACTIVITY_TYPE.DEAL_RESTORED,
      entityType: ACTIVITY_ENTITY.DEAL,
      entityId: restored.id,
      brandId: restored.brandId,
      contactId: restored.contactId,
      dealId: restored.id,
      title: "Deal restored",
      description: `${restored.campaignName} was restored.`,
      metadata: {
        campaignName: restored.campaignName,
      },
    })
  })
}

export async function deleteDeal(userId: string, dealId: string) {
  return prisma.$transaction(async (tx) => {
    const existing = await getOwnedDeal(tx, userId, dealId)

    if (!TERMINAL_STAGES.has(existing.stage)) {
      throw new DealServiceError(
        "Only cancelled or paid deals can be deleted.",
        "FORBIDDEN"
      )
    }

    await tx.deal.delete({
      where: { id: existing.id },
    })
  })
}

export async function listDealFormOptions(userId: string) {
  const [brands, contacts] = await prisma.$transaction([
    prisma.brand.findMany({
      where: { userId },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
    }),
    prisma.contact.findMany({
      where: {
        userId,
        status: "Active",
      },
      orderBy: [{ brand: { name: "asc" } }, { name: "asc" }],
      select: {
        id: true,
        brandId: true,
        name: true,
      },
    }),
  ])

  const contactsByBrand = contacts.reduce<
    Record<string, Array<{ id: string; name: string }>>
  >((accumulator, item) => {
    if (!accumulator[item.brandId]) {
      accumulator[item.brandId] = []
    }
    accumulator[item.brandId].push({
      id: item.id,
      name: item.name,
    })
    return accumulator
  }, {})

  return {
    brands,
    contactsByBrand,
  }
}
