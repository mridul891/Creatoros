import type { Prisma, PrismaClient } from "@prisma/client"

import { ACTIVITY_ENTITY, ACTIVITY_TYPE } from "@/enums/activity"
import { recordActivity } from "@/features/activity"
import {
  type DeliverableCreateInput,
  type DeliverableListInput,
  type DeliverableUpdateInput,
  normalizeDeliverableType,
} from "@/features/deliverables/schemas/deliverableValidation"
import type {
  DeliverableDetail,
  DeliverableListData,
  DeliverableListItem,
} from "@/features/deliverables/types/deliverable"
import { prisma } from "@/lib/db/prisma"
import {
  clampPage,
  clampPageSize,
  PAGE_SIZE_DEFAULT,
  PAGE_SIZE_MAX,
} from "@/lib/utils/pagination"

type PrismaTx = Prisma.TransactionClient | PrismaClient

type DeliverableServiceErrorField =
  | "deliverableId"
  | "dealId"
  | "deliverableType"
  | "status"
  | "approvalStatus"

export class DeliverableServiceError extends Error {
  code:
    | "NOT_FOUND"
    | "DUPLICATE"
    | "INVALID_OPERATION"
    | "FORBIDDEN"
    | "UNKNOWN"
  field?: DeliverableServiceErrorField

  constructor(
    message: string,
    code: DeliverableServiceError["code"],
    field?: DeliverableServiceErrorField
  ) {
    super(message)
    this.name = "DeliverableServiceError"
    this.code = code
    this.field = field
  }
}

type OwnedDeal = {
  id: string
  brandId: string
  contactId: string | null
  campaignName: string
  status: "Active" | "Archived"
}

function toListItem(item: {
  id: string
  dealId: string
  platform: string
  deliverableType: string
  dueDate: Date | null
  status: string
  approvalStatus: string
  submissionUrl: string | null
  publishedUrl: string | null
  internalNotes: string | null
  brandNotes: string | null
  revisionCount: number
  orderIndex: number
  isArchived: boolean
  archivedAt: Date | null
  createdBy: string
  updatedBy: string
  createdAt: Date
  updatedAt: Date
}): DeliverableListItem {
  return {
    id: item.id,
    dealId: item.dealId,
    platform: item.platform,
    deliverableType: item.deliverableType,
    dueDate: item.dueDate,
    status: item.status as DeliverableListItem["status"],
    approvalStatus:
      item.approvalStatus as DeliverableListItem["approvalStatus"],
    submissionUrl: item.submissionUrl,
    publishedUrl: item.publishedUrl,
    internalNotes: item.internalNotes,
    brandNotes: item.brandNotes,
    revisionCount: item.revisionCount,
    orderIndex: item.orderIndex,
    isArchived: item.isArchived,
    archivedAt: item.archivedAt,
    createdBy: item.createdBy,
    updatedBy: item.updatedBy,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }
}

async function getOwnedDeal(
  tx: PrismaTx,
  userId: string,
  dealId: string
): Promise<OwnedDeal> {
  const deal = await tx.deal.findFirst({
    where: { id: dealId, userId },
    select: {
      id: true,
      brandId: true,
      contactId: true,
      campaignName: true,
      status: true,
    },
  })

  if (!deal) {
    throw new DeliverableServiceError("Deal not found.", "NOT_FOUND", "dealId")
  }

  return deal
}

async function getOwnedDeliverable(
  tx: PrismaTx,
  userId: string,
  deliverableId: string
) {
  const item = await tx.deliverable.findFirst({
    where: { id: deliverableId, userId },
    include: {
      deal: {
        select: {
          id: true,
          brandId: true,
          contactId: true,
          campaignName: true,
          status: true,
        },
      },
    },
  })

  if (!item) {
    throw new DeliverableServiceError(
      "Deliverable not found.",
      "NOT_FOUND",
      "deliverableId"
    )
  }

  return item
}

function ensureDealIsActive(deal: OwnedDeal) {
  if (deal.status === "Archived") {
    throw new DeliverableServiceError(
      "Deliverables cannot be modified for archived deals.",
      "INVALID_OPERATION",
      "dealId"
    )
  }
}

async function lockDeliverableOrdering(
  tx: PrismaTx,
  userId: string,
  dealId: string
) {
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`${userId}:deliverable:${dealId}`}))`
}

async function getNextOrderIndex(tx: PrismaTx, userId: string, dealId: string) {
  const last = await tx.deliverable.findFirst({
    where: { userId, dealId },
    orderBy: { orderIndex: "desc" },
    select: { orderIndex: true },
  })

  return (last?.orderIndex ?? -1) + 1
}

function mapPrismaError(error: unknown): never {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string" &&
    error.code === "P2002"
  ) {
    throw new DeliverableServiceError(
      "A matching deliverable already exists for this deal.",
      "DUPLICATE",
      "deliverableType"
    )
  }
  throw error
}

async function recordDeliverableActivity(options: {
  tx: PrismaTx
  userId: string
  deal: OwnedDeal
  deliverableId: string
  type: (typeof ACTIVITY_TYPE)[keyof typeof ACTIVITY_TYPE]
  title: string
  description: string
  metadata?: Prisma.InputJsonValue
}) {
  await recordActivity(options.tx, {
    userId: options.userId,
    type: options.type,
    entityType: ACTIVITY_ENTITY.DELIVERABLE,
    entityId: options.deliverableId,
    dealId: options.deal.id,
    brandId: options.deal.brandId,
    contactId: options.deal.contactId,
    title: options.title,
    description: options.description,
    metadata: options.metadata,
  })
}

function buildWhere(
  userId: string,
  input: DeliverableListInput
): Prisma.DeliverableWhereInput {
  const search = input.search?.trim() ?? ""

  return {
    userId,
    dealId: input.dealId,
    isArchived: input.archive === "archived",
    ...(input.status ? { status: input.status } : {}),
    ...(input.platform
      ? { platform: { equals: input.platform, mode: "insensitive" } }
      : {}),
    ...(search
      ? {
          OR: [
            { platform: { contains: search, mode: "insensitive" } },
            { deliverableType: { contains: search, mode: "insensitive" } },
            { internalNotes: { contains: search, mode: "insensitive" } },
            { brandNotes: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  }
}

function getOrderBy(
  sort: DeliverableListInput["sort"]
): Prisma.DeliverableOrderByWithRelationInput[] {
  switch (sort) {
    case "dueDate":
      return [{ dueDate: "asc" }, { updatedAt: "desc" }]
    case "updatedAt":
      return [{ updatedAt: "desc" }]
    case "status":
      return [{ status: "asc" }, { updatedAt: "desc" }]
    default:
      return [{ orderIndex: "asc" }, { updatedAt: "desc" }]
  }
}

export async function listDealDeliverables(
  userId: string,
  input: DeliverableListInput
): Promise<DeliverableListData> {
  await getOwnedDeal(prisma, userId, input.dealId)

  const page = clampPage(input.page)
  const pageSize = clampPageSize(input.pageSize, {
    pageSize: PAGE_SIZE_DEFAULT,
    maxPageSize: PAGE_SIZE_MAX,
  })
  const skip = (page - 1) * pageSize
  const where = buildWhere(userId, input)
  const orderBy = getOrderBy(input.sort)

  const [items, total, draft, submitted, needsRevision, approved, published] =
    await prisma.$transaction([
      prisma.deliverable.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
      }),
      prisma.deliverable.count({ where }),
      prisma.deliverable.count({ where: { ...where, status: "Draft" } }),
      prisma.deliverable.count({ where: { ...where, status: "Submitted" } }),
      prisma.deliverable.count({
        where: { ...where, status: "NeedsRevision" },
      }),
      prisma.deliverable.count({ where: { ...where, status: "Approved" } }),
      prisma.deliverable.count({ where: { ...where, status: "Published" } }),
    ])

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
      ...(input.status ? { status: input.status } : {}),
      ...(input.platform ? { platform: input.platform } : {}),
    },
    summary: {
      total,
      draft,
      submitted,
      needsRevision,
      approved,
      published,
    },
  }
}

export async function getDeliverable(
  userId: string,
  deliverableId: string
): Promise<DeliverableDetail> {
  const item = await prisma.deliverable.findFirst({
    where: { id: deliverableId, userId },
  })

  if (!item) {
    throw new DeliverableServiceError(
      "Deliverable not found.",
      "NOT_FOUND",
      "deliverableId"
    )
  }

  return {
    ...toListItem(item),
    userId: item.userId,
  }
}

export async function createDeliverable(
  userId: string,
  input: DeliverableCreateInput
) {
  return prisma.$transaction(async (tx) => {
    const deal = await getOwnedDeal(tx, userId, input.dealId)
    ensureDealIsActive(deal)
    await lockDeliverableOrdering(tx, userId, input.dealId)
    const orderIndex =
      typeof input.orderIndex === "number"
        ? input.orderIndex
        : await getNextOrderIndex(tx, userId, input.dealId)

    let created: Awaited<ReturnType<typeof tx.deliverable.create>>
    try {
      created = await tx.deliverable.create({
        data: {
          userId,
          dealId: input.dealId,
          platform: input.platform,
          deliverableType: input.deliverableType,
          normalizedDeliverableType: normalizeDeliverableType(
            input.deliverableType
          ),
          dueDate: input.dueDate ?? null,
          status: input.status,
          approvalStatus: input.approvalStatus,
          submissionUrl: input.submissionUrl ?? null,
          publishedUrl: input.publishedUrl ?? null,
          internalNotes: input.internalNotes ?? null,
          brandNotes: input.brandNotes ?? null,
          revisionCount: input.revisionCount,
          orderIndex,
          createdBy: userId,
          updatedBy: userId,
        },
      })
    } catch (error) {
      mapPrismaError(error)
    }

    await recordDeliverableActivity({
      tx,
      userId,
      deal,
      deliverableId: created.id,
      type: ACTIVITY_TYPE.DELIVERABLE_CREATED,
      title: "Deliverable created",
      description: `${created.deliverableType} was created for ${deal.campaignName}.`,
      metadata: {
        platform: created.platform,
        status: created.status,
      },
    })

    return {
      id: created.id,
      dealId: created.dealId,
    }
  })
}

export async function updateDeliverable(
  userId: string,
  deliverableId: string,
  input: DeliverableUpdateInput
) {
  return prisma.$transaction(async (tx) => {
    const existing = await getOwnedDeliverable(tx, userId, deliverableId)
    ensureDealIsActive(existing.deal)

    if (existing.dealId !== input.dealId) {
      throw new DeliverableServiceError(
        "Deliverable deal cannot be changed.",
        "INVALID_OPERATION",
        "dealId"
      )
    }

    let updated: Awaited<ReturnType<typeof tx.deliverable.update>>
    try {
      updated = await tx.deliverable.update({
        where: { id: existing.id },
        data: {
          platform: input.platform,
          deliverableType: input.deliverableType,
          normalizedDeliverableType: normalizeDeliverableType(
            input.deliverableType
          ),
          dueDate: input.dueDate ?? null,
          status: input.status,
          approvalStatus: input.approvalStatus,
          submissionUrl: input.submissionUrl ?? null,
          publishedUrl: input.publishedUrl ?? null,
          internalNotes: input.internalNotes ?? null,
          brandNotes: input.brandNotes ?? null,
          revisionCount: input.revisionCount,
          orderIndex: input.orderIndex ?? existing.orderIndex,
          updatedBy: userId,
        },
      })
    } catch (error) {
      mapPrismaError(error)
    }

    const activityType =
      updated.status === "Submitted"
        ? ACTIVITY_TYPE.DELIVERABLE_SUBMITTED
        : updated.status === "Approved"
          ? ACTIVITY_TYPE.DELIVERABLE_APPROVED
          : updated.status === "Published"
            ? ACTIVITY_TYPE.DELIVERABLE_PUBLISHED
            : updated.status === "NeedsRevision"
              ? ACTIVITY_TYPE.DELIVERABLE_NEEDS_REVISION
              : ACTIVITY_TYPE.DELIVERABLE_UPDATED

    await recordDeliverableActivity({
      tx,
      userId,
      deal: existing.deal,
      deliverableId: updated.id,
      type: activityType,
      title: "Deliverable updated",
      description: `${updated.deliverableType} was updated.`,
      metadata: {
        previousStatus: existing.status,
        status: updated.status,
      },
    })

    return {
      id: updated.id,
      dealId: updated.dealId,
    }
  })
}

export async function archiveDeliverable(
  userId: string,
  deliverableId: string
) {
  return prisma.$transaction(async (tx) => {
    const existing = await getOwnedDeliverable(tx, userId, deliverableId)
    ensureDealIsActive(existing.deal)

    if (existing.isArchived) {
      throw new DeliverableServiceError(
        "Deliverable is already archived.",
        "INVALID_OPERATION"
      )
    }

    const updated = await tx.deliverable.update({
      where: { id: existing.id },
      data: {
        isArchived: true,
        archivedAt: new Date(),
        updatedBy: userId,
      },
    })

    return {
      id: updated.id,
      dealId: updated.dealId,
    }
  })
}

export async function restoreDeliverable(
  userId: string,
  deliverableId: string
) {
  return prisma.$transaction(async (tx) => {
    const existing = await getOwnedDeliverable(tx, userId, deliverableId)
    ensureDealIsActive(existing.deal)

    if (!existing.isArchived) {
      throw new DeliverableServiceError(
        "Deliverable is already active.",
        "INVALID_OPERATION"
      )
    }

    const updated = await tx.deliverable.update({
      where: { id: existing.id },
      data: {
        isArchived: false,
        archivedAt: null,
        updatedBy: userId,
      },
    })

    return {
      id: updated.id,
      dealId: updated.dealId,
    }
  })
}

export async function deleteDeliverable(userId: string, deliverableId: string) {
  return prisma.$transaction(async (tx) => {
    const existing = await getOwnedDeliverable(tx, userId, deliverableId)
    ensureDealIsActive(existing.deal)
    if (!existing.isArchived) {
      throw new DeliverableServiceError(
        "Only archived deliverables can be deleted.",
        "FORBIDDEN"
      )
    }

    await tx.deliverable.delete({
      where: { id: existing.id },
    })

    return {
      id: existing.id,
      dealId: existing.dealId,
    }
  })
}
