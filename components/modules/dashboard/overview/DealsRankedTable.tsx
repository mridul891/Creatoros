"use client"

import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { Deal } from "@/types/sponsorship"
import {
  fmt,
  LOGO_ACCENT_CLASS,
  PRIORITY_DOT_CLASS,
  STAGE_ACTIVE_CLASS,
  STAGE_CFG,
} from "../sponsorship/shared"

interface DealsRankedTableProps {
  deals: Deal[]
}

export function DealsRankedTable({ deals }: DealsRankedTableProps) {
  return (
    <div className="rounded-2xl border border-border bg-card px-[22px] py-5">
      <div className="mb-4 font-bold text-[13px] text-foreground tracking-[-0.02em]">
        All Deals — Value Ranked
      </div>
      <div className="flex flex-col">
        <div className="mb-1 grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-3 border-border border-b pb-[10px]">
          {["Brand", "Value", "Category", "Stage", "Priority"].map((header) => (
            <div
              key={header}
              className="font-bold font-mono text-[9px] text-muted-foreground tracking-[0.07em]"
            >
              {header.toUpperCase()}
            </div>
          ))}
        </div>
        {deals.map((deal, index) => {
          const stageConfig = STAGE_CFG[deal.stage]
          const logoClass =
            LOGO_ACCENT_CLASS[deal.logoColor] ?? "bg-[#E8402A15] text-[#E8402A]"

          return (
            <div
              key={deal.id}
              className={`grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-3 rounded-lg py-[10px] transition-colors duration-100 ${index < deals.length - 1 ? "border-border border-b" : ""}`}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--muted-foreground)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none"
              }}
            >
              <div className="flex items-center gap-[9px]">
                <div
                  className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md font-extrabold font-mono text-[8px] ${logoClass}`}
                >
                  {deal.logo}
                </div>
                <span className="font-semibold text-foreground text-xs">
                  {deal.brand}
                </span>
              </div>
              <div className="flex items-center font-extrabold text-foreground text-xs tracking-[-0.03em]">
                {fmt(deal.value)}
              </div>
              <div className="flex items-center font-mono text-[11px] text-muted-foreground">
                {deal.category}
              </div>
              <div className="flex items-center">
                <div
                  className={`inline-flex items-center gap-1 rounded-[99px] border px-2 py-[3px] ${STAGE_ACTIVE_CLASS[deal.stage]}`}
                >
                  <HugeiconsIcon
                    icon={stageConfig.icon}
                    size={9}
                    color={stageConfig.color}
                  />
                  <span className="font-bold font-mono text-[9px]">
                    {deal.stage}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-[6px]">
                <div
                  className={`h-[6px] w-[6px] rounded-full ${PRIORITY_DOT_CLASS[deal.priority]}`}
                />
                <span className="font-mono text-[11px] text-muted-foreground capitalize">
                  {deal.priority}
                </span>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={12}
                  color="var(--muted-foreground)"
                  className="ml-auto"
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
