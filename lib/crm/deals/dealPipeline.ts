import { DEAL_STAGES, type DealStage } from "@/enums/deal"
import type { DealListItem } from "@/types/deal"

export function groupDealsByStage(deals: DealListItem[]) {
  return DEAL_STAGES.reduce<Record<DealStage, DealListItem[]>>(
    (accumulator, stage) => {
      accumulator[stage] = deals.filter((deal) => deal.stage === stage)
      return accumulator
    },
    {} as Record<DealStage, DealListItem[]>,
  )
}
