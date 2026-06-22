import { CalendarClock, DollarSign, FileText, UserRound } from "lucide-react"

import { Card } from "@/components/ui/card"
import type { DealDetail } from "@/types/deal"

type DealDetailInfoCardsProps = {
  deal: DealDetail
}

function formatDate(value: Date | null) {
  return value ? value.toLocaleDateString() : "—"
}

export function DealDetailInfoCards({ deal }: DealDetailInfoCardsProps) {
  return (
    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="rounded-[14px] border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] p-4">
        <p className="font-mono text-[10px] tracking-wide text-[rgba(255,255,255,0.45)]">Deal Value</p>
        <p className="mt-2 flex items-center gap-1 text-[18px] font-bold text-white">
          <DollarSign size={15} />
          {deal.currency} {deal.dealValue.toLocaleString()}
        </p>
      </Card>
      <Card className="rounded-[14px] border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] p-4">
        <p className="font-mono text-[10px] tracking-wide text-[rgba(255,255,255,0.45)]">Primary Contact</p>
        <p className="mt-2 flex items-center gap-1 text-[14px] font-semibold text-white">
          <UserRound size={14} />
          {deal.contactName ?? "No contact linked"}
        </p>
      </Card>
      <Card className="rounded-[14px] border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] p-4">
        <p className="font-mono text-[10px] tracking-wide text-[rgba(255,255,255,0.45)]">Timeline</p>
        <p className="mt-2 flex items-center gap-1 text-[13px] text-[rgba(255,255,255,0.78)]">
          <CalendarClock size={14} />
          {formatDate(deal.startDate)} - {formatDate(deal.dueDate)}
        </p>
      </Card>
      <Card className="rounded-[14px] border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] p-4">
        <p className="font-mono text-[10px] tracking-wide text-[rgba(255,255,255,0.45)]">Payment Terms</p>
        <p className="mt-2 flex items-start gap-1 text-[13px] text-[rgba(255,255,255,0.78)]">
          <FileText size={14} className="mt-0.5" />
          <span>{deal.paymentTerms ?? "Not specified"}</span>
        </p>
      </Card>
    </div>
  )
}
