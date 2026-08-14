import { BellIcon, RotateClockwiseIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnalyticsViewMode } from "@/features/analytics/enums/analytics"

import { PLATFORMS, type ViewMode } from "./data"

const VIEW_MODE_OPTIONS: ViewMode[] = [
  AnalyticsViewMode.CONNECTED,
  AnalyticsViewMode.LOADING,
  AnalyticsViewMode.SYNC_FAILED,
  AnalyticsViewMode.EMPTY,
]

export function DashboardHeader({
  viewMode,
  onSetViewMode,
}: {
  viewMode: ViewMode
  onSetViewMode: (mode: ViewMode) => void
}) {
  return (
    <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="mb-1 font-bold text-[22px] text-foreground tracking-[-0.035em]">
          Good afternoon, Maya 👋
        </h1>
        <div className="flex items-center gap-1.5 font-mono text-muted-foreground text-xs">
          <HugeiconsIcon icon={RotateClockwiseIcon} size={10} />
          Last synced 2h ago
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-[10px]">
        <div className="flex gap-[7px]">
          {PLATFORMS.map((platform) => (
            <div
              key={platform.id}
              className="flex items-center gap-1.5 rounded-full border border-border bg-card px-[11px] py-[5px] font-medium text-muted-foreground text-xs"
            >
              <HugeiconsIcon
                icon={platform.icon}
                size={12}
                color={platform.color}
              />
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
              className={`cursor-pointer rounded-[7px] border border-border px-[10px] py-[5px] font-mono text-[10px] ${viewMode === mode ? "bg-muted text-foreground" : "bg-muted text-muted-foreground"}`}
            >
              {mode}
            </button>
          ))}
        </div>

        <button className="flex cursor-pointer items-center gap-1.5 rounded-[9px] border border-border bg-card px-[14px] py-[7px] font-medium text-[13px] text-foreground">
          <HugeiconsIcon icon={BellIcon} size={13} />
          <span className="flex items-center gap-1">
            3{" "}
            <span className="inline-block h-[5px] w-[5px] rounded-full bg-[#E8402A]" />
          </span>
        </button>
      </div>
    </div>
  )
}
