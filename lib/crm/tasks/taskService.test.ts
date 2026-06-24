import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockPrisma, mockRecordActivity } = vi.hoisted(() => {
  const dealFindFirst = vi.fn()
  const taskFindFirst = vi.fn()
  const taskFindMany = vi.fn()
  const taskCount = vi.fn()
  const taskCreate = vi.fn()
  const taskUpdate = vi.fn()
  const taskDelete = vi.fn()

  const tx = {
    deal: { findFirst: dealFindFirst },
    task: {
      findFirst: taskFindFirst,
      findMany: taskFindMany,
      count: taskCount,
      create: taskCreate,
      update: taskUpdate,
      delete: taskDelete,
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

import { TaskServiceError, createTask, listDealTasks, updateTask } from "./taskService"

describe("taskService domain guards", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("rejects create when status is not Todo", async () => {
    await expect(
      createTask("user-1", {
        dealId: "deal-1",
        title: "Write script",
        description: undefined,
        status: "Done",
        priority: "High",
        dueDate: undefined,
        orderIndex: undefined,
      }),
    ).rejects.toMatchObject({
      code: "INVALID_OPERATION",
      field: "status",
    })
  })

  it("rejects cross-deal task reassignment on update", async () => {
    mockPrisma.task.findFirst.mockResolvedValueOnce({
      id: "task-1",
      userId: "user-1",
      dealId: "deal-a",
      title: "Existing",
      description: null,
      normalizedTitle: "existing",
      status: "Todo",
      priority: "Medium",
      dueDate: null,
      orderIndex: 0,
      isArchived: false,
      archivedAt: null,
      createdBy: "user-1",
      updatedBy: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      deal: {
        id: "deal-a",
        brandId: "brand-1",
        contactId: null,
        campaignName: "Campaign",
        status: "Active",
      },
    })

    await expect(
      updateTask("user-1", "task-1", {
        dealId: "deal-b",
        title: "Renamed",
        description: undefined,
        status: "InProgress",
        priority: "High",
        dueDate: undefined,
        orderIndex: 1,
      }),
    ).rejects.toMatchObject({
      code: "INVALID_OPERATION",
      field: "dealId",
    })
  })

  it("applies overdue filter to open tasks only", async () => {
    mockPrisma.deal.findFirst.mockResolvedValueOnce({
      id: "deal-1",
      brandId: "brand-1",
      contactId: null,
      campaignName: "Campaign",
      status: "Active",
    })

    mockPrisma.task.findMany.mockResolvedValueOnce([])
    mockPrisma.task.count.mockResolvedValue(0)

    await listDealTasks("user-1", {
      dealId: "deal-1",
      archive: "active",
      dueDate: "overdue",
      sort: "order",
      search: "",
      page: 1,
      pageSize: 20,
    })

    const listWhere = mockPrisma.task.findMany.mock.calls[0]?.[0]?.where
    expect(listWhere.AND).toEqual(expect.arrayContaining([{ status: { not: "Done" } }]))
  })
})
