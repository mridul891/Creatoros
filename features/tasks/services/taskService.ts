import type { Prisma, PrismaClient } from "@prisma/client"

import { ACTIVITY_ENTITY, ACTIVITY_TYPE } from "@/enums/activity"
import { recordActivity } from "@/features/activity/services/activityService"
import { TASK_PRIORITIES, type TaskPriority } from "@/features/tasks/enums/task"
import {
  normalizeTaskTitle,
  type TaskCreateUpdateInput,
  type TaskListInput,
  type TaskStatusUpdateInput,
  toPrioritySortValue,
} from "@/features/tasks/schemas/taskValidation"
import type {
  TaskDetail,
  TaskListData,
  TaskListItem,
} from "@/features/tasks/types/task"
import { prisma } from "@/lib/db/prisma"
import { endOfLocalDay, startOfLocalDay } from "@/lib/formatting/date-input"
import { clampPage, clampPageSize } from "@/lib/utils/pagination"

const PAGE_SIZE_DEFAULT = 20
const PAGE_SIZE_MAX = 50
const UPCOMING_WINDOW_DAYS = 14

type PrismaTx = Prisma.TransactionClient | PrismaClient

type TaskServiceErrorField =
  | "title"
  | "status"
  | "priority"
  | "dealId"
  | "taskId"

export class TaskServiceError extends Error {
  code:
    | "NOT_FOUND"
    | "DUPLICATE"
    | "INVALID_OPERATION"
    | "FORBIDDEN"
    | "UNKNOWN"
  field?: TaskServiceErrorField

  constructor(
    message: string,
    code: TaskServiceError["code"],
    field?: TaskServiceErrorField
  ) {
    super(message)
    this.name = "TaskServiceError"
    this.code = code
    this.field = field
  }
}

type TaskProjection = {
  id: string
  userId: string
  dealId: string
  title: string
  description: string | null
  status: string
  priority: string
  dueDate: Date | null
  orderIndex: number
  isArchived: boolean
  archivedAt: Date | null
  createdBy: string
  updatedBy: string
  createdAt: Date
  updatedAt: Date
}

type OwnedDeal = {
  id: string
  brandId: string
  contactId: string | null
  campaignName: string
  status: "Active" | "Archived"
}

function toListItem(task: TaskProjection): TaskListItem {
  return {
    id: task.id,
    dealId: task.dealId,
    title: task.title,
    description: task.description,
    status: task.status as TaskListItem["status"],
    priority: task.priority as TaskListItem["priority"],
    dueDate: task.dueDate,
    orderIndex: task.orderIndex,
    isArchived: task.isArchived,
    archivedAt: task.archivedAt,
    createdBy: task.createdBy,
    updatedBy: task.updatedBy,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
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
    throw new TaskServiceError("Deal not found.", "NOT_FOUND", "dealId")
  }

  return deal
}

async function getOwnedTask(tx: PrismaTx, userId: string, taskId: string) {
  const task = await tx.task.findFirst({
    where: { id: taskId, userId },
    select: {
      id: true,
      userId: true,
      dealId: true,
      title: true,
      description: true,
      normalizedTitle: true,
      status: true,
      priority: true,
      dueDate: true,
      orderIndex: true,
      isArchived: true,
      archivedAt: true,
      createdBy: true,
      updatedBy: true,
      createdAt: true,
      updatedAt: true,
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

  if (!task) {
    throw new TaskServiceError("Task not found.", "NOT_FOUND", "taskId")
  }

  return task
}

function getDueDateFilter(
  input: TaskListInput["dueDate"]
): Prisma.DateTimeNullableFilter | null | undefined {
  const now = new Date()
  const todayStart = startOfLocalDay(now)
  switch (input) {
    case "upcoming": {
      const end = new Date(now)
      end.setDate(now.getDate() + UPCOMING_WINDOW_DAYS)
      return { gte: todayStart, lte: endOfLocalDay(end) }
    }
    case "overdue":
      return { lt: todayStart }
    case "none":
      return null
    default:
      return undefined
  }
}

function buildListWhere(
  userId: string,
  input: TaskListInput
): Prisma.TaskWhereInput {
  const search = input.search?.trim() ?? ""
  const dueDateFilter = getDueDateFilter(input.dueDate)
  const andFilters: Prisma.TaskWhereInput[] = []

  if (input.status) {
    andFilters.push({ status: input.status })
  }

  if (input.dueDate === "overdue") {
    andFilters.push({ status: { not: "Done" } })
  }

  return {
    userId,
    dealId: input.dealId,
    isArchived: input.archive === "archived",
    ...(input.priority ? { priority: input.priority } : {}),
    ...(dueDateFilter === null
      ? { dueDate: null }
      : dueDateFilter
        ? { dueDate: dueDateFilter }
        : {}),
    ...(andFilters.length > 0 ? { AND: andFilters } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  }
}

function getSortOrder(
  sort: TaskListInput["sort"]
): Prisma.TaskOrderByWithRelationInput[] {
  switch (sort) {
    case "dueDate":
      return [{ dueDate: "asc" }, { updatedAt: "desc" }]
    case "updatedAt":
      return [{ updatedAt: "desc" }]
    case "priority":
      return [{ priority: "desc" }, { updatedAt: "desc" }]
    default:
      return [{ orderIndex: "asc" }, { updatedAt: "desc" }]
  }
}

async function getNextOrderIndex(tx: PrismaTx, userId: string, dealId: string) {
  const lastTask = await tx.task.findFirst({
    where: { userId, dealId },
    orderBy: { orderIndex: "desc" },
    select: { orderIndex: true },
  })
  return (lastTask?.orderIndex ?? -1) + 1
}

async function lockTaskOrdering(tx: PrismaTx, userId: string, dealId: string) {
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`${userId}:${dealId}`}))`
}

function mapPrismaError(error: unknown): never {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string" &&
    error.code === "P2002"
  ) {
    throw new TaskServiceError(
      "A task with this title already exists for this deal.",
      "DUPLICATE",
      "title"
    )
  }

  throw error
}

function ensureTaskIsMutable(task: { isArchived: boolean }) {
  if (task.isArchived) {
    throw new TaskServiceError(
      "Archived tasks cannot be modified.",
      "INVALID_OPERATION"
    )
  }
}

function ensureDealIsActive(deal: OwnedDeal) {
  if (deal.status === "Archived") {
    throw new TaskServiceError(
      "Tasks cannot be changed for archived deals.",
      "INVALID_OPERATION",
      "dealId"
    )
  }
}

async function recordTaskActivity(options: {
  tx: PrismaTx
  userId: string
  deal: OwnedDeal
  taskId: string
  type: (typeof ACTIVITY_TYPE)[keyof typeof ACTIVITY_TYPE]
  title: string
  description: string
  metadata?: Prisma.InputJsonValue
}) {
  await recordActivity(options.tx, {
    userId: options.userId,
    type: options.type,
    entityType: ACTIVITY_ENTITY.TASK,
    entityId: options.taskId,
    dealId: options.deal.id,
    brandId: options.deal.brandId,
    contactId: options.deal.contactId,
    title: options.title,
    description: options.description,
    metadata: options.metadata,
  })
}

export async function listDealTasks(
  userId: string,
  input: TaskListInput
): Promise<TaskListData> {
  const requestedPage = clampPage(input.page)
  const pageSize = clampPageSize(input.pageSize, {
    pageSize: PAGE_SIZE_DEFAULT,
    maxPageSize: PAGE_SIZE_MAX,
  })
  const skip = (requestedPage - 1) * pageSize
  const where = buildListWhere(userId, input)
  const orderBy = getSortOrder(input.sort)

  await getOwnedDeal(prisma, userId, input.dealId)

  const now = new Date()
  const todayStart = startOfLocalDay(now)
  const upcomingCutoff = new Date(now)
  upcomingCutoff.setDate(now.getDate() + UPCOMING_WINDOW_DAYS)
  const upcomingCutoffEnd = endOfLocalDay(upcomingCutoff)
  const shouldComputeUpcoming = input.dueDate !== "none"
  const shouldComputeOverdue = input.dueDate !== "none"

  const [items, total, completed, upcoming, overdue] =
    await prisma.$transaction([
      prisma.task.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        select: {
          id: true,
          userId: true,
          dealId: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          dueDate: true,
          orderIndex: true,
          isArchived: true,
          archivedAt: true,
          createdBy: true,
          updatedBy: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.task.count({ where }),
      prisma.task.count({
        where: {
          ...where,
          status: "Done",
        },
      }),
      prisma.task.count({
        where: {
          ...where,
          ...(shouldComputeUpcoming
            ? { dueDate: { gte: todayStart, lte: upcomingCutoffEnd } }
            : { id: { in: [] } }),
          status: { not: "Done" },
        },
      }),
      prisma.task.count({
        where: {
          ...where,
          ...(shouldComputeOverdue
            ? { dueDate: { lt: todayStart } }
            : { id: { in: [] } }),
          status: { not: "Done" },
        },
      }),
    ])

  const listItems = items.map((item) => toListItem(item))
  const summary = {
    total,
    completed,
    upcoming,
    overdue,
    progress: total === 0 ? 0 : Math.round((completed / total) * 100),
  }

  return {
    items: listItems,
    pagination: {
      page: requestedPage,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
    filters: {
      search: input.search ?? "",
      archive: input.archive,
      dueDate: input.dueDate,
      sort: input.sort,
      ...(input.status ? { status: input.status } : {}),
      ...(input.priority ? { priority: input.priority } : {}),
    },
    summary,
  }
}

export async function getTask(
  userId: string,
  taskId: string
): Promise<TaskDetail> {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
    select: {
      id: true,
      userId: true,
      dealId: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      dueDate: true,
      orderIndex: true,
      isArchived: true,
      archivedAt: true,
      createdBy: true,
      updatedBy: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!task) {
    throw new TaskServiceError("Task not found.", "NOT_FOUND", "taskId")
  }

  return {
    ...toListItem(task),
    userId: task.userId,
  }
}

export async function createTask(userId: string, input: TaskCreateUpdateInput) {
  return prisma.$transaction(async (tx) => {
    if (input.status !== "Todo") {
      throw new TaskServiceError(
        "New tasks must start in Todo.",
        "INVALID_OPERATION",
        "status"
      )
    }

    const deal = await getOwnedDeal(tx, userId, input.dealId)
    ensureDealIsActive(deal)
    await lockTaskOrdering(tx, userId, input.dealId)

    const orderIndex =
      typeof input.orderIndex === "number"
        ? input.orderIndex
        : await getNextOrderIndex(tx, userId, input.dealId)
    const normalizedTitle = normalizeTaskTitle(input.title)

    let created: Awaited<ReturnType<typeof tx.task.create>>
    try {
      created = await tx.task.create({
        data: {
          userId,
          dealId: input.dealId,
          title: input.title,
          normalizedTitle,
          description: input.description ?? null,
          status: input.status,
          priority: input.priority,
          dueDate: input.dueDate ?? null,
          orderIndex,
          createdBy: userId,
          updatedBy: userId,
        },
      })
    } catch (error) {
      mapPrismaError(error)
    }

    await recordTaskActivity({
      tx,
      userId,
      deal,
      taskId: created.id,
      type: ACTIVITY_TYPE.TASK_CREATED,
      title: "Task created",
      description: `${created.title} was created for ${deal.campaignName}.`,
      metadata: {
        taskTitle: created.title,
        status: created.status,
        priority: created.priority,
      },
    })

    return {
      id: created.id,
      title: created.title,
    }
  })
}

export async function updateTask(
  userId: string,
  taskId: string,
  input: TaskCreateUpdateInput
) {
  return prisma.$transaction(async (tx) => {
    const existing = await getOwnedTask(tx, userId, taskId)
    ensureTaskIsMutable(existing)

    if (existing.dealId !== input.dealId) {
      throw new TaskServiceError(
        "Task deal cannot be changed.",
        "INVALID_OPERATION",
        "dealId"
      )
    }

    const deal = await getOwnedDeal(tx, userId, input.dealId)
    ensureDealIsActive(deal)

    const normalizedTitle = normalizeTaskTitle(input.title)

    let updated: Awaited<ReturnType<typeof tx.task.update>>
    try {
      updated = await tx.task.update({
        where: { id: existing.id },
        data: {
          dealId: input.dealId,
          title: input.title,
          normalizedTitle,
          description: input.description ?? null,
          status: input.status,
          priority: input.priority,
          dueDate: input.dueDate ?? null,
          orderIndex: input.orderIndex ?? existing.orderIndex,
          updatedBy: userId,
        },
      })
    } catch (error) {
      mapPrismaError(error)
    }

    await recordTaskActivity({
      tx,
      userId,
      deal,
      taskId: updated.id,
      type: ACTIVITY_TYPE.TASK_UPDATED,
      title: "Task updated",
      description: `${updated.title} was updated.`,
      metadata: {
        previousStatus: existing.status,
        status: updated.status,
        previousPriority: existing.priority,
        priority: updated.priority,
      },
    })

    return {
      id: updated.id,
      title: updated.title,
    }
  })
}

export async function updateTaskStatus(
  userId: string,
  input: TaskStatusUpdateInput
) {
  return prisma.$transaction(async (tx) => {
    const existing = await getOwnedTask(tx, userId, input.taskId)
    ensureTaskIsMutable(existing)
    ensureDealIsActive(existing.deal)

    const updated = await tx.task.update({
      where: { id: existing.id },
      data: {
        status: input.status,
        updatedBy: userId,
      },
    })

    await recordTaskActivity({
      tx,
      userId,
      deal: existing.deal,
      taskId: updated.id,
      type:
        input.status === "Done"
          ? ACTIVITY_TYPE.TASK_COMPLETED
          : ACTIVITY_TYPE.TASK_STATUS_CHANGED,
      title: input.status === "Done" ? "Task completed" : "Task status changed",
      description: `${updated.title} moved to ${input.status}.`,
      metadata: {
        previousStatus: existing.status,
        status: input.status,
      },
    })

    return {
      id: updated.id,
      status: updated.status,
      dealId: existing.deal.id,
    }
  })
}

export async function archiveTask(userId: string, taskId: string) {
  return prisma.$transaction(async (tx) => {
    const existing = await getOwnedTask(tx, userId, taskId)
    ensureDealIsActive(existing.deal)

    if (existing.isArchived) {
      throw new TaskServiceError(
        "Task is already archived.",
        "INVALID_OPERATION"
      )
    }

    const archived = await tx.task.update({
      where: { id: existing.id },
      data: {
        isArchived: true,
        archivedAt: new Date(),
        updatedBy: userId,
      },
    })

    await recordTaskActivity({
      tx,
      userId,
      deal: existing.deal,
      taskId: archived.id,
      type: ACTIVITY_TYPE.TASK_ARCHIVED,
      title: "Task archived",
      description: `${archived.title} was archived.`,
      metadata: {
        taskTitle: archived.title,
      },
    })

    return {
      id: archived.id,
      dealId: existing.deal.id,
    }
  })
}

export async function restoreTask(userId: string, taskId: string) {
  return prisma.$transaction(async (tx) => {
    const existing = await getOwnedTask(tx, userId, taskId)
    ensureDealIsActive(existing.deal)

    if (!existing.isArchived) {
      throw new TaskServiceError("Task is already active.", "INVALID_OPERATION")
    }

    const restored = await tx.task.update({
      where: { id: existing.id },
      data: {
        isArchived: false,
        archivedAt: null,
        updatedBy: userId,
      },
    })

    await recordTaskActivity({
      tx,
      userId,
      deal: existing.deal,
      taskId: restored.id,
      type: ACTIVITY_TYPE.TASK_RESTORED,
      title: "Task restored",
      description: `${restored.title} was restored.`,
      metadata: {
        taskTitle: restored.title,
      },
    })

    return {
      id: restored.id,
      dealId: existing.deal.id,
    }
  })
}

export async function deleteTask(userId: string, taskId: string) {
  return prisma.$transaction(async (tx) => {
    const existing = await getOwnedTask(tx, userId, taskId)
    ensureDealIsActive(existing.deal)

    if (!existing.isArchived) {
      throw new TaskServiceError(
        "Only archived tasks can be deleted.",
        "FORBIDDEN"
      )
    }

    await tx.task.delete({
      where: { id: existing.id },
    })

    await recordTaskActivity({
      tx,
      userId,
      deal: existing.deal,
      taskId: existing.id,
      type: ACTIVITY_TYPE.TASK_DELETED,
      title: "Task deleted",
      description: `${existing.title} was deleted.`,
      metadata: {
        taskTitle: existing.title,
      },
    })

    return {
      id: existing.id,
      dealId: existing.deal.id,
    }
  })
}

export async function reorderTasks(
  userId: string,
  dealId: string,
  orderedTaskIds: string[]
) {
  return prisma.$transaction(async (tx) => {
    const deal = await getOwnedDeal(tx, userId, dealId)
    ensureDealIsActive(deal)
    await lockTaskOrdering(tx, userId, dealId)

    const tasks = await tx.task.findMany({
      where: {
        userId,
        dealId,
        isArchived: false,
      },
      select: {
        id: true,
      },
    })

    const taskSet = new Set(tasks.map((task) => task.id))
    const orderedSet = new Set(orderedTaskIds)
    const hasUnknown = orderedTaskIds.some((taskId) => !taskSet.has(taskId))
    const hasMissing =
      orderedSet.size !== taskSet.size ||
      tasks.some((task) => !orderedSet.has(task.id))

    if (hasUnknown || hasMissing) {
      throw new TaskServiceError(
        "Task ordering payload is invalid.",
        "INVALID_OPERATION"
      )
    }

    for (const [index, taskId] of orderedTaskIds.entries()) {
      await tx.task.update({
        where: { id: taskId },
        data: {
          orderIndex: index,
          updatedBy: userId,
        },
      })
    }

    await recordTaskActivity({
      tx,
      userId,
      deal,
      taskId: dealId,
      type: ACTIVITY_TYPE.TASK_REORDERED,
      title: "Task order updated",
      description: "Task ordering was updated for this deal.",
      metadata: {
        orderSize: orderedTaskIds.length,
      },
    })
  })
}

export function getTaskPriorityOptions() {
  return TASK_PRIORITIES.map((priority) => ({
    value: priority,
    weight: toPrioritySortValue(priority as TaskPriority),
  }))
}
