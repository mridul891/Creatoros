import { Card } from "@/components/ui/card"
import type { DealDetail } from "@/features/deals/types/deal"

type DealOverviewSectionProps = {
  deal: DealDetail
}

export function DealOverviewSection({ deal }: DealOverviewSectionProps) {
  return (
    <Card className="rounded-[20px] border-border bg-card p-6">
      <h2 className="font-bold text-foreground text-lg">Workspace Overview</h2>
      <p className="mt-3 text-[13px] text-muted-foreground">
        {deal.campaignDescription ??
          "No campaign description has been added yet."}
      </p>
      <p className="mt-4 text-[13px] text-muted-foreground">
        <span className="font-semibold text-foreground">Deliverables:</span>{" "}
        {deal.deliverablesSummary ?? "No deliverables summary yet."}
      </p>
      <p className="mt-3 text-[13px] text-muted-foreground">
        <span className="font-semibold text-foreground">Notes:</span>{" "}
        {deal.notes ?? "No notes yet."}
      </p>
    </Card>
  )
}
