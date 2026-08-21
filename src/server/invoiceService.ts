import type { Prisma } from "@prisma/client"
import { prisma } from "@/lib/db/prisma"
import type { GenerateInvoiceInput } from "@/schemas/invoice"
import type { MediaKitFormData } from "@/schemas/mediaKit"
import type {
  GeneratedInvoice,
  InvoiceDraftData,
  InvoiceLineItem,
  RecentInvoice,
} from "@/types/invoice"
import { getRateAddOns } from "@/utils/mediaKitRateBreakdown"

type MediaKitAddOns = MediaKitFormData["rates"]["addOns"]

export class InvoiceServiceError extends Error {
  code: "NOT_FOUND" | "INVALID_OPERATION"

  constructor(message: string, code: InvoiceServiceError["code"]) {
    super(message)
    this.name = "InvoiceServiceError"
    this.code = code
  }
}

function toDateString(date: Date) {
  return date.toISOString().slice(0, 10)
}

function parseDateString(value: string) {
  return new Date(`${value}T00:00:00.000Z`)
}

export async function getInvoiceDraftData(
  userId: string
): Promise<InvoiceDraftData | null> {
  const record = await prisma.mediaKit.findUnique({
    where: { userId },
    select: {
      currency: true,
      paymentTerms: true,
      addOns: true,
      rateDeliverables: {
        orderBy: { orderIndex: "asc" },
        select: {
          id: true,
          title: true,
          price: true,
        },
      },
    },
  })

  if (!record) {
    return null
  }

  const { addOns } = getRateAddOns(record.addOns as MediaKitAddOns)

  return {
    currency: record.currency,
    paymentTerms: record.paymentTerms,
    deliverables: record.rateDeliverables.map((deliverable) => ({
      id: deliverable.id,
      title: deliverable.title,
      price: Number(deliverable.price),
    })),
    addOns,
  }
}

export async function listRecentInvoices(
  userId: string,
  limit = 5
): Promise<RecentInvoice[]> {
  const records = await prisma.invoice.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      invoiceNumber: true,
      amount: true,
      currency: true,
      issuedAt: true,
      metadata: true,
    },
  })

  return records.map((record) => {
    const metadata = record.metadata as Prisma.JsonValue | null
    const clientName =
      metadata &&
      typeof metadata === "object" &&
      !Array.isArray(metadata) &&
      typeof metadata.clientName === "string"
        ? metadata.clientName
        : null

    return {
      id: record.id,
      invoiceNumber: record.invoiceNumber,
      clientName,
      amount: Number(record.amount),
      currency: record.currency,
      issuedAt: record.issuedAt,
    }
  })
}

async function getNextInvoiceNumber(
  tx: Prisma.TransactionClient,
  userId: string,
  year: number
) {
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

  return String(count + 1).padStart(4, "0")
}

export async function generateMediaKitInvoice(
  userId: string,
  input: GenerateInvoiceInput
): Promise<GeneratedInvoice> {
  const kit = await prisma.mediaKit.findUnique({
    where: { userId },
    select: {
      currency: true,
      addOns: true,
      rateDeliverables: {
        select: {
          id: true,
          title: true,
          price: true,
        },
      },
    },
  })

  if (!kit) {
    throw new InvoiceServiceError(
      "Create your media kit before generating invoices.",
      "NOT_FOUND"
    )
  }

  const deliverableById = new Map(
    kit.rateDeliverables.map((deliverable) => [deliverable.id, deliverable])
  )

  const selectedIds = [...new Set(input.deliverableIds)]
  const selected = selectedIds.map((id) => deliverableById.get(id))

  if (selected.some((deliverable) => !deliverable)) {
    throw new InvoiceServiceError(
      "One or more selected deliverables no longer exist in your rate card. Refresh and try again.",
      "INVALID_OPERATION"
    )
  }

  const { addOns } = getRateAddOns(kit.addOns as MediaKitAddOns)

  const lineItems: InvoiceLineItem[] = selected.map((deliverable) => {
    let amount = Number(deliverable?.price ?? 0)

    if (input.applyAddOns) {
      amount = addOns.reduce((total, addOn) => total * addOn.multiplier, amount)
    }

    return {
      description: deliverable?.title.trim() ?? "",
      amount: Math.round(amount),
    }
  })

  const totalAmount = lineItems.reduce((sum, item) => sum + item.amount, 0)

  if (totalAmount <= 0) {
    throw new InvoiceServiceError(
      "The selected deliverables have no invoiceable amount.",
      "INVALID_OPERATION"
    )
  }

  const issuedAt = parseDateString(input.issueDate)
  const dueDate = parseDateString(input.dueDate)

  const metadata = {
    source: "media-kit",
    clientName: input.clientName,
    ...(input.clientEmail ? { clientEmail: input.clientEmail } : {}),
    applyAddOns: input.applyAddOns,
    ...(input.applyAddOns && addOns.length > 0
      ? { appliedAddOns: addOns.map((addOn) => addOn.label) }
      : {}),
    lineItems: lineItems.map((item) => ({
      description: item.description,
      quantity: 1,
      amount: item.amount,
      currency: kit.currency,
    })),
  } satisfies Prisma.InputJsonObject

  const created = await prisma.$transaction(async (tx) => {
    const year = issuedAt.getUTCFullYear()
    const sequence = await getNextInvoiceNumber(tx, userId, year)

    return tx.invoice.create({
      data: {
        userId,
        invoiceNumber: `INV-${year}-${sequence}`,
        status: "Draft",
        amount: totalAmount,
        currency: kit.currency,
        issuedAt,
        dueDate,
        metadata,
      },
    })
  })

  return {
    id: created.id,
    invoiceNumber: created.invoiceNumber,
    clientName: input.clientName,
    clientEmail: input.clientEmail || null,
    currency: created.currency,
    amount: Number(created.amount),
    issuedAt: toDateString(created.issuedAt),
    dueDate: created.dueDate ? toDateString(created.dueDate) : "",
    lineItems,
    notes: input.notes || null,
  }
}
