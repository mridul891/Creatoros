"use client";

import { useState } from "react";
import { AlertCircle, Eye, Heart, TrendingUp, Users, X } from "lucide-react";
import {
  AnalyticsRange,
  AnalyticsSortBy,
  AnalyticsViewMode,
} from "@/enums/analytics";
import { PlatformFilter as PlatformFilterEnum } from "@/enums/post";
import { AnalyticsFiltersState, AnalyticsUiState } from "@/types/analytics";

import { DashboardHeader } from "./analytics/DashboardHeader";
import { EmptyState } from "./analytics/EmptyState";
import { GrowthSection } from "./analytics/GrowthSection";
import { InsightsSection } from "./analytics/InsightsSection";
import { KpiCard } from "./analytics/KpiCard";
import { PerformanceSection } from "./analytics/PerformanceSection";
import { RecentContentSection } from "./analytics/RecentContentSection";
import { ACCENT, AI_INSIGHTS, buildChartData, PlatformFilter, Range, SortBy, ViewMode } from "./analytics/data";

// ── Main dashboard ───────────────────────────────────────────────────────────
export function AnalyticsDashboard() {
  const [filters, setFilters] = useState<AnalyticsFiltersState>({
    range: AnalyticsRange.THIRTY_DAYS as Range,
    platform: PlatformFilterEnum.ALL as PlatformFilter,
    sortBy: AnalyticsSortBy.VIEWS as SortBy,
  });
  const [uiState, setUiState] = useState<AnalyticsUiState>({
    viewMode: AnalyticsViewMode.CONNECTED as ViewMode,
    regeneratingInsightId: null,
  });
  const insights = AI_INSIGHTS;

  const chartData = buildChartData(filters.range);
  const loading = uiState.viewMode === AnalyticsViewMode.LOADING;

  function handleRegenerate(id: number) {
    setUiState((prev) => ({ ...prev, regeneratingInsightId: id }));
    setTimeout(
      () => setUiState((prev) => ({ ...prev, regeneratingInsightId: null })),
      1200,
    );
  }

  return (
    <div className="[font-family:'SF_Pro_Display',-apple-system,BlinkMacSystemFont,system-ui,sans-serif]">
      {uiState.viewMode === AnalyticsViewMode.SYNC_FAILED && (
        <div className="flex items-center gap-[10px] border-b border-b-[rgba(232,64,42,0.18)] bg-[rgba(232,64,42,0.08)] px-8 py-[10px]">
          <AlertCircle size={13} color={ACCENT} />
          <span className="text-[13px] font-medium text-[#E8402A]">
            Couldn&apos;t sync data — showing last good snapshot from 6h ago.
          </span>
          <button className="ml-2 cursor-pointer rounded-[7px] border border-[rgba(232,64,42,0.3)] bg-transparent px-[10px] py-[3px] text-xs text-[#E8402A]">
            Retry
          </button>
          <button
            onClick={() =>
              setUiState((prev) => ({
                ...prev,
                viewMode: AnalyticsViewMode.CONNECTED as ViewMode,
              }))
            }
            className="ml-auto cursor-pointer border-none bg-transparent text-[#E8402A]"
          >
            <X size={13} />
          </button>
        </div>
      )}

      <div className="w-full max-w-[1280px] px-8 py-7">
        <DashboardHeader
          viewMode={uiState.viewMode}
          onSetViewMode={(nextMode) =>
            setUiState((prev) => ({ ...prev, viewMode: nextMode }))
          }
        />

        {uiState.viewMode === AnalyticsViewMode.EMPTY ? (
          <EmptyState />
        ) : (
          <>
            <div className="mb-5 grid grid-cols-4 gap-3">
              <KpiCard
                icon={Eye}
                label="Total Views"
                value={loading ? "—" : "14.2M"}
                delta={23}
                deltaLabel="vs last period"
                loading={loading}
              />
              <KpiCard
                icon={Users}
                label="Total Followers"
                value={loading ? "—" : "890K"}
                delta={4.8}
                deltaLabel="vs last period"
                loading={loading}
              />
              <KpiCard
                icon={Heart}
                label="Avg Engagement"
                value={loading ? "—" : "6.4%"}
                delta={1.2}
                deltaLabel="vs last period"
                loading={loading}
              />
              <KpiCard
                icon={TrendingUp}
                label="Follower Growth"
                value={loading ? "—" : "+12.4K"}
                delta={-2.1}
                deltaLabel="vs last period"
                loading={loading}
              />
            </div>

            <GrowthSection
              loading={loading}
              range={filters.range}
              chartData={chartData}
              onChangeRange={(range) =>
                setFilters((prev) => ({ ...prev, range }))
              }
            />

            <PerformanceSection
              loading={loading}
              sortBy={filters.sortBy}
              onToggleSort={() =>
                setFilters((prev) => ({
                  ...prev,
                  sortBy:
                    prev.sortBy === AnalyticsSortBy.VIEWS
                      ? (AnalyticsSortBy.ENGAGEMENT_RATE as SortBy)
                      : (AnalyticsSortBy.VIEWS as SortBy),
                }))
              }
            />

            <InsightsSection
              insights={insights}
              regenerating={uiState.regeneratingInsightId}
              onRegenerate={handleRegenerate}
            />

            <RecentContentSection
              platform={filters.platform}
              onChangePlatform={(platform) =>
                setFilters((prev) => ({ ...prev, platform }))
              }
            />
          </>
        )}
      </div>
    </div>
  );
}
