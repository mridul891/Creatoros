import type { DealListData } from "@/features/deals/types/deal"

type DealsSummaryWidgetsProps = {
  widgets: DealListData["widgets"]
}

export function DealsSummaryWidgets({ widgets }: DealsSummaryWidgetsProps) {
  return (
    <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <div className="rounded-[14px] border border-border bg-card p-4">
        <p className="font-mono text-[10px] text-muted-foreground">
          Active Deals
        </p>
        <p className="mt-2 font-black text-2xl text-foreground">
          {widgets.activeDeals}
        </p>
      </div>
      <div className="rounded-[14px] border border-border bg-card p-4">
        <p className="font-mono text-[10px] text-muted-foreground">
          Revenue In Progress
        </p>
        <p className="mt-2 font-bold text-foreground text-lg">
          ${widgets.revenueInProgress.toLocaleString()}
        </p>
      </div>
      <div className="rounded-[14px] border border-border bg-card p-4">
        <p className="font-mono text-[10px] text-muted-foreground">
          Closing Soon
        </p>
        <p className="mt-2 font-black text-2xl text-foreground">
          {widgets.dealsClosingSoon}
        </p>
      </div>
      <div className="rounded-[14px] border border-border bg-card p-4">
        <p className="font-mono text-[10px] text-muted-foreground">Overdue</p>
        <p className="mt-2 font-black text-2xl text-foreground">
          {widgets.overdueDeals}
        </p>
      </div>
      <div className="rounded-[14px] border border-border bg-card p-4">
        <p className="font-mono text-[10px] text-muted-foreground">
          Highest Value
        </p>
        <p className="mt-2 truncate font-semibold text-[13px] text-foreground">
          {widgets.highestValueDeals[0]?.campaignName ?? "No active deals"}
        </p>
      </div>
    </div>
  )
}
