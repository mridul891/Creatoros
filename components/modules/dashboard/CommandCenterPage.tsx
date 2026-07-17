import Link from "next/link"

import type { CommandCenterData } from "@/lib/crm/dashboard/commandCenterService"

type CommandCenterPageProps = {
  data: CommandCenterData
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)
}

export function CommandCenterPage({ data }: CommandCenterPageProps) {
  const cards = [
    { label: "Today's Tasks", value: data.todayTasks },
    { label: "Today's Deliverables", value: data.todayDeliverables },
    { label: "Deals Waiting For Response", value: data.dealsWaitingForResponse },
    { label: "Deals Near Deadline", value: data.dealsNearDeadline },
    { label: "Payments Expected", value: formatCurrency(data.paymentsExpected) },
    { label: "Overdue Payments", value: formatCurrency(data.overduePayments) },
  ]

  return (
    <div className="w-full max-w-[1100px] px-9 py-7">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-foreground">Today</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">Your command center for campaign execution.</p>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-[14px] border border-border bg-card p-4">
            <p className="text-[12px] text-muted-foreground">{card.label}</p>
            <p className="mt-2 text-[24px] font-extrabold tracking-[-0.03em] text-foreground">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 rounded-[14px] border border-border bg-card p-4">
        <h2 className="text-[14px] font-semibold text-foreground">Quick Actions</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/dashboard/deals" className="rounded-md border border-border px-3 py-2 text-[12px] text-muted-foreground">
            Open Deals Workspace
          </Link>
          <Link href="/dashboard/deals?view=table" className="rounded-md border border-border px-3 py-2 text-[12px] text-muted-foreground">
            Review Pipeline
          </Link>
          <Link href="/dashboard/deals?archive=archived" className="rounded-md border border-border px-3 py-2 text-[12px] text-muted-foreground">
            Review Archived Deals
          </Link>
        </div>
      </div>

      <div className="rounded-[14px] border border-border bg-card p-4">
        <h2 className="text-[14px] font-semibold text-foreground">Recent Activity</h2>
        <div className="mt-3 space-y-2">
          {data.recentActivity.length === 0 ? (
            <p className="text-[12px] text-muted-foreground">No recent activity yet.</p>
          ) : (
            data.recentActivity.map((entry) => (
              <div key={entry.id} className="rounded-md border border-border bg-muted p-3">
                <p className="text-[12px] font-semibold text-foreground">{entry.title}</p>
                {entry.description ? <p className="mt-1 text-[11px] text-muted-foreground">{entry.description}</p> : null}
                <p className="mt-1 text-[10px] text-muted-foreground">{new Date(entry.createdAt).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
