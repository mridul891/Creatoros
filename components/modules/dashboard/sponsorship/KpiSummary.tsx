"use client";

import { CheckCircle, FilmSlate, InstagramLogo, Quotes } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react/dist/lib/types";
import { type PipelineSummary } from "./metrics";
import { ACCENT_KPI_CARD_CLASS, ACCENT_SOFT_BG_CLASS, ACCENT_TEXT_CLASS, fmt } from "./shared";

interface KpiSummaryProps {
  summary: PipelineSummary;
}

interface KpiCardConfig {
  label: string;
  value: string;
  sub: string;
  trend: string;
  icon: Icon;
  accent: string;
}

export function KpiSummary({ summary }: KpiSummaryProps) {
  const cards: KpiCardConfig[] = [
    {
      label: "Content Items",
      value: String(summary.totalDeals),
      sub: `${summary.plannedCount} planned`,
      icon: FilmSlate,
      accent: "#111111",
      trend: `Est. value ${fmt(summary.totalPipeline)}`,
    },
    {
      label: "In Production",
      value: String(summary.activeDeals),
      sub: `${summary.shootingCount} shooting now`,
      icon: InstagramLogo,
      accent: "#E8402A",
      trend: `${summary.highPriorityOpenCount} high priority`,
    },
    {
      label: "Pending Review",
      value: String(summary.pendingReviewCount),
      sub: "awaiting approval",
      icon: Quotes,
      accent: "#2563eb",
      trend: `Est. value ${fmt(summary.totalSigned)}`,
    },
    {
      label: "Published",
      value: String(summary.publishedCount),
      sub: "completed",
      icon: CheckCircle,
      accent: "#16a34a",
      trend: `Est. value ${fmt(summary.totalPaid)}`,
    },
  ];

  return (
    <div className="mb-5 grid grid-cols-4 gap-[14px]">
      {cards.map((kpi) => (
        <div
          key={kpi.label}
          className={`rounded-2xl border border-border bg-card px-5 py-[18px] ${ACCENT_KPI_CARD_CLASS[kpi.accent] ?? ""}`}
        >
          <div className="mb-[10px] flex items-start justify-between">
            <span className="text-[11px] font-medium text-muted-foreground">{kpi.label}</span>
            <div
              className={`flex h-[30px] w-[30px] items-center justify-center rounded-lg ${ACCENT_SOFT_BG_CLASS[kpi.accent] ?? "bg-muted"}`}
            >
              <kpi.icon size={14} color={kpi.accent} />
            </div>
          </div>
          <div className="mb-1 text-[26px] font-black leading-none tracking-[-0.04em] text-foreground">
            {kpi.value}
          </div>
          <div className="mb-[3px] font-mono text-[10px] text-muted-foreground">{kpi.sub}</div>
          <div className={`font-mono text-[9px] font-semibold ${ACCENT_TEXT_CLASS[kpi.accent] ?? "text-foreground"}`}>
            {kpi.trend}
          </div>
        </div>
      ))}
    </div>
  );
}
