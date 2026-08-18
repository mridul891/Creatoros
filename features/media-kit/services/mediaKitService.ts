import type { Prisma } from "@prisma/client"

import type { MediaKitFormData } from "@/features/media-kit/schema"
import {
  mapFormDataToMediaKitScalars,
  mapFormDataToProfileSync,
  mapFormDataToRateDeliverables,
  mapFormDataToWorkItems,
  mapMediaKitToFormData,
  type MediaKitWithRelations,
} from "@/features/media-kit/utils/mediaKitMappers"
import { prisma } from "@/lib/db/prisma"

const mediaKitInclude = {
  workItems: {
    orderBy: { orderIndex: "asc" as const },
  },
  rateDeliverables: {
    orderBy: { orderIndex: "asc" as const },
  },
} satisfies Prisma.MediaKitInclude

export class MediaKitServiceError extends Error {
  code: "NOT_FOUND" | "INVALID_OPERATION"

  constructor(message: string, code: MediaKitServiceError["code"]) {
    super(message)
    this.name = "MediaKitServiceError"
    this.code = code
  }
}

export async function getMediaKitForUser(userId: string) {
  const record = await prisma.mediaKit.findUnique({
    where: { userId },
    include: mediaKitInclude,
  })

  if (!record) {
    return null
  }

  return mapMediaKitToFormData(record as MediaKitWithRelations)
}

export async function upsertMediaKit(userId: string, input: MediaKitFormData) {
  const scalarFields = mapFormDataToMediaKitScalars(input)
  const workItems = mapFormDataToWorkItems(input)
  const rateDeliverables = mapFormDataToRateDeliverables(input)
  const profileSync = mapFormDataToProfileSync(input)

  return prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: profileSync.user,
    })

    const creator = await tx.creator.findUnique({
      where: { userId },
      select: { id: true },
    })

    if (creator) {
      await tx.creator.update({
        where: { userId },
        data: profileSync.creator,
      })
    }

    const existing = await tx.mediaKit.findUnique({
      where: { userId },
      select: { id: true },
    })

    const nestedWorkItems = {
      deleteMany: {},
      create: workItems,
    } satisfies Prisma.MediaKitWorkItemUpdateManyWithoutMediaKitNestedInput

    const nestedRateDeliverables = {
      deleteMany: {},
      create: rateDeliverables,
    } satisfies Prisma.MediaKitRateDeliverableUpdateManyWithoutMediaKitNestedInput

    const record = existing
      ? await tx.mediaKit.update({
          where: { userId },
          data: {
            ...scalarFields,
            workItems: nestedWorkItems,
            rateDeliverables: nestedRateDeliverables,
          },
          include: mediaKitInclude,
        })
      : await tx.mediaKit.create({
          data: {
            userId,
            ...scalarFields,
            workItems: {
              create: workItems,
            },
            rateDeliverables: {
              create: rateDeliverables,
            },
          },
          include: mediaKitInclude,
        })

    return {
      id: record.id,
      updatedAt: record.updatedAt,
      formData: mapMediaKitToFormData(record as MediaKitWithRelations),
    }
  })
}

export async function deleteMediaKitForUser(userId: string) {
  const existing = await prisma.mediaKit.findUnique({
    where: { userId },
    select: { id: true },
  })

  if (!existing) {
    return false
  }

  await prisma.mediaKit.delete({
    where: { userId },
  })

  return true
}
