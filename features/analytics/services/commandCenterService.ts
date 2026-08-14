import { prisma } from "@/lib/db/prisma"

type CommandCenterData = {
  todayTasks: number
  todayDeliverables: number
  dealsWaitingForResponse: number
  dealsNearDeadline: number
  paymentsExpected: number
  overduePayments: number
  recentActivity: Array<{
    id: string
    title: string
    description: string | null
    createdAt: Date
  }>
}

function getTodayBounds() {
  const now = new Date()
  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  )
  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  )
  return { start, end }
}

export async function getCommandCenterData(
  userId: string
): Promise<CommandCenterData> {
  const now = new Date()
  const { start: todayStart, end: todayEnd } = getTodayBounds()
  const nearDeadlineEnd = new Date(todayEnd)
  nearDeadlineEnd.setDate(nearDeadlineEnd.getDate() + 7)

  const [
    todayTasks,
    todayDeliverables,
    dealsWaitingForResponse,
    dealsNearDeadline,
    paymentsExpected,
    overduePayments,
    recentActivity,
  ] = await Promise.all([
    prisma.task.count({
      where: {
        userId,
        isArchived: false,
        status: { not: "Done" },
        dueDate: { gte: todayStart, lte: todayEnd },
      },
    }),
    prisma.deliverable.count({
      where: {
        userId,
        isArchived: false,
        status: { in: ["Draft", "Ready", "Submitted", "NeedsRevision"] },
        dueDate: { gte: todayStart, lte: todayEnd },
      },
    }),
    prisma.deal.count({
      where: {
        userId,
        status: "Active",
        stage: { in: ["Contacted", "ProposalSent", "Negotiation"] },
      },
    }),
    prisma.deal.count({
      where: {
        userId,
        status: "Active",
        dueDate: {
          gte: todayStart,
          lte: nearDeadlineEnd,
        },
        stage: { notIn: ["Paid", "Cancelled"] },
      },
    }),
    prisma.invoice.aggregate({
      where: {
        userId,
        status: { in: ["Draft", "Sent"] },
        dueDate: {
          gte: todayStart,
          lte: nearDeadlineEnd,
        },
      },
      _sum: {
        amount: true,
      },
    }),
    prisma.invoice.aggregate({
      where: {
        userId,
        status: { in: ["Draft", "Sent", "Overdue"] },
        dueDate: {
          lt: now,
        },
      },
      _sum: {
        amount: true,
      },
    }),
    prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
      },
    }),
  ])

  return {
    todayTasks,
    todayDeliverables,
    dealsWaitingForResponse,
    dealsNearDeadline,
    paymentsExpected: Number(paymentsExpected._sum.amount ?? 0),
    overduePayments: Number(overduePayments._sum.amount ?? 0),
    recentActivity,
  }
}

export type { CommandCenterData }
