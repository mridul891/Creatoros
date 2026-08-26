import type { Prisma } from "@prisma/client"
import { prisma } from "@/lib/db/prisma"
import type { GenerateInvoiceInput, InvoiceFormData } from "@/schemas/invoice"
import type { MediaKitFormData } from "@/schemas/mediaKit"
import type {
  GeneratedInvoice,
  InvoiceDetailData,
  InvoiceDiscountType,
  InvoiceDraftData,
  InvoiceItemData,
  InvoiceLineItem,
  InvoiceListItem,
  InvoiceParty,
  InvoicePaymentDetails,
  InvoiceSellerDetails,
  InvoiceShippingDetails,
  InvoiceStatusValue,
  RecentInvoice,
} from "@/types/invoice"
import {
  computeBalanceDue,
  computeInvoiceTotals,
} from "@/utils/invoiceCalculations"
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

function readJsonObject<T extends object>(
  value: Prisma.JsonValue | null
): Partial<T> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {}
  }

  return value as Partial<T>
}

function readJsonArray<T>(value: Prisma.JsonValue | null): T[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value as T[]
}

type InvoiceRecordShape = {
  id: string
  invoiceNumber: string
  status: string
  currency: string
  issuedAt: Date
  dueDate: Date | null
  paidDate: Date | null
  amount: Prisma.Decimal
  customerName: string | null
  sellerDetails: Prisma.JsonValue | null
  customerDetails: Prisma.JsonValue | null
  shippingDetails: Prisma.JsonValue | null
  paymentDetails: Prisma.JsonValue | null
  items: Prisma.JsonValue | null
  subtotal: Prisma.Decimal
  discountAmount: Prisma.Decimal
  taxLabel: string | null
  taxRate: Prisma.Decimal
  taxAmount: Prisma.Decimal
  amountPaid: Prisma.Decimal
  notes: string | null
  terms: string | null
  createdAt: Date
  updatedAt: Date
}

export function mapInvoiceToDetail(
  record: InvoiceRecordShape
): InvoiceDetailData {
  const sellerDefaults: InvoiceSellerDetails = {
    businessName: "",
    logoUrl: "",
    website: "",
    name: "",
    email: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    taxId: "",
  }
  const customerDefaults: InvoiceParty = {
    name: "",
    email: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    taxId: "",
  }
  const shippingDefaults: InvoiceShippingDetails = {
    name: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  }
  const paymentDefaults: InvoicePaymentDetails = {
    accountName: "",
    accountNumber: "",
    ifscOrSwift: "",
    bankName: "",
    upiOrPaypal: "",
  }

  const seller: InvoiceSellerDetails = {
    ...sellerDefaults,
    ...readJsonObject<InvoiceSellerDetails>(record.sellerDetails),
  }
  const customer: InvoiceParty = {
    ...customerDefaults,
    ...readJsonObject<InvoiceParty>(record.customerDetails),
  }
  const shipping: InvoiceShippingDetails = {
    ...shippingDefaults,
    ...readJsonObject<InvoiceShippingDetails>(record.shippingDetails),
  }
  const paymentDetails: InvoicePaymentDetails = {
    ...paymentDefaults,
    ...readJsonObject<InvoicePaymentDetails>(record.paymentDetails),
  }

  const storedItems = readJsonArray<InvoiceItemData>(record.items)
  const hasStoredItems = storedItems.length > 0

  const itemsInput = hasStoredItems
    ? storedItems
    : [
        {
          id: "1",
          name: "Services",
          description: "",
          quantity: 1,
          unitPrice: Number(record.amount),
          discountPercent: 0,
        },
      ]

  const computed = computeInvoiceTotals(
    itemsInput,
    { discountType: "none", discountValue: 0 },
    { taxRate: Number(record.taxRate) }
  )

  const subtotal = Number(record.subtotal)
  const discountAmount = Number(record.discountAmount)
  const taxAmount = Number(record.taxAmount)
  const total = Number(record.amount)
  const amountPaid = Number(record.amountPaid)
  const shippingSameAsBilling =
    hasStoredItems && Object.values(shipping).every((value) => !value)

  return {
    id: record.id,
    invoiceNumber: record.invoiceNumber,
    status: record.status as InvoiceStatusValue,
    currency: record.currency,
    issuedAt: toDateString(record.issuedAt),
    dueDate: record.dueDate ? toDateString(record.dueDate) : null,
    paidDate: record.paidDate ? toDateString(record.paidDate) : null,
    seller,
    customer,
    shipping: shippingSameAsBilling ? null : shipping,
    shippingSameAsBilling,
    items: computed.items,
    discountType: discountAmount > 0 ? "fixed" : "none",
    discountValue: discountAmount > 0 ? discountAmount : 0,
    taxLabel: record.taxLabel ?? "",
    taxRate: Number(record.taxRate),
    totals: {
      subtotal,
      discountAmount,
      taxableAmount:
        Math.round((subtotal - discountAmount + Number.EPSILON) * 100) / 100,
      taxAmount,
      total,
    },
    amountPaid,
    balanceDue: computeBalanceDue(total, amountPaid),
    notes: record.notes ?? "",
    terms: record.terms ?? "",
    paymentDetails,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  }
}

function buildInvoiceWriteData(userId: string, data: InvoiceFormData) {
  const totals = computeInvoiceTotals(
    data.items,
    { discountType: data.discountType, discountValue: data.discountValue },
    { taxRate: data.taxRate }
  )

  const shipping = data.shippingSameAsBilling
    ? ({
        name: data.customer.name,
        phone: data.customer.phone,
        addressLine: data.customer.addressLine,
        city: data.customer.city,
        state: data.customer.state,
        postalCode: data.customer.postalCode,
        country: data.customer.country,
      } satisfies InvoiceShippingDetails)
    : data.shipping

  return {
    userId,
    invoiceNumber: data.invoiceNumber?.trim() || "",
    status: data.status,
    amount: totals.total,
    currency: data.currency,
    issuedAt: parseDateString(data.issueDate),
    dueDate: parseDateString(data.dueDate),
    paidDate: data.status === "Paid" ? new Date() : null,
    customerName: data.customer.name,
    sellerDetails: data.seller as unknown as Prisma.InputJsonValue,
    customerDetails: data.customer as unknown as Prisma.InputJsonValue,
    shippingDetails: shipping as unknown as Prisma.InputJsonValue,
    paymentDetails: data.paymentDetails as unknown as Prisma.InputJsonValue,
    items: totals.items as unknown as Prisma.InputJsonValue,
    subtotal: totals.subtotal,
    discountAmount: totals.discountAmount,
    taxLabel: data.taxLabel || null,
    taxRate: data.taxRate,
    taxAmount: totals.taxAmount,
    amountPaid: data.amountPaid,
    notes: data.notes || null,
    terms: data.terms || null,
    metadata: { source: "manual" } satisfies Prisma.InputJsonObject,
  }
}

export async function listInvoicesForUser(
  userId: string
): Promise<InvoiceListItem[]> {
  const records = await prisma.invoice.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      invoiceNumber: true,
      customerName: true,
      status: true,
      amount: true,
      currency: true,
      issuedAt: true,
      dueDate: true,
      updatedAt: true,
    },
  })

  return records.map((record) => ({
    id: record.id,
    invoiceNumber: record.invoiceNumber,
    customerName: record.customerName,
    status: record.status as InvoiceStatusValue,
    amount: Number(record.amount),
    currency: record.currency,
    issuedAt: record.issuedAt,
    dueDate: record.dueDate,
    updatedAt: record.updatedAt,
  }))
}

export async function getInvoiceDetailForUser(
  userId: string,
  invoiceId: string
): Promise<InvoiceDetailData | null> {
  const record = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId },
  })

  if (!record) {
    return null
  }

  return mapInvoiceToDetail(record)
}

export async function createManualInvoice(
  userId: string,
  data: InvoiceFormData
) {
  const writeData = buildInvoiceWriteData(userId, data)

  return prisma.$transaction(async (tx) => {
    let invoiceNumber = writeData.invoiceNumber

    if (!invoiceNumber) {
      const year = writeData.issuedAt.getUTCFullYear()
      const sequence = await getNextInvoiceNumber(tx, userId, year)
      invoiceNumber = `INV-${year}-${sequence}`
    }

    const existing = await tx.invoice.findFirst({
      where: { userId, invoiceNumber },
      select: { id: true },
    })

    if (existing) {
      throw new InvoiceServiceError(
        `You already have an invoice numbered ${invoiceNumber}.`,
        "INVALID_OPERATION"
      )
    }

    return tx.invoice.create({
      data: { ...writeData, invoiceNumber },
    })
  })
}

export async function updateManualInvoice(
  userId: string,
  invoiceId: string,
  data: InvoiceFormData
) {
  const existing = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId },
    select: { id: true },
  })

  if (!existing) {
    throw new InvoiceServiceError("Invoice not found.", "NOT_FOUND")
  }

  const writeData = buildInvoiceWriteData(userId, data)

  return prisma.$transaction(async (tx) => {
    if (writeData.invoiceNumber) {
      const duplicate = await tx.invoice.findFirst({
        where: {
          userId,
          invoiceNumber: writeData.invoiceNumber,
          id: { not: invoiceId },
        },
        select: { id: true },
      })

      if (duplicate) {
        throw new InvoiceServiceError(
          `You already have another invoice numbered ${writeData.invoiceNumber}.`,
          "INVALID_OPERATION"
        )
      }
    }

    return tx.invoice.update({
      where: { id: invoiceId },
      data: writeData,
    })
  })
}

export async function deleteInvoiceForUser(userId: string, invoiceId: string) {
  const result = await prisma.invoice.deleteMany({
    where: { id: invoiceId, userId },
  })

  if (result.count === 0) {
    throw new InvoiceServiceError("Invoice not found.", "NOT_FOUND")
  }
}

export async function updateInvoiceStatusForUser(
  userId: string,
  invoiceId: string,
  status: InvoiceStatusValue
) {
  const existing = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId },
    select: { id: true },
  })

  if (!existing) {
    throw new InvoiceServiceError("Invoice not found.", "NOT_FOUND")
  }

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      status,
      paidDate: status === "Paid" ? new Date() : null,
    },
  })
}
