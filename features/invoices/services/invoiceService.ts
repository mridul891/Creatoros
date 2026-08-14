import type { Prisma, PrismaClient } from "@prisma/client"

import { ACTIVITY_ENTITY, ACTIVITY_TYPE } from "@/enums/activity"
import { recordActivity } from "@/features/activity/services/activityService"
import { InvoiceStatus } from "@/features/invoices/enums/invoice"
import type { InvoiceListInput } from "@/features/invoices/schemas/invoiceValidation"
import type {
  InvoiceListData,
  InvoiceListItem,
} from "@/features/invoices/types/invoice"
import {
  buildDeliverableInvoiceDescription,
  buildDeliverableInvoiceMetadata,
} from "@/features/invoices/utils/invoiceTemplates"
import { prisma } from "@/lib/db/prisma"

type PrismaTx = Prisma.TransactionClient | PrismaClient

type InvoiceServiceErrorField = "deliverableId" | "invoiceId" | "dealId"

export class InvoiceServiceError extends Error {
  code: "NOT_FOUND" | "INVALID_OPERATION" | "FORBIDDEN" | "UNKNOWN"
  field?: InvoiceServiceErrorField

  constructor(
    message: string,
    code: InvoiceServiceError["code"],
    field?: InvoiceServiceErrorField
  ) {
    super(message)
    this.name = "InvoiceServiceError"
    this.code = code
    this.field = field
  }
}

type DeliverableWithDeal = {
  id: string
  platform: string
  deliverableType: string
  submissionUrl: string | null
  publishedUrl: string | null
  brandNotes: string | null
  isArchived: boolean
  deal: {
    id: string
    brandId: string
    contactId: string | null
    campaignName: string
    dealValue: Prisma.Decimal | number
    currency: string
    paymentDueDate: Date | null
    paymentTerms: string | null
    campaignDescription: string | null
    deliverablesSummary: string | null
    status: "Active" | "Archived"
    brand: {
      name: string
      primaryContactName: string | null
      primaryContactEmail: string | null
    }
    contact: {
      name: string
      email: string | null
    } | null
  }
}

function toAmount(value: Prisma.Decimal | number) {
  return typeof value === "number" ? value : value.toNumber()
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function getMetadataDescription(metadata: Prisma.JsonValue | null) {
  if (!isRecord(metadata)) {
    return ""
  }

  const lineItems = metadata.lineItems
  if (!Array.isArray(lineItems)) {
    return ""
  }

  const firstLineItem = lineItems[0]
  if (
    !isRecord(firstLineItem) ||
    typeof firstLineItem.description !== "string"
  ) {
    return ""
  }

  return firstLineItem.description
}

function toListItem(item: {
  id: string
  dealId: string | null
  invoiceNumber: string
  status: string
  amount: Prisma.Decimal | number
  currency: string
  issuedAt: Date
  dueDate: Date | null
  metadata: Prisma.JsonValue | null
  createdAt: Date
  updatedAt: Date
  deal: {
    campaignName: string
    brand: {
      name: string
    }
  } | null
}): InvoiceListItem {
  const metadata = isRecord(item.metadata) ? item.metadata : null
  const brandName =
    item.deal?.brand.name ??
    (typeof metadata?.brandName === "string" ? metadata.brandName : null)
  const campaignName =
    item.deal?.campaignName ??
    (typeof metadata?.campaignName === "string" ? metadata.campaignName : null)

  return {
    id: item.id,
    invoiceNumber: item.invoiceNumber,
    dealId: item.dealId,
    client: brandName ?? "Unassigned Brand",
    brandName,
    campaignName,
    amount: toAmount(item.amount),
    currency: item.currency,
    issuedAt: item.issuedAt,
    dueDate: item.dueDate,
    status: item.status as InvoiceStatus,
    description:
      getMetadataDescription(item.metadata) || campaignName || "Invoice",
    metadata,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }
}

async function getOwnedDeliverable(
  tx: PrismaTx,
  userId: string,
  deliverableId: string
): Promise<DeliverableWithDeal> {
  const deliverable = await tx.deliverable.findFirst({
    where: { id: deliverableId, userId },
    select: {
      id: true,
      platform: true,
      deliverableType: true,
      submissionUrl: true,
      publishedUrl: true,
      brandNotes: true,
      isArchived: true,
      deal: {
        select: {
          id: true,
          brandId: true,
          contactId: true,
          campaignName: true,
          dealValue: true,
          currency: true,
          paymentDueDate: true,
          paymentTerms: true,
          campaignDescription: true,
          deliverablesSummary: true,
          status: true,
          brand: {
            select: {
              name: true,
              primaryContactName: true,
              primaryContactEmail: true,
            },
          },
          contact: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  })

  if (!deliverable) {
    throw new InvoiceServiceError(
      "Deliverable not found.",
      "NOT_FOUND",
      "deliverableId"
    )
  }

  return deliverable as DeliverableWithDeal
}

function ensureInvoiceCanBeCreated(deliverable: DeliverableWithDeal) {
  if (deliverable.isArchived) {
    throw new InvoiceServiceError(
      "Archived deliverables cannot be invoiced.",
      "INVALID_OPERATION",
      "deliverableId"
    )
  }

  if (deliverable.deal.status === "Archived") {
    throw new InvoiceServiceError(
      "Archived deals cannot be invoiced.",
      "INVALID_OPERATION",
      "dealId"
    )
  }
}

async function getNextInvoiceNumber(tx: PrismaTx, userId: string) {
  const now = new Date()
  const year = now.getFullYear()
  const start = new Date(Date.UTC(year, 0, 1))
  const end = new Date(Date.UTC(year + 1, 0, 1))
  const count = await tx.invoice.count({
    where: {
      userId,
      issuedAt: {
        gte: start,
        lt: end,
      },
    },
  })

  return `INV-${year}-${String(count + 1).padStart(4, "0")}`
}

export async function createInvoiceFromDeliverable(
  userId: string,
  deliverableId: string
): Promise<InvoiceListItem> {
  return prisma.$transaction(async (tx) => {
    const deliverable = await getOwnedDeliverable(tx, userId, deliverableId)
    ensureInvoiceCanBeCreated(deliverable)

    const deal = deliverable.deal
    const amount = toAmount(deal.dealValue)
    const invoiceNumber = await getNextInvoiceNumber(tx, userId)
    const metadata = buildDeliverableInvoiceMetadata({
      deliverableId: deliverable.id,
      campaignName: deal.campaignName,
      brandName: deal.brand.name,
      contactName: deal.contact?.name ?? deal.brand.primaryContactName,
      contactEmail: deal.contact?.email ?? deal.brand.primaryContactEmail,
      platform: deliverable.platform,
      deliverableType: deliverable.deliverableType,
      amount,
      currency: deal.currency,
      paymentTerms: deal.paymentTerms,
      campaignDescription: deal.campaignDescription,
      deliverablesSummary: deal.deliverablesSummary,
      brandNotes: deliverable.brandNotes,
      submissionUrl: deliverable.submissionUrl,
      publishedUrl: deliverable.publishedUrl,
    })

    const created = await tx.invoice.create({
      data: {
        userId,
        dealId: deal.id,
        invoiceNumber,
        status: InvoiceStatus.DRAFT,
        amount,
        currency: deal.currency,
        dueDate: deal.paymentDueDate,
        metadata,
      },
    })

    await recordActivity(tx, {
      userId,
      type: ACTIVITY_TYPE.INVOICE_GENERATED,
      entityType: ACTIVITY_ENTITY.INVOICE,
      entityId: created.id,
      dealId: deal.id,
      brandId: deal.brandId,
      contactId: deal.contactId,
      title: "Invoice draft created",
      description: `${invoiceNumber} was created for ${buildDeliverableInvoiceDescription(
        {
          campaignName: deal.campaignName,
          platform: deliverable.platform,
          deliverableType: deliverable.deliverableType,
        }
      )}.`,
      metadata: {
        invoiceNumber,
        deliverableId: deliverable.id,
        amount,
        currency: deal.currency,
      },
    })

    return toListItem({
      ...created,
      deal: {
        campaignName: deal.campaignName,
        brand: {
          name: deal.brand.name,
        },
      },
    })
  })
}

export async function listUserInvoices(
  userId: string,
  input: InvoiceListInput = {}
): Promise<InvoiceListData> {
  const search = input.search?.trim() ?? ""
  const where: Prisma.InvoiceWhereInput = {
    userId,
    ...(input.status ? { status: input.status } : {}),
    ...(search
      ? {
          OR: [
            { invoiceNumber: { contains: search, mode: "insensitive" } },
            {
              deal: { campaignName: { contains: search, mode: "insensitive" } },
            },
            {
              deal: {
                brand: { name: { contains: search, mode: "insensitive" } },
              },
            },
          ],
        }
      : {}),
  }

  const items = await prisma.invoice.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      deal: {
        select: {
          campaignName: true,
          brand: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })

  const listItems = items.map((item) => toListItem(item))

  return {
    items: listItems,
    summary: {
      total: listItems.length,
      paidAmount: listItems
        .filter((item) => item.status === InvoiceStatus.PAID)
        .reduce((sum, item) => sum + item.amount, 0),
      sentAmount: listItems
        .filter((item) => item.status === InvoiceStatus.SENT)
        .reduce((sum, item) => sum + item.amount, 0),
      overdueAmount: listItems
        .filter((item) => item.status === InvoiceStatus.OVERDUE)
        .reduce((sum, item) => sum + item.amount, 0),
    },
    filters: {
      search,
      ...(input.status ? { status: input.status } : {}),
    },
  }
}
