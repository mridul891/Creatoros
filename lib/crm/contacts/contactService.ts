import type { Prisma, PrismaClient } from "@prisma/client"

import type { ContactFilter } from "@/enums/contact"
import { prisma } from "@/lib/prisma"
import {
  normalizeContactName,
  normalizeEmail,
} from "@/lib/crm/contacts/contactValidation"
import type { ContactListData } from "@/types/contact"

type CreateContactInput = {
  brandId: string
  name: string
  email?: string
  phoneNumber?: string
  jobTitle?: string
  notes?: string
  isPrimary: boolean
}

type UpdateContactInput = CreateContactInput & {
  contactId: string
}

type ListContactsInput = {
  brandId: string
  search?: string
  status: ContactFilter
}

type ContactDetail = {
  id: string
  brandId: string
  name: string
  email: string | null
  phoneNumber: string | null
  jobTitle: string | null
  notes: string | null
  isPrimary: boolean
  status: "Active" | "Archived"
  archivedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export class ContactServiceError extends Error {
  code: "NOT_FOUND" | "DUPLICATE" | "INVALID_OPERATION" | "UNKNOWN"
  field?: "name" | "email"

  constructor(message: string, code: ContactServiceError["code"], field?: "name" | "email") {
    super(message)
    this.name = "ContactServiceError"
    this.code = code
    this.field = field
  }
}

type PrismaTx = Prisma.TransactionClient | PrismaClient

async function assertOwnedBrand(userId: string, brandId: string, tx: PrismaTx) {
  const brand = await tx.brand.findFirst({
    where: { id: brandId, userId },
    select: { id: true },
  })

  if (!brand) {
    throw new ContactServiceError("Brand not found.", "NOT_FOUND")
  }
}

async function getOwnedContact(userId: string, brandId: string, contactId: string, tx: PrismaTx) {
  const contact = await tx.contact.findFirst({
    where: {
      id: contactId,
      userId,
      brandId,
    },
  })

  if (!contact) {
    throw new ContactServiceError("Contact not found.", "NOT_FOUND")
  }

  return contact
}

async function ensureNoDuplicates(options: {
  tx: PrismaTx
  userId: string
  brandId: string
  normalizedName: string
  normalizedEmail: string | null
  excludingId?: string
}) {
  const duplicateByName = await options.tx.contact.findFirst({
    where: {
      userId: options.userId,
      brandId: options.brandId,
      status: "Active",
      normalizedName: options.normalizedName,
      ...(options.excludingId ? { id: { not: options.excludingId } } : {}),
    },
    select: { id: true },
  })

  if (duplicateByName) {
    throw new ContactServiceError("A contact with this name already exists for this brand.", "DUPLICATE", "name")
  }

  if (options.normalizedEmail) {
    const duplicateByEmail = await options.tx.contact.findFirst({
      where: {
        userId: options.userId,
        brandId: options.brandId,
        status: "Active",
        normalizedEmail: options.normalizedEmail,
        ...(options.excludingId ? { id: { not: options.excludingId } } : {}),
      },
      select: { id: true },
    })

    if (duplicateByEmail) {
      throw new ContactServiceError(
        "A contact with this email already exists for this brand.",
        "DUPLICATE",
        "email",
      )
    }
  }
}

async function syncBrandPrimaryContact(tx: Prisma.TransactionClient, brandId: string) {
  const primary = await tx.contact.findFirst({
    where: {
      brandId,
      status: "Active",
      isPrimary: true,
    },
    orderBy: { updatedAt: "desc" },
    select: {
      name: true,
      email: true,
    },
  })

  await tx.brand.update({
    where: { id: brandId },
    data: {
      primaryContactName: primary?.name ?? null,
      primaryContactEmail: primary?.email ?? null,
    },
  })
}

async function unsetPreviousPrimary(tx: Prisma.TransactionClient, brandId: string, excludingId?: string) {
  await tx.contact.updateMany({
    where: {
      brandId,
      status: "Active",
      isPrimary: true,
      ...(excludingId ? { id: { not: excludingId } } : {}),
    },
    data: {
      isPrimary: false,
    },
  })
}

export async function listContactsByBrand(userId: string, input: ListContactsInput): Promise<ContactListData> {
  await assertOwnedBrand(userId, input.brandId, prisma)

  const search = input.search?.trim() ?? ""

  const where: Prisma.ContactWhereInput = {
    userId,
    brandId: input.brandId,
    ...(input.status === "active" ? { status: "Active" } : { status: "Archived" }),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { jobTitle: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  }

  const [items, total] = await prisma.$transaction([
    prisma.contact.findMany({
      where,
      orderBy: [{ isPrimary: "desc" }, { updatedAt: "desc" }],
      select: {
        id: true,
        brandId: true,
        name: true,
        email: true,
        phoneNumber: true,
        jobTitle: true,
        isPrimary: true,
        status: true,
        updatedAt: true,
      },
    }),
    prisma.contact.count({ where }),
  ])

  return {
    items,
    total,
    filters: {
      search,
      status: input.status,
    },
  }
}

export async function getContact(userId: string, brandId: string, contactId: string): Promise<ContactDetail> {
  await assertOwnedBrand(userId, brandId, prisma)
  const contact = await getOwnedContact(userId, brandId, contactId, prisma)

  return {
    id: contact.id,
    brandId: contact.brandId,
    name: contact.name,
    email: contact.email,
    phoneNumber: contact.phoneNumber,
    jobTitle: contact.jobTitle,
    notes: contact.notes,
    isPrimary: contact.isPrimary,
    status: contact.status,
    archivedAt: contact.archivedAt,
    createdAt: contact.createdAt,
    updatedAt: contact.updatedAt,
  }
}

export async function createContact(userId: string, input: CreateContactInput): Promise<ContactDetail> {
  const normalizedName = normalizeContactName(input.name)
  const normalizedEmail = input.email ? normalizeEmail(input.email) : null

  return prisma.$transaction(async (tx) => {
    await assertOwnedBrand(userId, input.brandId, tx)
    await ensureNoDuplicates({
      tx,
      userId,
      brandId: input.brandId,
      normalizedName,
      normalizedEmail,
    })

    if (input.isPrimary) {
      await unsetPreviousPrimary(tx, input.brandId)
    }

    const contact = await tx.contact.create({
      data: {
        userId,
        brandId: input.brandId,
        name: input.name,
        normalizedName,
        email: input.email ?? null,
        normalizedEmail,
        phoneNumber: input.phoneNumber ?? null,
        jobTitle: input.jobTitle ?? null,
        notes: input.notes ?? null,
        isPrimary: input.isPrimary,
        status: "Active",
      },
    })

    await syncBrandPrimaryContact(tx, input.brandId)

    return {
      id: contact.id,
      brandId: contact.brandId,
      name: contact.name,
      email: contact.email,
      phoneNumber: contact.phoneNumber,
      jobTitle: contact.jobTitle,
      notes: contact.notes,
      isPrimary: contact.isPrimary,
      status: contact.status,
      archivedAt: contact.archivedAt,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    }
  })
}

export async function updateContact(userId: string, input: UpdateContactInput): Promise<ContactDetail> {
  const normalizedName = normalizeContactName(input.name)
  const normalizedEmail = input.email ? normalizeEmail(input.email) : null

  return prisma.$transaction(async (tx) => {
    await assertOwnedBrand(userId, input.brandId, tx)
    await getOwnedContact(userId, input.brandId, input.contactId, tx)

    await ensureNoDuplicates({
      tx,
      userId,
      brandId: input.brandId,
      normalizedName,
      normalizedEmail,
      excludingId: input.contactId,
    })

    if (input.isPrimary) {
      await unsetPreviousPrimary(tx, input.brandId, input.contactId)
    }

    const contact = await tx.contact.update({
      where: {
        id: input.contactId,
      },
      data: {
        name: input.name,
        normalizedName,
        email: input.email ?? null,
        normalizedEmail,
        phoneNumber: input.phoneNumber ?? null,
        jobTitle: input.jobTitle ?? null,
        notes: input.notes ?? null,
        isPrimary: input.isPrimary,
      },
    })

    await syncBrandPrimaryContact(tx, input.brandId)

    return {
      id: contact.id,
      brandId: contact.brandId,
      name: contact.name,
      email: contact.email,
      phoneNumber: contact.phoneNumber,
      jobTitle: contact.jobTitle,
      notes: contact.notes,
      isPrimary: contact.isPrimary,
      status: contact.status,
      archivedAt: contact.archivedAt,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    }
  })
}

export async function archiveContact(userId: string, brandId: string, contactId: string) {
  return prisma.$transaction(async (tx) => {
    await assertOwnedBrand(userId, brandId, tx)
    const contact = await getOwnedContact(userId, brandId, contactId, tx)

    if (contact.status === "Archived") {
      throw new ContactServiceError("Contact is already archived.", "INVALID_OPERATION")
    }

    await tx.contact.update({
      where: { id: contact.id },
      data: {
        status: "Archived",
        archivedAt: new Date(),
        isPrimary: false,
      },
    })

    await syncBrandPrimaryContact(tx, brandId)
  })
}
