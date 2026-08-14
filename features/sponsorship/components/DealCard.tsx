"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import type { Deal } from "@/features/sponsorship/types/sponsorship"
import {
  fmt,
  LOGO_ACCENT_CLASS,
  PRIORITY_DOT_CLASS,
  STAGE_ACTIVE_CLASS,
  STAGE_CFG,
  STAGES,
} from "./shared"

interface DealCardProps {
  deal: Deal
  isSelected: boolean
  onClick: () => void
  onAdvance: () => void
  onDragStart: (dealId: number) => void
  onDragEnd: () => void
}

export function DealCard({
  deal,
  isSelected,
  onClick,
  onAdvance,
  onDragStart,
  onDragEnd,
}: DealCardProps) {
  const nextStage = STAGES[STAGES.indexOf(deal.stage) + 1]
  const logoClass =
    LOGO_ACCENT_CLASS[deal.logoColor] ?? "bg-[#E8402A15] text-[#E8402A]"
  const stageAccent = STAGE_CFG[deal.stage]

  return (
    <div
      onClick={onClick}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move"
        e.dataTransfer.setData("text/plain", String(deal.id))
        onDragStart(deal.id)
      }}
      onDragEnd={onDragEnd}
      className={`group relative mb-2 cursor-pointer overflow-hidden rounded-[14px] border-[1.5px] bg-card px-[15px] py-[14px] transition-all duration-150 ${isSelected ? "border-[#E8402A] shadow-[0_0_0_3px_rgba(232,64,42,0.1)]" : "border-border shadow-[0_1px_4px_rgba(0,0,0,0.04)]"}`}
      onMouseEnter={(e) => {
        if (!isSelected)
          e.currentTarget.style.borderColor = "rgba(232,64,42,0.3)"
      }}
      onMouseLeave={(e) => {
        if (!isSelected)
          e.currentTarget.style.borderColor = "var(--muted-foreground)"
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-[2px] opacity-70"
        style={{ backgroundColor: stageAccent.color }}
      />
      <div className="mb-[9px] flex items-start justify-between">
        <div className="flex items-center gap-[9px]">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-extrabold font-mono text-[9px] ${logoClass}`}
          >
            {deal.logo}
          </div>
          <div>
            <div className="font-bold text-foreground text-xs leading-[1.2]">
              {deal.brand}
            </div>
            <div className="font-mono text-[10px] text-muted-foreground">
              {deal.category}
            </div>
          </div>
        </div>
        <div
          className={`mt-[3px] h-[6px] w-[6px] shrink-0 rounded-full ${PRIORITY_DOT_CLASS[deal.priority]}`}
        />
      </div>
      <div className="mb-2 flex items-center justify-between">
        <div>
          <div className="font-mono text-[8px] text-muted-foreground tracking-[0.08em]">
            EST. VALUE
          </div>
          <div className="font-bold text-[13px] text-muted-foreground tracking-[-0.02em]">
            {fmt(deal.value)}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[6px]">
          <span
            className={`inline-flex items-center gap-[4px] rounded-[99px] border px-[6px] py-[2px] font-bold font-mono text-[8px] ${STAGE_ACTIVE_CLASS[deal.stage]}`}
          >
            <HugeiconsIcon icon={stageAccent.icon} size={8} />
            {deal.stage}
          </span>
          <div className="font-mono text-[9px] text-muted-foreground">
            {deal.deadline === "Done" ? "✓ Done" : `Due ${deal.deadline}`}
          </div>
        </div>
        {nextStage && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAdvance()
            }}
            className="flex cursor-pointer items-center gap-[3px] rounded-[99px] border border-border bg-card px-[7px] py-[3px] font-mono text-[9px] text-muted-foreground transition-all duration-150"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#E8402A"
              e.currentTarget.style.color = "#E8402A"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--muted-foreground)"
              e.currentTarget.style.color = "var(--muted-foreground)"
            }}
          >
            → {nextStage}
          </button>
        )}
      </div>
    </div>
  )
}
