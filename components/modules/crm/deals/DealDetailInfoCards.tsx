import { Calendar, CurrencyDollar, FileText, UserCircle } from "@phosphor-icons/react/dist/ssr"

import { Card } from "@/components/ui/card"
import type { DealDetail } from "@/types/deal"

type DealDetailInfoCardsProps = {
  deal: DealDetail
}

const DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
})

const VALUE_FORMATTER = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatDate(value: Date | null) {
  return value ? DATE_FORMATTER.format(value) : "—"
}

function formatDealValue(value: number) {
  return VALUE_FORMATTER.format(value)
}

export function DealDetailInfoCards({ deal }: DealDetailInfoCardsProps) {
  return (
    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="rounded-[14px] border-border bg-muted p-4">
        <p className="font-mono text-[10px] tracking-wide text-muted-foreground">Deal Value</p>
        <p className="mt-2 flex items-center gap-1 text-[18px] font-bold text-foreground">
          <CurrencyDollar size={15} />
          {deal.currency} {formatDealValue(deal.dealValue)}
        </p>
      </Card>
      <Card className="rounded-[14px] border-border bg-muted p-4">
        <p className="font-mono text-[10px] tracking-wide text-muted-foreground">Primary Contact</p>
        <p className="mt-2 flex items-center gap-1 text-[14px] font-semibold text-foreground">
          <UserCircle size={14} />
          {deal.contactName ?? "No contact linked"}
        </p>
      </Card>
      <Card className="rounded-[14px] border-border bg-muted p-4">
        <p className="font-mono text-[10px] tracking-wide text-muted-foreground">Timeline</p>
        <p className="mt-2 flex items-center gap-1 text-[13px] text-muted-foreground">
          <Calendar size={14} />
          {formatDate(deal.startDate)} - {formatDate(deal.dueDate)}
        </p>
      </Card>
      <Card className="rounded-[14px] border-border bg-muted p-4">
        <p className="font-mono text-[10px] tracking-wide text-muted-foreground">Payment Terms</p>
        <p className="mt-2 flex items-start gap-1 text-[13px] text-muted-foreground">
          <FileText size={14} className="mt-0.5" />
          <span>{deal.paymentTerms ?? "Not specified"}</span>
        </p>
      </Card>
    </div>
  )
}
