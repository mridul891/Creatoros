"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"

import { updateDealStageAction } from "@/app/action/dealActions"
import { DEAL_STAGES, type DealStage } from "@/enums/deal"
import type { DealListItem } from "@/types/deal"

type UseDealPipelineOptions = {
  initialDeals: DealListItem[]
}

export function useDealPipeline({ initialDeals }: UseDealPipelineOptions) {
  const [deals, setDeals] = useState<DealListItem[]>(initialDeals)
  const [isMutating, setIsMutating] = useState(false)

  const byStage = useMemo(() => {
    return DEAL_STAGES.reduce<Record<DealStage, DealListItem[]>>(
      (accumulator, stage) => {
        accumulator[stage] = deals.filter((deal) => deal.stage === stage)
        return accumulator
      },
      {} as Record<DealStage, DealListItem[]>,
    )
  }, [deals])

  async function moveDeal(dealId: string, nextStage: DealStage) {
    const current = deals.find((deal) => deal.id === dealId)
    if (!current || current.stage === nextStage) {
      return
    }

    const snapshot = deals
    setDeals((previous) => previous.map((deal) => (deal.id === dealId ? { ...deal, stage: nextStage } : deal)))
    setIsMutating(true)

    const result = await updateDealStageAction(dealId, nextStage)
    setIsMutating(false)

    if (!result.success) {
      setDeals(snapshot)
      toast.error(result.message ?? "Could not move deal.")
      return
    }

    toast.success(result.message ?? "Deal stage updated.")
  }

  return {
    deals,
    byStage,
    isMutating,
    setDeals,
    moveDeal,
  }
}
