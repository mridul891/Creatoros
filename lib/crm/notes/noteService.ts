import type { Prisma, PrismaClient } from "@prisma/client"

import { ACTIVITY_ENTITY, ACTIVITY_TYPE } from "@/enums/activity"
import { recordActivity } from "@/lib/crm/activity/activityService"
import { clampPage, clampPageSize } from "@/lib/crm/shared/pagination"
import { prisma } from "@/lib/prisma"
import type { DealNoteListData, DealNoteListItem } from "@/types/dealNote"
import type {
  NoteCreateInput,
  NoteListInput,
  NoteUpdateInput,
} from "./noteValidation"

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

export class NoteServiceError extends Error {
  code: "NOT_FOUND" | "INVALID_OPERATION" | "FORBIDDEN" | "UNKNOWN"
  field?: "noteId" | "dealId" | "content" | "title"

  constructor(
    message: string,
    code: NoteServiceError["code"],
    field?: NoteServiceError["field"]
  ) {
    super(message)
    this.name = "NoteServiceError"
    this.code = code
    this.field = field
  }
}

function toListItem(item: {
  id: string
  dealId: string
  title: string
  content: string
  isPinned: boolean
  status: string
  createdBy: string
  updatedBy: string
  createdAt: Date
  updatedAt: Date
  archivedAt: Date | null
}): DealNoteListItem {
  return {
    id: item.id,
    dealId: item.dealId,
    title: item.title,
    content: item.content,
    isPinned: item.isPinned,
    status: item.status as DealNoteListItem["status"],
    createdBy: item.createdBy,
    updatedBy: item.updatedBy,
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
    throw new NoteServiceError("Deal not found.", "NOT_FOUND", "dealId")
  }

  return deal
}

async function getOwnedNote(tx: PrismaTx, userId: string, noteId: string) {
  const note = await tx.dealNote.findFirst({
    where: { id: noteId, userId },
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

  if (!note) {
    throw new NoteServiceError("Note not found.", "NOT_FOUND", "noteId")
  }

  return note
}

function ensureDealIsActive(deal: OwnedDeal) {
  if (deal.status === "Archived") {
    throw new NoteServiceError(
      "Notes cannot be modified for archived deals.",
      "INVALID_OPERATION",
      "dealId"
    )
  }
}

async function recordNoteActivity(options: {
  tx: PrismaTx
  userId: string
  deal: OwnedDeal
  noteId: string
  type: (typeof ACTIVITY_TYPE)[keyof typeof ACTIVITY_TYPE]
  title: string
  description: string
  metadata?: Prisma.InputJsonValue
}) {
  await recordActivity(options.tx, {
    userId: options.userId,
    type: options.type,
    entityType: ACTIVITY_ENTITY.NOTE,
    entityId: options.noteId,
    dealId: options.deal.id,
    brandId: options.deal.brandId,
    contactId: options.deal.contactId,
    title: options.title,
    description: options.description,
    metadata: options.metadata,
  })
}

export async function listDealNotes(
  userId: string,
  input: NoteListInput
): Promise<DealNoteListData> {
  await getOwnedDeal(prisma, userId, input.dealId)
  const page = clampPage(input.page)
  const pageSize = clampPageSize(input.pageSize, {
    pageSize: PAGE_SIZE_DEFAULT,
    maxPageSize: PAGE_SIZE_MAX,
  })
  const skip = (page - 1) * pageSize
  const search = input.search?.trim() ?? ""

  const where: Prisma.DealNoteWhereInput = {
    userId,
    dealId: input.dealId,
    status: input.archive === "archived" ? "Archived" : "Active",
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { content: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  }

  const [items, total] = await prisma.$transaction([
    prisma.dealNote.findMany({
      where,
      orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
      skip,
      take: pageSize,
    }),
    prisma.dealNote.count({ where }),
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
    },
  }
}

export async function createNote(userId: string, input: NoteCreateInput) {
  return prisma.$transaction(async (tx) => {
    const deal = await getOwnedDeal(tx, userId, input.dealId)
    ensureDealIsActive(deal)

    const note = await tx.dealNote.create({
      data: {
        userId,
        dealId: input.dealId,
        title: input.title,
        content: input.content,
        createdBy: userId,
        updatedBy: userId,
      },
    })

    await recordNoteActivity({
      tx,
      userId,
      deal,
      noteId: note.id,
      type: ACTIVITY_TYPE.NOTE_ADDED,
      title: "Note added",
      description: `A note was added to ${deal.campaignName}.`,
      metadata: {
        noteTitle: note.title,
      },
    })

    return {
      id: note.id,
      dealId: note.dealId,
    }
  })
}

export async function updateNote(userId: string, input: NoteUpdateInput) {
  return prisma.$transaction(async (tx) => {
    const existing = await getOwnedNote(tx, userId, input.noteId)
    ensureDealIsActive(existing.deal)

    const note = await tx.dealNote.update({
      where: { id: existing.id },
      data: {
        title: input.title,
        content: input.content,
        isPinned: input.isPinned ?? existing.isPinned,
        updatedBy: userId,
      },
    })

    if (input.isPinned != null && input.isPinned !== existing.isPinned) {
      await recordNoteActivity({
        tx,
        userId,
        deal: existing.deal,
        noteId: note.id,
        type: ACTIVITY_TYPE.NOTE_PINNED,
        title: input.isPinned ? "Note pinned" : "Note unpinned",
        description: `${note.title} was ${input.isPinned ? "pinned" : "unpinned"}.`,
      })
    }

    return {
      id: note.id,
      dealId: note.dealId,
    }
  })
}

export async function archiveNote(userId: string, noteId: string) {
  return prisma.$transaction(async (tx) => {
    const existing = await getOwnedNote(tx, userId, noteId)
    ensureDealIsActive(existing.deal)
    if (existing.status === "Archived") {
      throw new NoteServiceError(
        "Note is already archived.",
        "INVALID_OPERATION"
      )
    }

    const note = await tx.dealNote.update({
      where: { id: existing.id },
      data: {
        status: "Archived",
        archivedAt: new Date(),
        updatedBy: userId,
      },
    })

    return {
      id: note.id,
      dealId: note.dealId,
    }
  })
}

export async function restoreNote(userId: string, noteId: string) {
  return prisma.$transaction(async (tx) => {
    const existing = await getOwnedNote(tx, userId, noteId)
    ensureDealIsActive(existing.deal)
    if (existing.status === "Active") {
      throw new NoteServiceError("Note is already active.", "INVALID_OPERATION")
    }

    const note = await tx.dealNote.update({
      where: { id: existing.id },
      data: {
        status: "Active",
        archivedAt: null,
        updatedBy: userId,
      },
    })

    return {
      id: note.id,
      dealId: note.dealId,
    }
  })
}

export async function deleteNote(userId: string, noteId: string) {
  return prisma.$transaction(async (tx) => {
    const existing = await getOwnedNote(tx, userId, noteId)
    ensureDealIsActive(existing.deal)
    if (existing.status !== "Archived") {
      throw new NoteServiceError(
        "Only archived notes can be deleted.",
        "FORBIDDEN"
      )
    }

    await tx.dealNote.delete({
      where: { id: existing.id },
    })

    return {
      id: existing.id,
      dealId: existing.dealId,
    }
  })
}
