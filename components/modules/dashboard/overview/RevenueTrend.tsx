"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { MonthlyRevenueDatum } from "../sponsorship/data";
import type { RevenueTrendMetrics } from "../sponsorship/metrics";
import { fmt } from "../sponsorship/shared";

interface RevenueTrendProps {
  data: MonthlyRevenueDatum[];
  metrics: RevenueTrendMetrics;
}

export function RevenueTrend({ data, metrics }: RevenueTrendProps) {
  return (
    <div className="rounded-2xl border border-border bg-card px-[22px] py-5">
      <div className="mb-[14px] flex items-start justify-between">
        <div>
          <div className="mb-[3px] text-[13px] font-bold tracking-[-0.02em] text-foreground">Monthly Revenue</div>
          <div className="text-[11px] text-muted-foreground">Paid deals YTD</div>
        </div>
        <div className="text-right">
          <div className="text-[18px] font-black tracking-[-0.04em] text-foreground">{fmt(metrics.ytd)}</div>
          <div className="font-mono text-[9px] font-bold text-[#16a34a]">YTD 2026</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={110}>
        <AreaChart data={data} margin={{ top: 4, right: 0, left: -30, bottom: 0 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E8402A" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#E8402A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 9, fontFamily: "'SF Mono', 'Menlo', monospace", fill: "var(--muted-foreground)" }}
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
      <div className="mt-[10px] flex gap-4 border-t border-border pt-[10px]">
        <div>
          <div className="mb-[2px] font-mono text-[9px] text-muted-foreground">AVG DEAL</div>
          <div className="text-[13px] font-extrabold tracking-[-0.03em] text-foreground">{fmt(metrics.avgDeal)}</div>
        </div>
        <div>
          <div className="mb-[2px] font-mono text-[9px] text-muted-foreground">BEST MONTH</div>
          <div className="text-[13px] font-extrabold tracking-[-0.03em] text-foreground">April</div>
        </div>
        <div>
          <div className="mb-[2px] font-mono text-[9px] text-muted-foreground">WIN RATE</div>
          <div className="text-[13px] font-extrabold tracking-[-0.03em] text-[#16a34a]">62%</div>
        </div>
      </div>
    </div>
  );
}
