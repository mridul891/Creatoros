import {
  Calendar03Icon,
  DollarCircleIcon,
  File02Icon,
  UserCircle02Icon,
} from "@hugeicons/core-free-icons"

import { HugeiconsIcon } from "@hugeicons/react"
import { Card } from "@/components/ui/card"
import type { DealDetail } from "@/features/deals/types/deal"

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
        <p className="font-mono text-[10px] text-muted-foreground tracking-wide">
          Deal Value
        </p>
        <p className="mt-2 flex items-center gap-1 font-bold text-[18px] text-foreground">
          <HugeiconsIcon icon={DollarCircleIcon} size={15} />
          {deal.currency} {formatDealValue(deal.dealValue)}
        </p>
      </Card>
      <Card className="rounded-[14px] border-border bg-muted p-4">
        <p className="font-mono text-[10px] text-muted-foreground tracking-wide">
          Primary Contact
        </p>
        <p className="mt-2 flex items-center gap-1 font-semibold text-[14px] text-foreground">
          <HugeiconsIcon icon={UserCircle02Icon} size={14} />
          {deal.contactName ?? "No contact linked"}
        </p>
      </Card>
      <Card className="rounded-[14px] border-border bg-muted p-4">
        <p className="font-mono text-[10px] text-muted-foreground tracking-wide">
          Timeline
        </p>
        <p className="mt-2 flex items-center gap-1 text-[13px] text-muted-foreground">
          <HugeiconsIcon icon={Calendar03Icon} size={14} />
          {formatDate(deal.startDate)} - {formatDate(deal.dueDate)}
        </p>
      </Card>
      <Card className="rounded-[14px] border-border bg-muted p-4">
        <p className="font-mono text-[10px] text-muted-foreground tracking-wide">
          Payment Terms
        </p>
        <p className="mt-2 flex items-start gap-1 text-[13px] text-muted-foreground">
          <HugeiconsIcon icon={File02Icon} size={14} className="mt-0.5" />
          <span>{deal.paymentTerms ?? "Not specified"}</span>
        </p>
      </Card>
    </div>
  )
}
