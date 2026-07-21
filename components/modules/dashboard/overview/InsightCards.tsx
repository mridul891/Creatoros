"use client";

import { Lightning, Target, Trophy, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import type { InsightMetrics } from "../sponsorship/metrics";
import { fmt } from "../sponsorship/shared";

interface InsightCardsProps {
  metrics: InsightMetrics;
}

export function InsightCards({ metrics }: InsightCardsProps) {
  const insights = [
    {
      icon: WarningCircle,
      color: "#E8402A",
      bgClass: "bg-[rgba(232,64,42,0.08)]",
      label: "Action needed",
      value: `${metrics.overdue} high-priority deals`,
      sub: "still in active stages",
    },
    {
      icon: Target,
      color: "#d97706",
      bgClass: "bg-[rgba(217,119,6,0.08)]",
      label: "Negotiation at risk",
      value: fmt(metrics.negotiationVal),
      sub: "pending closure this month",
    },
    {
      icon: Trophy,
      color: "#16a34a",
      bgClass: "bg-[rgba(22,163,74,0.08)]",
      label: "Top category",
      value: metrics.topCat,
      sub: "highest pipeline value",
    },
    {
      icon: Lightning,
      color: "#2563eb",
      bgClass: "bg-[rgba(37,99,235,0.08)]",
      label: "Close rate",
      value: `${metrics.signedPct}%`,
      sub: "leads converted to signed/paid",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-4 gap-[10px]">
      {insights.map((insight) => (
        <div
          key={insight.label}
          className="flex items-start gap-3 rounded-[13px] border border-border bg-card px-4 py-[14px]"
        >
          <div className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] ${insight.bgClass}`}>
            <insight.icon size={15} color={insight.color} />
          </div>
          <div className="min-w-0">
            <div className="mb-[3px] font-mono text-[9px] tracking-[0.04em] text-muted-foreground">
              {insight.label.toUpperCase()}
            </div>
            <div className="mb-[3px] text-[14px] font-extrabold leading-[1.1] tracking-[-0.03em] text-foreground">
              {insight.value}
            </div>
            <div className="text-[10px] leading-[1.3] text-muted-foreground">{insight.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
