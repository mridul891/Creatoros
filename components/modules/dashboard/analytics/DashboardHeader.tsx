import { Bell, ArrowClockwise } from "@phosphor-icons/react/dist/ssr";
import { AnalyticsViewMode } from "@/enums/analytics";

import { PLATFORMS, ViewMode } from "./data";

const VIEW_MODE_OPTIONS: ViewMode[] = [
  AnalyticsViewMode.CONNECTED,
  AnalyticsViewMode.LOADING,
  AnalyticsViewMode.SYNC_FAILED,
  AnalyticsViewMode.EMPTY,
];

export function DashboardHeader({
  viewMode,
  onSetViewMode,
}: {
  viewMode: ViewMode;
  onSetViewMode: (mode: ViewMode) => void;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="mb-1 text-[22px] font-bold tracking-[-0.035em] text-white">
          Good afternoon, Maya 👋
        </h1>
        <div className="flex items-center gap-1.5 font-mono text-xs text-[rgba(255,255,255,0.4)]">
          <ArrowClockwise size={10} />
          Last synced 2h ago
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-[10px]">
        <div className="flex gap-[7px]">
          {PLATFORMS.map((platform) => (
            <div
              key={platform.id}
              className="flex items-center gap-1.5 rounded-full border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] px-[11px] py-[5px] text-xs font-medium text-[rgba(255,255,255,0.65)]"
            >
              <platform.icon size={12} color={platform.color} />
              {platform.label}
              <div
                className={`h-[5px] w-[5px] rounded-full ${platform.connected ? "bg-[#22c55e]" : "bg-[#444]"}`}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-[5px]">
          {VIEW_MODE_OPTIONS.map((mode) => (
            <button
              key={mode}
              onClick={() => onSetViewMode(mode)}
              className={`cursor-pointer rounded-[7px] border border-[rgba(255,255,255,0.07)] px-[10px] py-[5px] font-mono text-[10px] ${viewMode === mode ? "bg-[rgba(255,255,255,0.1)] text-white" : "bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.4)]"}`}
            >
              {mode}
            </button>
          ))}
        </div>

        <button className="flex cursor-pointer items-center gap-1.5 rounded-[9px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] px-[14px] py-[7px] text-[13px] font-medium text-white">
          <Bell size={13} />
          <span className="flex items-center gap-1">
            3 <span className="inline-block h-[5px] w-[5px] rounded-full bg-[#E8402A]" />
          </span>
        </button>
      </div>
    </div>
  );
}
