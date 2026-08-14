"use client"

import dynamic from "next/dynamic"
import { useMemo } from "react"
import { MONTHLY_DATA, SEED_DEALS } from "../sponsorship/data"
import { KpiSummary } from "../sponsorship/KpiSummary"
import {
  buildCategoryBreakdown,
  buildFunnelData,
  calculateInsightMetrics,
  calculatePipelineSummary,
  calculateRevenueTrendMetrics,
  getValueRankedDeals,
} from "../sponsorship/metrics"
import { DealsRankedTable } from "./DealsRankedTable"
import { InsightCards } from "./InsightCards"
import { PipelineFunnel } from "./PipelineFunnel"

const RevenueByCategory = dynamic(
  () => import("./RevenueByCategory").then((mod) => mod.RevenueByCategory),
  {
    ssr: false,
    loading: () => (
      <div className="h-[240px] rounded-2xl border border-border bg-card" />
    ),
  }
)

const RevenueTrend = dynamic(
  () => import("./RevenueTrend").then((mod) => mod.RevenueTrend),
  {
    ssr: false,
    loading: () => (
      <div className="h-[240px] rounded-2xl border border-border bg-card" />
    ),
  }
)

export function DashboardOverview() {
  const summary = useMemo(() => calculatePipelineSummary(SEED_DEALS), [])
  const insights = useMemo(() => calculateInsightMetrics(SEED_DEALS), [])
  const funnel = useMemo(() => buildFunnelData(SEED_DEALS), [])
  const categories = useMemo(() => buildCategoryBreakdown(SEED_DEALS), [])
  const rankedDeals = useMemo(() => getValueRankedDeals(SEED_DEALS), [])
  const revenueTrend = useMemo(
    () => calculateRevenueTrendMetrics(MONTHLY_DATA),
    []
  )

  return (
    <div className="w-full max-w-[1300px] px-9 py-7">
      <div className="mb-6">
        <h1 className="mb-1 font-extrabold text-2xl text-foreground tracking-[-0.04em]">
          Dashboard Overview
        </h1>
        <div className="text-[13px] text-muted-foreground">
          Executive snapshot of pipeline value, stage health, and revenue
          momentum
        </div>
      </div>

      <KpiSummary summary={summary} />

      <div className="flex flex-col gap-4">
        <InsightCards metrics={insights} />
        <div className="grid grid-cols-3 gap-[14px]">
          <PipelineFunnel data={funnel} />
          <RevenueByCategory data={categories} />
          <RevenueTrend data={MONTHLY_DATA} metrics={revenueTrend} />
        </div>
        <DealsRankedTable deals={rankedDeals} />
      </div>
    </div>
  )
}
