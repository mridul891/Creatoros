"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"

import { DEAL_STAGES, type DealStage } from "@/enums/deal"
import { groupDealsByStage } from "@/lib/crm/deals/dealPipeline"
import type { DealListItem } from "@/types/deal"
import { DealStageBadge } from "./DealStageBadge"

type DealKanbanBoardProps = {
  deals: DealListItem[]
  isMutating: boolean
  onMove: (dealId: string, nextStage: DealStage) => Promise<void>
}

export function DealKanbanBoard({ deals, isMutating, onMove }: DealKanbanBoardProps) {
  const [dragDealId, setDragDealId] = useState<string | null>(null)
  const [dragOverStage, setDragOverStage] = useState<DealStage | null>(null)

  const grouped = useMemo(() => {
    return groupDealsByStage(deals)
  }, [deals])

  async function handleDrop(stage: DealStage) {
    if (!dragDealId) {
      return
    }

    const moving = deals.find((deal) => deal.id === dragDealId)
    setDragDealId(null)
    setDragOverStage(null)

    if (!moving || moving.stage === stage) {
      return
    }

    await onMove(dragDealId, stage)
  }

  return (
    <div className="overflow-x-auto rounded-[18px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-3">
      <div className="grid min-w-[980px] grid-cols-[repeat(10,minmax(210px,1fr))] gap-3">
        {DEAL_STAGES.map((stage) => {
          const items = grouped[stage]
          return (
            <div
              key={stage}
              className={`rounded-[14px] border bg-[rgba(255,255,255,0.02)] p-2 transition ${
                dragOverStage === stage ? "border-[#E8402A]/60 ring-1 ring-[#E8402A]/40" : "border-[rgba(255,255,255,0.06)]"
              }`}
              onDragOver={(event) => {
                event.preventDefault()
                if (dragDealId) {
                  setDragOverStage(stage)
                }
              }}
              onDragLeave={() => {
                if (dragOverStage === stage) {
                  setDragOverStage(null)
                }
              }}
              onDrop={(event) => {
                event.preventDefault()
                void handleDrop(stage)
              }}
            >
              <div className="mb-2 flex items-center justify-between px-1">
                <DealStageBadge stage={stage} />
                <span className="font-mono text-[10px] text-[rgba(255,255,255,0.45)]">{items.length}</span>
              </div>

              <div className="space-y-2">
                {items.map((deal) => (
                  <div
                    key={deal.id}
                    draggable={!isMutating && deal.status === "Active"}
                    onDragStart={() => setDragDealId(deal.id)}
                    onDragEnd={() => {
                      setDragDealId(null)
                      setDragOverStage(null)
                    }}
                    className="rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[#101010] p-3"
                  >
                    <Link href={`/dashboard/deals/${deal.id}`} className="block">
                      <p className="text-[12px] font-semibold text-white">{deal.campaignName}</p>
                      <p className="mt-1 text-[11px] text-[rgba(255,255,255,0.58)]">{deal.brandName}</p>
                    </Link>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-[rgba(255,255,255,0.62)]">
                      <span>
                        {deal.currency} {deal.dealValue.toLocaleString()}
                      </span>
                      <span>{deal.priority}</span>
                    </div>
                    {deal.dueDate ? (
                      <p className="mt-1 text-[10px] text-[rgba(255,255,255,0.45)]">Due {deal.dueDate.toLocaleDateString()}</p>
                    ) : null}
                    <button
                      type="button"
                      disabled={isMutating || deal.status !== "Active"}
                      className="mt-2 flex cursor-pointer items-center gap-1 rounded-md border border-[rgba(255,255,255,0.09)] px-2 py-1 text-[10px] text-[rgba(255,255,255,0.62)]"
                      onClick={() => {
                        const currentIndex = DEAL_STAGES.indexOf(deal.stage)
                        const next = DEAL_STAGES[currentIndex + 1]
                        if (next) {
                          void onMove(deal.id, next)
                        }
                      }}
                    >
                      Advance <ArrowRight size={11} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
