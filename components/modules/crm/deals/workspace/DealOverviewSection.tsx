import { Card } from "@/components/ui/card"
import type { DealDetail } from "@/types/deal"
import { DealTemplateQuickApply } from "./DealTemplateQuickApply"

type DealOverviewSectionProps = {
  deal: DealDetail
}

export function DealOverviewSection({ deal }: DealOverviewSectionProps) {
  return (
    <Card className="rounded-[20px] border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-6">
      <h2 className="text-lg font-bold text-white">Workspace Overview</h2>
      <p className="mt-3 text-[13px] text-[rgba(255,255,255,0.7)]">
        {deal.campaignDescription ?? "No campaign description has been added yet."}
      </p>
      <p className="mt-4 text-[13px] text-[rgba(255,255,255,0.65)]">
        <span className="font-semibold text-white">Deliverables:</span> {deal.deliverablesSummary ?? "No deliverables summary yet."}
      </p>
      <p className="mt-3 text-[13px] text-[rgba(255,255,255,0.65)]">
        <span className="font-semibold text-white">Notes:</span> {deal.notes ?? "No notes yet."}
      </p>
      <DealTemplateQuickApply dealId={deal.id} />
    </Card>
  )
}
