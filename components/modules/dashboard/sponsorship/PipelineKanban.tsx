"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import type { Deal } from "@/types/sponsorship"
import { DealCard } from "./DealCard"
import { DealPanel } from "./DealPanel"
import {
  fmt,
  STAGE_ACTIVE_CLASS,
  STAGE_CFG,
  STAGE_COLUMN_SURFACE_CLASS,
  STAGE_HEADER_GLOW_CLASS,
  STAGE_TEXT_CLASS,
  STAGES,
  type Stage,
} from "./shared"

interface PipelineKanbanProps {
  deals: Deal[]
  selectedId: number | null
  selectedDeal: Deal | null
  dragOverStage: Stage | null
  onSelectDeal: (dealId: number) => void
  onAdvance: (deal: Deal) => void
  onDelete: (id: number) => void
  onEdit: (deal: Deal) => void
  onStageChange: (id: number, stage: Stage) => void
  onAddToStage: (stage: Stage) => void
  onDropToStage: (stage: Stage) => void
  onDragOverStage: (stage: Stage) => void
  onDragLeaveStage: (stage: Stage) => void
  onDragStart: (dealId: number) => void
  onDragEnd: () => void
  onClosePanel: () => void
}

export function PipelineKanban({
  deals,
  selectedId,
  selectedDeal,
  dragOverStage,
  onSelectDeal,
  onAdvance,
  onDelete,
  onEdit,
  onStageChange,
  onAddToStage,
  onDropToStage,
  onDragOverStage,
  onDragLeaveStage,
  onDragStart,
  onDragEnd,
  onClosePanel,
}: PipelineKanbanProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-1 overflow-x-auto">
        <div className="grid grid-cols-[repeat(5,minmax(185px,1fr))] gap-[10px]">
          {STAGES.map((stage) => {
            const stageConfig = STAGE_CFG[stage]
            const stageDeals = deals.filter((deal) => deal.stage === stage)
            const stageValue = stageDeals.reduce(
              (sum, deal) => sum + deal.value,
              0
            )

            return (
              <div
                key={stage}
                onDragOver={(e) => {
                  e.preventDefault()
                  e.dataTransfer.dropEffect = "move"
                  onDragOverStage(stage)
                }}
                onDragLeave={() => onDragLeaveStage(stage)}
                onDrop={(e) => {
                  e.preventDefault()
                  onDropToStage(stage)
                }}
                className={`rounded-[14px] border px-[6px] pt-[6px] pb-[7px] transition-colors duration-150 ${STAGE_COLUMN_SURFACE_CLASS[stage]} ${dragOverStage === stage ? "ring-1 ring-[#E8402A]/50" : ""}`}
              >
                <div
                  className={`relative mb-[9px] rounded-xl border border-border bg-card px-[13px] py-[10px] before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:rounded-t-xl ${STAGE_HEADER_GLOW_CLASS[stage]}`}
                >
                  <div className="mb-[3px] flex items-center justify-between">
                    <div className="flex items-center gap-[5px]">
                      <HugeiconsIcon
                        icon={stageConfig.icon}
                        size={11}
                        color={stageConfig.color}
                      />
                      <span
                        className={`font-bold font-mono text-[10px] ${STAGE_TEXT_CLASS[stage]}`}
                      >
                        {stage.toUpperCase()}
                      </span>
                    </div>
                    <div
                      className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border font-extrabold font-mono text-[9px] ${STAGE_ACTIVE_CLASS[stage]}`}
                    >
                      {stageDeals.length}
                    </div>
                  </div>
                  <div className="font-mono text-[9px] text-muted-foreground">
                    Est. value {fmt(stageValue)}
                  </div>
                </div>
                {stageDeals.map((deal) => (
                  <div key={deal.id}>
                    <DealCard
                      deal={deal}
                      isSelected={selectedId === deal.id}
                      onClick={() => onSelectDeal(deal.id)}
                      onAdvance={() => onAdvance(deal)}
                      onDragStart={onDragStart}
                      onDragEnd={onDragEnd}
                    />
                  </div>
                ))}
                <button
                  onClick={() => onAddToStage(stage)}
                  className="flex w-full cursor-pointer items-center justify-center gap-[5px] rounded-[10px] border border-border border-dashed bg-transparent p-2 text-[10px] text-muted-foreground transition-colors duration-150"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(232,64,42,0.4)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "var(--muted-foreground)"
                  }}
                >
                  <span className="text-[11px]">+</span> Add
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {selectedDeal && (
        <DealPanel
          deal={selectedDeal}
          onClose={onClosePanel}
          onEdit={() => onEdit(selectedDeal)}
          onDelete={onDelete}
          onStageChange={onStageChange}
        />
      )}
    </div>
  )
}
