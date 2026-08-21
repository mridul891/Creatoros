import { Card, CardContent } from "@/components/ui/card"
import type { RecentInvoice } from "@/types/invoice"
import { formatMoney } from "@/utils/mediaKitFormatters"

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

type RecentInvoicesListProps = {
  invoices: RecentInvoice[]
}

export function RecentInvoicesList({ invoices }: RecentInvoicesListProps) {
  if (invoices.length === 0) {
    return null
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-semibold tracking-[-0.01em]">Recent invoices</h2>
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y">
            {invoices.map((invoice) => (
              <li
                key={invoice.id}
                className="flex items-center justify-between gap-4 px-5 py-3 text-sm"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="font-medium">{invoice.invoiceNumber}</span>
                  <span className="truncate text-muted-foreground text-xs">
                    {invoice.clientName ?? "No client"} ·{" "}
                    {formatDate(invoice.issuedAt)}
                  </span>
                </div>
                <span className="font-medium tabular-nums">
                  {formatMoney(invoice.amount, invoice.currency)}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}
