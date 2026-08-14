"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import type { FunnelDatum } from "@/features/sponsorship/components/metrics"
import {
  fmt,
  STAGE_BG22_CLASS,
  STAGE_CFG,
  STAGE_TEXT_CLASS,
} from "@/features/sponsorship/components/shared"

interface PipelineFunnelProps {
  data: FunnelDatum[]
}

export function PipelineFunnel({ data }: PipelineFunnelProps) {
  const maxCount = Math.max(...data.map((item) => item.count), 1)

  return (
    <div className="rounded-2xl border border-border bg-card px-[22px] py-5">
      <div className="mb-4">
        <div className="mb-[3px] font-bold text-[13px] text-foreground tracking-[-0.02em]">
          Pipeline Funnel
        </div>
        <div className="text-[11px] text-muted-foreground">
          Deal counts by stage
        </div>
      </div>
      <div className="flex flex-col gap-[6px]">
        {data.map((item, index) => {
          const pct = item.count / maxCount
          const barPct = Math.max(Math.round(pct * 100), 4)
          const prevCount = index > 0 ? data[index - 1].count : item.count
          const convRate =
            index === 0
              ? null
              : prevCount > 0
                ? Math.round((item.count / prevCount) * 100)
                : 0
          const stageCfg = STAGE_CFG[item.stage]

          return (
            <div key={item.stage}>
              {convRate !== null && (
                <div className="mb-[3px] flex items-center gap-[6px] pl-2">
                  <div className="h-[10px] w-px bg-muted" />
                  <span
                    className={`font-bold font-mono text-[9px] ${convRate >= 70 ? "text-[#16a34a]" : convRate >= 40 ? "text-[#d97706]" : "text-[#E8402A]"}`}
                  >
                    {convRate}% conversion
                  </span>
                </div>
              )}
              <div className="flex items-center gap-[10px]">
                <div className="flex w-[90px] shrink-0 items-center gap-[6px]">
                  <HugeiconsIcon
                    icon={stageCfg.icon}
                    size={11}
                    color={stageCfg.color}
                  />
                  <span
                    className={`font-mono font-semibold text-[10px] ${STAGE_TEXT_CLASS[item.stage]}`}
                  >
                    {item.stage}
                  </span>
                </div>
                <div className="h-[22px] flex-1 overflow-hidden rounded-[5px] bg-muted">
                  <div
                    className={`flex h-full items-center rounded-[5px] border-r pl-2 transition-[width] duration-400 ease-in-out ${STAGE_BG22_CLASS[item.stage]} ${barPct <= 5 ? "w-[5%]" : barPct <= 10 ? "w-[10%]" : barPct <= 15 ? "w-[15%]" : barPct <= 20 ? "w-[20%]" : barPct <= 25 ? "w-[25%]" : barPct <= 30 ? "w-[30%]" : barPct <= 35 ? "w-[35%]" : barPct <= 40 ? "w-[40%]" : barPct <= 45 ? "w-[45%]" : barPct <= 50 ? "w-[50%]" : barPct <= 55 ? "w-[55%]" : barPct <= 60 ? "w-[60%]" : barPct <= 65 ? "w-[65%]" : barPct <= 70 ? "w-[70%]" : barPct <= 75 ? "w-[75%]" : barPct <= 80 ? "w-[80%]" : barPct <= 85 ? "w-[85%]" : barPct <= 90 ? "w-[90%]" : barPct <= 95 ? "w-[95%]" : "w-full"}`}
                  >
                    <span
                      className={`whitespace-nowrap font-bold font-mono text-[9px] ${STAGE_TEXT_CLASS[item.stage]}`}
                    >
                      {item.count}
                    </span>
                  </div>
                </div>
                <div className="w-14 shrink-0 text-right font-bold font-mono text-[10px] text-muted-foreground">
                  {fmt(item.value)}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
