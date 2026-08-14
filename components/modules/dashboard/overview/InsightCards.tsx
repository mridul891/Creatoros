"use client"

import {
  AlertCircleIcon,
  ChampionIcon,
  FlashIcon,
  Target01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { InsightMetrics } from "../sponsorship/metrics"
import { fmt } from "../sponsorship/shared"

interface InsightCardsProps {
  metrics: InsightMetrics
}

export function InsightCards({ metrics }: InsightCardsProps) {
  const insights = [
    {
      icon: AlertCircleIcon,
      color: "#E8402A",
      bgClass: "bg-[rgba(232,64,42,0.08)]",
      label: "Action needed",
      value: `${metrics.overdue} high-priority deals`,
      sub: "still in active stages",
    },
    {
      icon: Target01Icon,
      color: "#d97706",
      bgClass: "bg-[rgba(217,119,6,0.08)]",
      label: "Negotiation at risk",
      value: fmt(metrics.negotiationVal),
      sub: "pending closure this month",
    },
    {
      icon: ChampionIcon,
      color: "#16a34a",
      bgClass: "bg-[rgba(22,163,74,0.08)]",
      label: "Top category",
      value: metrics.topCat,
      sub: "highest pipeline value",
    },
    {
      icon: FlashIcon,
      color: "#2563eb",
      bgClass: "bg-[rgba(37,99,235,0.08)]",
      label: "Close rate",
      value: `${metrics.signedPct}%`,
      sub: "leads converted to signed/paid",
    },
  ]

  return (
    <div className="mb-6 grid grid-cols-4 gap-[10px]">
      {insights.map((insight) => (
        <div
          key={insight.label}
          className="flex items-start gap-3 rounded-[13px] border border-border bg-card px-4 py-[14px]"
        >
          <div
            className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] ${insight.bgClass}`}
          >
            <HugeiconsIcon
              icon={insight.icon}
              size={15}
              color={insight.color}
            />
          </div>
          <div className="min-w-0">
            <div className="mb-[3px] font-mono text-[9px] text-muted-foreground tracking-[0.04em]">
              {insight.label.toUpperCase()}
            </div>
            <div className="mb-[3px] font-extrabold text-[14px] text-foreground leading-[1.1] tracking-[-0.03em]">
              {insight.value}
            </div>
            <div className="text-[10px] text-muted-foreground leading-[1.3]">
              {insight.sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
