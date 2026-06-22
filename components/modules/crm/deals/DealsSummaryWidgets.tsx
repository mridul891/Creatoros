import type { DealListData } from "@/types/deal"

type DealsSummaryWidgetsProps = {
  widgets: DealListData["widgets"]
}

export function DealsSummaryWidgets({ widgets }: DealsSummaryWidgetsProps) {
  return (
    <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <div className="rounded-[14px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-4">
        <p className="font-mono text-[10px] text-[rgba(255,255,255,0.45)]">Active Deals</p>
        <p className="mt-2 text-2xl font-black text-white">{widgets.activeDeals}</p>
      </div>
      <div className="rounded-[14px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-4">
        <p className="font-mono text-[10px] text-[rgba(255,255,255,0.45)]">Revenue In Progress</p>
        <p className="mt-2 text-lg font-bold text-white">${widgets.revenueInProgress.toLocaleString()}</p>
      </div>
      <div className="rounded-[14px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-4">
        <p className="font-mono text-[10px] text-[rgba(255,255,255,0.45)]">Closing Soon</p>
        <p className="mt-2 text-2xl font-black text-white">{widgets.dealsClosingSoon}</p>
      </div>
      <div className="rounded-[14px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-4">
        <p className="font-mono text-[10px] text-[rgba(255,255,255,0.45)]">Overdue</p>
        <p className="mt-2 text-2xl font-black text-white">{widgets.overdueDeals}</p>
      </div>
      <div className="rounded-[14px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-4">
        <p className="font-mono text-[10px] text-[rgba(255,255,255,0.45)]">Highest Value</p>
        <p className="mt-2 truncate text-[13px] font-semibold text-white">
          {widgets.highestValueDeals[0]?.campaignName ?? "No active deals"}
        </p>
      </div>
    </div>
  )
}
