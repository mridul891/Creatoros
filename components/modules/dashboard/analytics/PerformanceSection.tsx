import { CaretDown, SortAscending } from "@phosphor-icons/react/dist/ssr";
import { AnalyticsSortBy } from "@/enums/analytics";
import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartTooltip } from "./ChartTooltip";
import { ACCENT, BAR_DATA, DIM, MONO, RADAR_DATA, SortBy, formatMetricNumber } from "./data";
import { Skeleton } from "./Skeleton";

export function PerformanceSection({
  loading,
  sortBy,
  onToggleSort,
}: {
  loading: boolean;
  sortBy: SortBy;
  onToggleSort: () => void;
}) {
  const filteredBar = [...BAR_DATA].sort((a, b) =>
    sortBy === AnalyticsSortBy.VIEWS ? b.views - a.views : b.er - a.er,
  );

  return (
    <div className="mb-5 grid grid-cols-[1.4fr_1fr] gap-[14px]">
      <div className="rounded-[14px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] px-[26px] py-[22px]">
        <div className="mb-[18px] flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold tracking-[-0.02em] text-white">
              Views per Post
            </div>
            <div className="mt-0.5 font-mono text-xs text-[rgba(255,255,255,0.4)]">
              Content performance comparison
            </div>
          </div>
          <button
            type="button"
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.05)] px-[10px] py-[5px]"
            onClick={onToggleSort}
          >
            <SortAscending size={12} color={DIM} />
            <span className="font-mono text-[11px] text-[rgba(255,255,255,0.4)]">
              {sortBy === AnalyticsSortBy.VIEWS ? "Views" : "ER"}
            </span>
            <CaretDown size={10} color={DIM} />
          </button>
        </div>
        {loading ? (
          <Skeleton h={220} r={10} />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={filteredBar} barSize={12}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
                vertical={false}
              />
              <XAxis dataKey="title" tick={false} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const point = payload[0].payload;
                  return (
                    <div className="rounded-[9px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1a] px-[14px] py-[10px] font-mono text-xs shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
                      <div className="mb-1 font-semibold text-white">{point.title}</div>
                      <div className="text-[rgba(255,255,255,0.4)]">
                        Views:{" "}
                        <strong className="text-white">{formatMetricNumber(point.views)}</strong>
                      </div>
                      <div className="text-[rgba(255,255,255,0.4)]">
                        ER: <strong className="text-[#E8402A]">{point.er}%</strong>
                      </div>
                      <div className="mt-0.5 capitalize text-[rgba(255,255,255,0.4)]">
                        Type: {point.type}
                      </div>
                    </div>
                  );
                }}
              />
              <Bar
                dataKey="views"
                fill="rgba(255,255,255,0.15)"
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="rounded-[14px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] px-[26px] py-[22px]">
        <div className="mb-[14px]">
          <div className="text-sm font-semibold tracking-[-0.02em] text-white">
            Engagement Breakdown
          </div>
          <div className="mt-0.5 font-mono text-xs text-[rgba(255,255,255,0.4)]">
            Likes · Comments · Shares · Saves · CTR
          </div>
        </div>
        <div className="mb-2 flex gap-3">
          {[{ color: "#aaa", label: "Instagram" }, { color: ACCENT, label: "YouTube" }].map((legend) => (
            <div
              key={legend.label}
              className="flex items-center gap-[5px] font-mono text-[11px] text-[rgba(255,255,255,0.4)]"
            >
              <div
                className={`h-[9px] w-[9px] rounded-[3px] ${legend.color === ACCENT ? "bg-[#E8402A]" : "bg-[#aaa]"}`}
              />
              {legend.label}
            </div>
          ))}
        </div>
        {loading ? (
          <Skeleton h={220} r={10} />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis
                dataKey="axis"
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10, fontFamily: MONO }}
              />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Radar
                name="Instagram"
                dataKey="ig"
                stroke="#aaa"
                fill="#aaa"
                fillOpacity={0.08}
                strokeWidth={1.5}
              />
              <Radar
                name="YouTube"
                dataKey="yt"
                stroke={ACCENT}
                fill={ACCENT}
                fillOpacity={0.08}
                strokeWidth={1.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
