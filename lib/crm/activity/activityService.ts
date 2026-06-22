import type { Prisma, PrismaClient } from "@prisma/client"

import type { ActivityEntityType, ActivityType } from "@/enums/activity"
import { prisma } from "@/lib/prisma"
import { clampPage, clampPageSize } from "@/lib/crm/shared/pagination"
import type { ActivityListData, ActivityListItem } from "@/types/activity"

const PAGE_SIZE_DEFAULT = 20
const PAGE_SIZE_MAX = 50

type PrismaTx = Prisma.TransactionClient | PrismaClient

export class ActivityServiceError extends Error {
  code: "NOT_FOUND" | "UNKNOWN"

  constructor(message: string, code: ActivityServiceError["code"]) {
    super(message)
    this.name = "ActivityServiceError"
    this.code = code
  }
}

export type RecordActivityInput = {
  userId: string
  type: ActivityType
  entityType: ActivityEntityType
  entityId: string
  brandId?: string | null
  contactId?: string | null
  dealId?: string | null
  title: string
  description?: string | null
  metadata?: Prisma.InputJsonValue
}

async function assertOwnedBrand(userId: string, brandId: string, tx: PrismaTx) {
  const brand = await tx.brand.findFirst({
    where: { id: brandId, userId },
    select: { id: true },
  })

  if (!brand) {
    throw new ActivityServiceError("Brand not found.", "NOT_FOUND")
  }
}

function toActivityListItem(activity: {
  id: string
  type: ActivityType
  entityType: ActivityEntityType
  entityId: string
  brandId: string | null
  contactId: string | null
  dealId: string | null
  title: string
  description: string | null
  metadata: Prisma.JsonValue
  createdAt: Date
}): ActivityListItem {
  return {
    id: activity.id,
    type: activity.type,
    entityType: activity.entityType,
    entityId: activity.entityId,
    brandId: activity.brandId,
    contactId: activity.contactId,
    dealId: activity.dealId,
    title: activity.title,
    description: activity.description,
    metadata:
      activity.metadata && typeof activity.metadata === "object" && !Array.isArray(activity.metadata)
        ? (activity.metadata as Record<string, unknown>)
        : null,
    createdAt: activity.createdAt,
  }
}

export async function recordActivity(tx: PrismaTx, input: RecordActivityInput) {
  return tx.activity.create({
    data: {
      userId: input.userId,
      type: input.type,
      entityType: input.entityType,
      entityId: input.entityId,
      brandId: input.brandId ?? null,
      contactId: input.contactId ?? null,
      dealId: input.dealId ?? null,
      title: input.title,
      description: input.description ?? null,
      metadata: input.metadata,
    },
    select: {
      id: true,
    },
  })
}

export async function listActivitiesByBrand(
  userId: string,
  input: {
    brandId: string
    page?: number
    pageSize?: number
  },
): Promise<ActivityListData> {
  await assertOwnedBrand(userId, input.brandId, prisma)

  const page = clampPage(input.page)
  const pageSize = clampPageSize(input.pageSize, {
    pageSize: PAGE_SIZE_DEFAULT,
    maxPageSize: PAGE_SIZE_MAX,
  })
  const skip = (page - 1) * pageSize

  const where = {
    userId,
    brandId: input.brandId,
  }

  const [items, total] = await prisma.$transaction([
    prisma.activity.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      select: {
        id: true,
        type: true,
        entityType: true,
        entityId: true,
        brandId: true,
        contactId: true,
        dealId: true,
        title: true,
        description: true,
        metadata: true,
        createdAt: true,
      },
    }),
    prisma.activity.count({ where }),
  ])

  return {
    items: items.map((item) =>
      toActivityListItem({
        ...item,
        type: item.type as ActivityType,
        entityType: item.entityType as ActivityEntityType,
      }),
    ),
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
    filters: {
      brandId: input.brandId,
    },
  }
}

export async function listActivitiesByDeal(
  userId: string,
  input: {
    dealId: string
    page?: number
    pageSize?: number
  },
): Promise<ActivityListData> {
  const deal = await prisma.deal.findFirst({
    where: { id: input.dealId, userId },
    select: { id: true },
  })

  if (!deal) {
    throw new ActivityServiceError("Deal not found.", "NOT_FOUND")
  }

  const page = clampPage(input.page)
  const pageSize = clampPageSize(input.pageSize, {
    pageSize: PAGE_SIZE_DEFAULT,
    maxPageSize: PAGE_SIZE_MAX,
  })
  const skip = (page - 1) * pageSize

  const where = {
    userId,
    dealId: input.dealId,
  }

  const [items, total] = await prisma.$transaction([
    prisma.activity.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      select: {
        id: true,
        type: true,
        entityType: true,
        entityId: true,
        brandId: true,
        contactId: true,
        dealId: true,
        title: true,
        description: true,
        metadata: true,
        createdAt: true,
      },
    }),
    prisma.activity.count({ where }),
  ])

  return {
    items: items.map((item) =>
      toActivityListItem({
        ...item,
        type: item.type as ActivityType,
        entityType: item.entityType as ActivityEntityType,
      }),
    ),
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
    filters: {
      dealId: input.dealId,
    },
  }
}
