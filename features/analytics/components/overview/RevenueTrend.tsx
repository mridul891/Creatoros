"use client"

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { MonthlyRevenueDatum } from "@/features/sponsorship/components/data"
import type { RevenueTrendMetrics } from "@/features/sponsorship/components/metrics"
import { fmt } from "@/features/sponsorship/components/shared"

interface RevenueTrendProps {
  data: MonthlyRevenueDatum[]
  metrics: RevenueTrendMetrics
}

export function RevenueTrend({ data, metrics }: RevenueTrendProps) {
  return (
    <div className="rounded-2xl border border-border bg-card px-[22px] py-5">
      <div className="mb-[14px] flex items-start justify-between">
        <div>
          <div className="mb-[3px] font-bold text-[13px] text-foreground tracking-[-0.02em]">
            Monthly Revenue
          </div>
          <div className="text-[11px] text-muted-foreground">
            Paid deals YTD
          </div>
        </div>
        <div className="text-right">
          <div className="font-black text-[18px] text-foreground tracking-[-0.04em]">
            {fmt(metrics.ytd)}
          </div>
          <div className="font-bold font-mono text-[#16a34a] text-[9px]">
            YTD 2026
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={110}>
        <AreaChart
          data={data}
          margin={{ top: 4, right: 0, left: -30, bottom: 0 }}
        >
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E8402A" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#E8402A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            tick={{
              fontSize: 9,
              fontFamily: "'SF Mono', 'Menlo', monospace",
              fill: "var(--muted-foreground)",
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 9 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => (v === 0 ? "" : `$${(v / 1000).toFixed(0)}k`)}
          />
          <Tooltip
            formatter={(value) => [fmt(Number(value ?? 0)), "Revenue"]}
            contentStyle={{
              fontSize: 11,
              fontFamily: "var(--font-sans)",
              borderRadius: 8,
              border: "1px solid var(--muted-foreground)",
              background: "var(--card)",
              color: "var(--muted-foreground)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#E8402A"
            strokeWidth={2}
            fill="url(#revGrad)"
            dot={{ fill: "#E8402A", r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#E8402A" }}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="mt-[10px] flex gap-4 border-border border-t pt-[10px]">
        <div>
          <div className="mb-[2px] font-mono text-[9px] text-muted-foreground">
            AVG DEAL
          </div>
          <div className="font-extrabold text-[13px] text-foreground tracking-[-0.03em]">
            {fmt(metrics.avgDeal)}
          </div>
        </div>
        <div>
          <div className="mb-[2px] font-mono text-[9px] text-muted-foreground">
            BEST MONTH
          </div>
          <div className="font-extrabold text-[13px] text-foreground tracking-[-0.03em]">
            April
          </div>
        </div>
        <div>
          <div className="mb-[2px] font-mono text-[9px] text-muted-foreground">
            WIN RATE
          </div>
          <div className="font-extrabold text-[#16a34a] text-[13px] tracking-[-0.03em]">
            62%
          </div>
        </div>
      </div>
    </div>
  )
}
