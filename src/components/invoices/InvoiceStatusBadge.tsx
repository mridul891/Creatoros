import { Badge } from "@/components/ui/badge"
import type { InvoiceStatusValue } from "@/types/invoice"

const STATUS_CONFIG: Record<
  InvoiceStatusValue,
  { label: string; className: string }
> = {
  Draft: {
    label: "Draft",
    className: "bg-muted text-muted-foreground border-border",
  },
  Sent: {
    label: "Sent",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  Paid: {
    label: "Paid",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  PartiallyPaid: {
    label: "Partially paid",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  Unpaid: {
    label: "Unpaid",
    className: "border-orange-200 bg-orange-50 text-orange-700",
  },
  Overdue: {
    label: "Overdue",
    className: "border-red-200 bg-red-50 text-red-700",
  },
  Archived: {
    label: "Archived",
    className: "bg-muted text-muted-foreground border-border",
  },
}

export function invoiceStatusLabel(status: InvoiceStatusValue) {
  return STATUS_CONFIG[status]?.label ?? status
}

export function InvoiceStatusBadge({ status }: { status: InvoiceStatusValue }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground border-border",
  }

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}
