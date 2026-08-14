import type { Prisma, PrismaClient } from "@prisma/client"

import { ACTIVITY_ENTITY, ACTIVITY_TYPE } from "@/enums/activity"
import { recordActivity } from "@/lib/crm/activity/activityService"
import { clampPage, clampPageSize } from "@/lib/crm/shared/pagination"
import { prisma } from "@/lib/prisma"
import type { DealFileListData, DealFileListItem } from "@/types/dealFile"
import type {
  FileCreateInput,
  FileListInput,
  FileUpdateInput,
} from "./fileValidation"

const PAGE_SIZE_DEFAULT = 20
const PAGE_SIZE_MAX = 50

type PrismaTx = Prisma.TransactionClient | PrismaClient

type OwnedDeal = {
  id: string
  brandId: string
  contactId: string | null
  campaignName: string
  status: "Active" | "Archived"
}

export class FileServiceError extends Error {
  code: "NOT_FOUND" | "INVALID_OPERATION" | "FORBIDDEN" | "UNKNOWN"
  field?: "fileId" | "dealId" | "fileName" | "storagePath" | "category"

  constructor(
    message: string,
    code: FileServiceError["code"],
    field?: FileServiceError["field"]
  ) {
    super(message)
    this.name = "FileServiceError"
    this.code = code
    this.field = field
  }
}

function toListItem(item: {
  id: string
  dealId: string
  fileName: string
  storagePath: string
  mimeType: string | null
  sizeBytes: bigint | null
  category: string
  status: string
  metadata: Prisma.JsonValue
  uploadedBy: string
  createdAt: Date
  updatedAt: Date
  archivedAt: Date | null
}): DealFileListItem {
  return {
    id: item.id,
    dealId: item.dealId,
    fileName: item.fileName,
    storagePath: item.storagePath,
    mimeType: item.mimeType,
    sizeBytes: item.sizeBytes == null ? null : Number(item.sizeBytes),
    category: item.category as DealFileListItem["category"],
    status: item.status as DealFileListItem["status"],
    metadata:
      item.metadata &&
      typeof item.metadata === "object" &&
      !Array.isArray(item.metadata)
        ? (item.metadata as Record<string, unknown>)
        : null,
    uploadedBy: item.uploadedBy,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    archivedAt: item.archivedAt,
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
    throw new FileServiceError("Deal not found.", "NOT_FOUND", "dealId")
  }
  return deal
}

async function getOwnedFile(tx: PrismaTx, userId: string, fileId: string) {
  const file = await tx.dealFile.findFirst({
    where: { id: fileId, userId },
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
  if (!file) {
    throw new FileServiceError("File not found.", "NOT_FOUND", "fileId")
  }
  return file
}

function ensureDealIsActive(deal: OwnedDeal) {
  if (deal.status === "Archived") {
    throw new FileServiceError(
      "Files cannot be modified for archived deals.",
      "INVALID_OPERATION",
      "dealId"
    )
  }
}

async function recordFileActivity(options: {
  tx: PrismaTx
  userId: string
  deal: OwnedDeal
  fileId: string
  type: (typeof ACTIVITY_TYPE)[keyof typeof ACTIVITY_TYPE]
  title: string
  description: string
  metadata?: Prisma.InputJsonValue
}) {
  await recordActivity(options.tx, {
    userId: options.userId,
    type: options.type,
    entityType: ACTIVITY_ENTITY.FILE,
    entityId: options.fileId,
    dealId: options.deal.id,
    brandId: options.deal.brandId,
    contactId: options.deal.contactId,
    title: options.title,
    description: options.description,
    metadata: options.metadata,
  })
}

export async function listDealFiles(
  userId: string,
  input: FileListInput
): Promise<DealFileListData> {
  await getOwnedDeal(prisma, userId, input.dealId)
  const page = clampPage(input.page)
  const pageSize = clampPageSize(input.pageSize, {
    pageSize: PAGE_SIZE_DEFAULT,
    maxPageSize: PAGE_SIZE_MAX,
  })
  const skip = (page - 1) * pageSize
  const search = input.search?.trim() ?? ""

  const where: Prisma.DealFileWhereInput = {
    userId,
    dealId: input.dealId,
    status: input.archive === "archived" ? "Archived" : "Active",
    ...(input.category ? { category: input.category } : {}),
    ...(search
      ? {
          OR: [
            { fileName: { contains: search, mode: "insensitive" as const } },
            { storagePath: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  }

  const [items, total] = await prisma.$transaction([
    prisma.dealFile.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.dealFile.count({ where }),
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
      ...(input.category ? { category: input.category } : {}),
    },
  }
}

export async function createFile(userId: string, input: FileCreateInput) {
  return prisma.$transaction(async (tx) => {
    const deal = await getOwnedDeal(tx, userId, input.dealId)
    ensureDealIsActive(deal)

    const created = await tx.dealFile.create({
      data: {
        userId,
        dealId: input.dealId,
        fileName: input.fileName,
        storagePath: input.storagePath,
        mimeType: input.mimeType ?? null,
        sizeBytes: input.sizeBytes == null ? null : BigInt(input.sizeBytes),
        category: input.category,
        metadata: input.metadata as Prisma.InputJsonValue | undefined,
        uploadedBy: userId,
      },
    })

    await recordFileActivity({
      tx,
      userId,
      deal,
      fileId: created.id,
      type: ACTIVITY_TYPE.FILE_UPLOADED,
      title: "File uploaded",
      description: `${created.fileName} was uploaded.`,
      metadata: {
        category: created.category,
      },
    })

    return {
      id: created.id,
      dealId: created.dealId,
    }
  })
}

export async function renameFile(userId: string, input: FileUpdateInput) {
  return prisma.$transaction(async (tx) => {
    const existing = await getOwnedFile(tx, userId, input.fileId)
    ensureDealIsActive(existing.deal)

    const updated = await tx.dealFile.update({
      where: { id: existing.id },
      data: {
        fileName: input.fileName,
        storagePath: input.storagePath,
        mimeType: input.mimeType ?? null,
        sizeBytes: input.sizeBytes == null ? null : BigInt(input.sizeBytes),
        category: input.category,
        metadata: input.metadata as Prisma.InputJsonValue | undefined,
      },
    })

    await recordFileActivity({
      tx,
      userId,
      deal: existing.deal,
      fileId: updated.id,
      type: ACTIVITY_TYPE.FILE_RENAMED,
      title: "File renamed",
      description: `${existing.fileName} was renamed to ${updated.fileName}.`,
    })

    return {
      id: updated.id,
      dealId: updated.dealId,
    }
  })
}

export async function archiveFile(userId: string, fileId: string) {
  return prisma.$transaction(async (tx) => {
    const existing = await getOwnedFile(tx, userId, fileId)
    ensureDealIsActive(existing.deal)
    if (existing.status === "Archived") {
      throw new FileServiceError(
        "File is already archived.",
        "INVALID_OPERATION"
      )
    }

    const updated = await tx.dealFile.update({
      where: { id: existing.id },
      data: {
        status: "Archived",
        archivedAt: new Date(),
      },
    })

    await recordFileActivity({
      tx,
      userId,
      deal: existing.deal,
      fileId: updated.id,
      type: ACTIVITY_TYPE.FILE_ARCHIVED,
      title: "File archived",
      description: `${updated.fileName} was archived.`,
    })

    return {
      id: updated.id,
      dealId: updated.dealId,
    }
  })
}

export async function restoreFile(userId: string, fileId: string) {
  return prisma.$transaction(async (tx) => {
    const existing = await getOwnedFile(tx, userId, fileId)
    ensureDealIsActive(existing.deal)
    if (existing.status === "Active") {
      throw new FileServiceError("File is already active.", "INVALID_OPERATION")
    }

    const updated = await tx.dealFile.update({
      where: { id: existing.id },
      data: {
        status: "Active",
        archivedAt: null,
      },
    })

    return {
      id: updated.id,
      dealId: updated.dealId,
    }
  })
}

export async function deleteFile(userId: string, fileId: string) {
  return prisma.$transaction(async (tx) => {
    const existing = await getOwnedFile(tx, userId, fileId)
    ensureDealIsActive(existing.deal)
    if (existing.status !== "Archived") {
      throw new FileServiceError(
        "Only archived files can be deleted.",
        "FORBIDDEN"
      )
    }
    await tx.dealFile.delete({
      where: { id: existing.id },
    })
    return {
      id: existing.id,
      dealId: existing.dealId,
    }
  })
}
