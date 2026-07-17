import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AnalyticsRange } from "@/enums/analytics";

import { ChartTooltip } from "./ChartTooltip";
import { ACCENT, MONO, type Range } from "./data";
import { Skeleton } from "./Skeleton";

const RANGE_OPTIONS: Range[] = [
  AnalyticsRange.SEVEN_DAYS as Range,
  AnalyticsRange.THIRTY_DAYS as Range,
  AnalyticsRange.NINETY_DAYS as Range,
];

type GrowthPoint = {
  label: string;
  followers: number;
  views: number;
};

export function GrowthSection({
  loading,
  range,
  chartData,
  onChangeRange,
}: {
  loading: boolean;
  range: Range;
  chartData: GrowthPoint[];
  onChangeRange: (range: Range) => void;
}) {
  return (
    <div className="mb-4 rounded-[14px] border border-border bg-card px-[26px] py-[22px]">
      <div className="mb-[22px] flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold tracking-[-0.02em] text-foreground">
            Audience Growth
          </div>
          <div className="mt-0.5 font-mono text-xs text-muted-foreground">
            Followers & views over time
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-[14px]">
            {[{ color: "#aaa", label: "Followers" }, { color: ACCENT, label: "Views" }].map((legend) => (
              <div
                key={legend.label}
                className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground"
              >
                <div
                  className={`h-0.5 w-5 rounded-[2px] ${legend.color === ACCENT ? "bg-[#E8402A]" : "bg-[#aaa]"}`}
                />
                {legend.label}
              </div>
            ))}
          </div>
          <div className="flex rounded-[9px] border border-border bg-muted p-[3px]">
            {RANGE_OPTIONS.map((itemRange) => (
              <button
                key={itemRange}
                onClick={() => onChangeRange(itemRange)}
                className={`cursor-pointer rounded-md border-none px-[13px] py-[5px] font-mono text-[11px] transition-all duration-150 ${range === itemRange ? "bg-muted font-semibold text-foreground" : "bg-transparent font-normal text-muted-foreground"}`}
              >
                {itemRange}
              </button>
            ))}
          </div>
        </div>
      </div>
      {loading ? (
        <div className="h-[240px]">
          <Skeleton h={240} r={10} />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--muted-foreground)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: MONO }}
              axisLine={false}
              tickLine={false}
              interval={range === AnalyticsRange.SEVEN_DAYS ? 0 : range === AnalyticsRange.THIRTY_DAYS ? 4 : 14}
            />
            <YAxis hide />
            <Tooltip content={<ChartTooltip />} />
            <Line
              type="monotone"
              dataKey="followers"
              name="Followers"
              stroke="#aaa"
              strokeWidth={1.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="views"
              name="Views"
              stroke={ACCENT}
              strokeWidth={1.5}
              dot={false}
              strokeOpacity={0.9}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
