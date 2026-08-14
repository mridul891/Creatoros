import type { Prisma, PrismaClient } from "@prisma/client"
import { ACTIVITY_ENTITY, ACTIVITY_TYPE } from "@/enums/activity"
import { recordActivity } from "@/features/activity/services/activityService"
import {
  type BrandCreateUpdateInput,
  normalizeBrandName,
} from "@/features/brands/schemas/brandValidation"
import type { BrandListData } from "@/features/brands/types/brand"
import { prisma } from "@/lib/db/prisma"
import { clampPage, clampPageSize } from "@/lib/utils/pagination"

const PAGE_SIZE_DEFAULT = 20
const PAGE_SIZE_MAX = 50

export class BrandServiceError extends Error {
  code: "DUPLICATE"
  field: "name"

  constructor(message: string) {
    super(message)
    this.name = "BrandServiceError"
    this.code = "DUPLICATE"
    this.field = "name"
  }
}

async function ensureNoDuplicateName(options: {
  tx: Prisma.TransactionClient | PrismaClient
  userId: string
  normalizedName: string
  excludingId?: string
}) {
  const existing = await options.tx.brand.findFirst({
    where: {
      userId: options.userId,
      normalizedName: options.normalizedName,
      ...(options.excludingId ? { id: { not: options.excludingId } } : {}),
    },
    select: { id: true },
  })

  return !existing
}

export async function listBrands(
  userId: string,
  input?: {
    search?: string
    page?: number
    pageSize?: number
  }
): Promise<BrandListData> {
  const search = input?.search?.trim() ?? ""
  const page = clampPage(input?.page)
  const pageSize = clampPageSize(input?.pageSize, {
    pageSize: PAGE_SIZE_DEFAULT,
    maxPageSize: PAGE_SIZE_MAX,
  })
  const skip = (page - 1) * pageSize

  const where = {
    userId,
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { category: { contains: search, mode: "insensitive" as const } },
            {
              primaryContactName: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              primaryContactEmail: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  }

  const [items, total] = await prisma.$transaction([
    prisma.brand.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip,
      take: pageSize,
      select: {
        id: true,
        name: true,
        category: true,
        website: true,
        primaryContactName: true,
        primaryContactEmail: true,
        notes: true,
        updatedAt: true,
      },
    }),
    prisma.brand.count({ where }),
  ])

  return {
    items,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
  }
}

export async function getBrand(userId: string, brandId: string) {
  return prisma.brand.findFirst({
    where: {
      id: brandId,
      userId,
    },
    select: {
      id: true,
      name: true,
      category: true,
      website: true,
      primaryContactName: true,
      primaryContactEmail: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export async function createBrand(
  userId: string,
  input: BrandCreateUpdateInput
) {
  return prisma.$transaction(async (tx) => {
    const normalizedName = normalizeBrandName(input.name)
    const isUnique = await ensureNoDuplicateName({
      tx,
      userId,
      normalizedName,
    })

    if (!isUnique) {
      throw new BrandServiceError("Brand name already exists.")
    }

    const created = await tx.brand.create({
      data: {
        userId,
        name: input.name,
        normalizedName,
        category: input.category ?? null,
        website: input.website ?? null,
        primaryContactName: input.primaryContactName ?? null,
        primaryContactEmail: input.primaryContactEmail ?? null,
        notes: input.notes ?? null,
      },
      select: {
        id: true,
        name: true,
      },
    })

    await recordActivity(tx, {
      userId,
      type: ACTIVITY_TYPE.BRAND_CREATED,
      entityType: ACTIVITY_ENTITY.BRAND,
      entityId: created.id,
      brandId: created.id,
      title: "Brand created",
      description: `${created.name} was created.`,
      metadata: {
        brandName: created.name,
      },
    })

    return created
  })
}

export async function updateBrand(
  userId: string,
  brandId: string,
  input: BrandCreateUpdateInput
) {
  return prisma.$transaction(async (tx) => {
    const normalizedName = normalizeBrandName(input.name)
    const isUnique = await ensureNoDuplicateName({
      tx,
      userId,
      normalizedName,
      excludingId: brandId,
    })

    if (!isUnique) {
      throw new BrandServiceError("Brand name already exists.")
    }

    const updated = await tx.brand.updateMany({
      where: {
        id: brandId,
        userId,
      },
      data: {
        name: input.name,
        normalizedName,
        category: input.category ?? null,
        website: input.website ?? null,
        primaryContactName: input.primaryContactName ?? null,
        primaryContactEmail: input.primaryContactEmail ?? null,
        notes: input.notes ?? null,
      },
    })

    if (updated.count === 0) {
      return null
    }

    await recordActivity(tx, {
      userId,
      type: ACTIVITY_TYPE.BRAND_UPDATED,
      entityType: ACTIVITY_ENTITY.BRAND,
      entityId: brandId,
      brandId,
      title: "Brand updated",
      description: `${input.name} was updated.`,
      metadata: {
        brandName: input.name,
      },
    })

    return {
      id: brandId,
      name: input.name,
    }
  })
}

export async function deleteBrand(userId: string, brandId: string) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.brand.findFirst({
      where: {
        id: brandId,
        userId,
      },
      select: {
        id: true,
        name: true,
      },
    })

    if (!existing) {
      return false
    }

    await recordActivity(tx, {
      userId,
      type: ACTIVITY_TYPE.BRAND_ARCHIVED,
      entityType: ACTIVITY_ENTITY.BRAND,
      entityId: existing.id,
      brandId: existing.id,
      title: "Brand archived",
      description: `${existing.name} was archived.`,
      metadata: {
        brandName: existing.name,
      },
    })

    await tx.brand.delete({
      where: {
        id: existing.id,
      },
    })

    return true
  })
}
