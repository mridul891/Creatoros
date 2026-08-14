"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"

import { updateDealStageAction } from "@/features/deals/actions/dealActions"
import type { DealStage } from "@/features/deals/enums/deal"
import type { DealListItem } from "@/features/deals/types/deal"

type UseDealPipelineOptions = {
  initialDeals: DealListItem[]
  onMoveSuccess?: () => void
}

export function useDealPipeline({
  initialDeals,
  onMoveSuccess,
}: UseDealPipelineOptions) {
  const [optimisticStages, setOptimisticStages] = useState<
    Record<string, DealStage>
  >({})
  const [isMutating, setIsMutating] = useState(false)

  const deals = useMemo(
    () =>
      initialDeals.map((deal) => {
        const optimisticStage = optimisticStages[deal.id]
        return optimisticStage ? { ...deal, stage: optimisticStage } : deal
      }),
    [initialDeals, optimisticStages]
  )

  async function moveDeal(dealId: string, nextStage: DealStage) {
    const current = deals.find((deal) => deal.id === dealId)
    if (!current || current.stage === nextStage) {
      return
    }
    if (current.status !== "Active") {
      toast.error("Archived deals cannot change stage.")
      return
    }

    setOptimisticStages((previous) => ({ ...previous, [dealId]: nextStage }))
    setIsMutating(true)

    const result = await updateDealStageAction(dealId, nextStage)
    setIsMutating(false)

    if (!result.success) {
      setOptimisticStages((previous) => {
        const next = { ...previous }
        delete next[dealId]
        return next
      })
      toast.error(result.message ?? "Could not move deal.")
      return
    }

    setOptimisticStages((previous) => {
      const next = { ...previous }
      delete next[dealId]
      return next
    })
    toast.success(result.message ?? "Deal stage updated.")
    onMoveSuccess?.()
  }

  return {
    deals,
    isMutating,
    moveDeal,
  }
}
