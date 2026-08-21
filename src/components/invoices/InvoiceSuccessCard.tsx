import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { GeneratedInvoice } from "@/types/invoice"
import { formatMoney } from "@/utils/mediaKitFormatters"

type InvoiceSuccessCardProps = {
  invoice: GeneratedInvoice
  onCreateAnother: () => void
}

export function InvoiceSuccessCard({
  invoice,
  onCreateAnother,
}: InvoiceSuccessCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-muted-foreground text-sm">Invoice generated</p>
            <p className="font-semibold text-lg tracking-[-0.01em]">
              {invoice.invoiceNumber}
            </p>
          </div>
          <Badge variant="secondary">Draft</Badge>
        </div>

        <Separator />

        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Billed to</dt>
            <dd className="font-medium">{invoice.clientName}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Due date</dt>
            <dd className="font-medium">{invoice.dueDate}</dd>
          </div>
        </dl>

        <ul className="flex flex-col gap-2">
          {invoice.lineItems.map((item) => (
            <li
              key={item.description}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <span>{item.description}</span>
              <span className="font-medium tabular-nums">
                {formatMoney(item.amount, invoice.currency)}
              </span>
            </li>
          ))}
        </ul>

        <Separator />

        <div className="flex items-center justify-between font-semibold">
          <span>Total</span>
          <span className="tabular-nums">
            {formatMoney(invoice.amount, invoice.currency)}
          </span>
        </div>

        <Button type="button" variant="outline" onClick={onCreateAnother}>
          Create another invoice
        </Button>
      </CardContent>
    </Card>
  )
}
