import { TradeDownIcon, TradeUpIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { Skeleton } from "./Skeleton"

export function KpiCard({
  icon,
  label,
  value,
  delta,
  deltaLabel,
  loading,
}: {
  icon: IconSvgElement
  label: string
  value: string
  delta: number
  deltaLabel: string
  loading: boolean
}) {
  const up = delta >= 0
  return (
    <div className="flex flex-col gap-[14px] rounded-[14px] border border-border bg-card px-[22px] py-5">
      {loading ? (
        <>
          <Skeleton h={14} w={100} />
          <Skeleton h={32} w={140} />
          <Skeleton h={12} w={80} />
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span className="font-medium text-muted-foreground text-xs">
              {label}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-muted">
              <HugeiconsIcon
                icon={icon}
                size={15}
                color="var(--muted-foreground)"
              />
            </div>
          </div>
          <div className="font-bold text-[30px] text-foreground leading-none tracking-[-0.04em]">
            {value}
          </div>
          <div className="flex items-center gap-[5px]">
            {up ? (
              <HugeiconsIcon icon={TradeUpIcon} size={12} color="#22c55e" />
            ) : (
              <HugeiconsIcon icon={TradeDownIcon} size={12} color="#E8402A" />
            )}
            <span
              className={`font-mono font-semibold text-xs ${up ? "text-[#22c55e]" : "text-[#E8402A]"}`}
            >
              {up ? "+" : ""}
              {delta}%
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">
              {deltaLabel}
            </span>
          </div>
        </>
      )}
    </div>
  )
}
