import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockPrisma, mockRecordActivity } = vi.hoisted(() => {
  const deliverableFindFirst = vi.fn()
  const invoiceCount = vi.fn()
  const invoiceCreate = vi.fn()

  const tx = {
    deliverable: { findFirst: deliverableFindFirst },
    invoice: {
      count: invoiceCount,
      create: invoiceCreate,
    },
  }

  const prisma = {
    ...tx,
    $transaction: vi.fn(async (input: unknown) => {
      if (typeof input === "function") {
        return (input as (client: typeof tx) => Promise<unknown>)(tx)
      }
      return Promise.all(input as Promise<unknown>[])
    }),
  }

  return {
    mockPrisma: prisma,
    mockRecordActivity: vi.fn(),
  }
})

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}))

vi.mock("@/lib/crm/activity/activityService", () => ({
  recordActivity: mockRecordActivity,
}))

import { createInvoiceFromDeliverable } from "./invoiceService"

describe("invoiceService deliverable generation", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPrisma.invoice.count.mockResolvedValue(0)
    mockPrisma.invoice.create.mockImplementation(async ({ data }) => ({
      id: "invoice-1",
      ...data,
      createdAt: new Date("2026-06-23T00:00:00.000Z"),
      updatedAt: new Date("2026-06-23T00:00:00.000Z"),
    }))
  })

  it("creates a draft invoice from an owned deliverable using the full deal value", async () => {
    const paymentDueDate = new Date("2026-07-15T00:00:00.000Z")
    mockPrisma.deliverable.findFirst.mockResolvedValueOnce({
      id: "deliverable-1",
      userId: "user-1",
      dealId: "deal-1",
      platform: "Instagram",
      deliverableType: "Reel",
      dueDate: new Date("2026-07-01T00:00:00.000Z"),
      status: "Published",
      approvalStatus: "Approved",
      submissionUrl: "https://example.com/submission",
      publishedUrl: "https://example.com/reel",
      internalNotes: "Internal note",
      brandNotes: "Brand note",
      revisionCount: 1,
      orderIndex: 0,
      isArchived: false,
      archivedAt: null,
      createdBy: "user-1",
      updatedBy: "user-1",
      createdAt: new Date("2026-06-20T00:00:00.000Z"),
      updatedAt: new Date("2026-06-22T00:00:00.000Z"),
      deal: {
        id: "deal-1",
        brandId: "brand-1",
        contactId: "contact-1",
        campaignName: "Summer Drop",
        dealValue: 8500,
        currency: "USD",
        paymentDueDate,
        paymentTerms: "Net 15",
        campaignDescription: "Launch campaign",
        deliverablesSummary: "1 Instagram Reel",
        status: "Active",
        brand: {
          name: "Glow Republic",
          primaryContactName: "Avery",
          primaryContactEmail: "avery@example.com",
        },
        contact: {
          name: "Avery Brand",
          email: "avery.brand@example.com",
        },
      },
    })

    const invoice = await createInvoiceFromDeliverable("user-1", "deliverable-1")

    expect(invoice).toMatchObject({
      id: "invoice-1",
      invoiceNumber: "INV-2026-0001",
      status: "Draft",
      amount: 8500,
      currency: "USD",
      dueDate: paymentDueDate,
      dealId: "deal-1",
    })

    expect(mockPrisma.invoice.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: "user-1",
        dealId: "deal-1",
        invoiceNumber: "INV-2026-0001",
        status: "Draft",
        amount: 8500,
        currency: "USD",
        dueDate: paymentDueDate,
        metadata: expect.objectContaining({
          source: "deliverable",
          deliverableId: "deliverable-1",
          templateKey: "campaign-deliverable-default",
          campaignName: "Summer Drop",
          brandName: "Glow Republic",
          platform: "Instagram",
          deliverableType: "Reel",
          paymentTerms: "Net 15",
          lineItems: [
            {
              description: "Summer Drop: Instagram Reel",
              quantity: 1,
              amount: 8500,
              currency: "USD",
            },
          ],
        }),
      }),
    })

    expect(mockRecordActivity).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        userId: "user-1",
        type: "InvoiceGenerated",
        entityType: "Invoice",
        entityId: "invoice-1",
        dealId: "deal-1",
        brandId: "brand-1",
        contactId: "contact-1",
        title: "Invoice draft created",
      }),
    )
  })

  it("rejects missing or cross-user deliverables", async () => {
    mockPrisma.deliverable.findFirst.mockResolvedValueOnce(null)

    await expect(createInvoiceFromDeliverable("user-1", "deliverable-1")).rejects.toMatchObject({
      code: "NOT_FOUND",
      field: "deliverableId",
    })
    expect(mockPrisma.invoice.create).not.toHaveBeenCalled()
  })

  it("rejects archived deliverables", async () => {
    mockPrisma.deliverable.findFirst.mockResolvedValueOnce({
      id: "deliverable-1",
      isArchived: true,
      deal: { status: "Active" },
    })

    await expect(createInvoiceFromDeliverable("user-1", "deliverable-1")).rejects.toMatchObject({
      code: "INVALID_OPERATION",
      field: "deliverableId",
      name: "InvoiceServiceError",
    })
  })
})
