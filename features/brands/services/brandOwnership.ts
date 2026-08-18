import type { Prisma, PrismaClient } from "@prisma/client"

import { prisma } from "@/lib/db/prisma"

type PrismaTx = Prisma.TransactionClient | PrismaClient

export class BrandNotFoundError extends Error {
  constructor(message = "Brand not found.") {
    super(message)
    this.name = "BrandNotFoundError"
  }
}

export async function findOwnedBrand(
  userId: string,
  brandId: string,
  tx: PrismaTx = prisma
) {
  return tx.brand.findFirst({
    where: { id: brandId, userId },
    select: { id: true },
  })
}

export async function assertOwnedBrand(
  userId: string,
  brandId: string,
  tx: PrismaTx = prisma
) {
  const brand = await findOwnedBrand(userId, brandId, tx)
  if (!brand) {
    throw new BrandNotFoundError()
  }
  return brand
}
