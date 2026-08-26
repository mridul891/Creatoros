import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { InvoiceDetailActions } from "@/components/invoices/InvoiceDetailActions"
import { InvoiceDocument } from "@/components/invoices/InvoiceDocument"
import { InvoiceStatusBadge } from "@/components/invoices/InvoiceStatusBadge"
import { Button } from "@/components/ui/button"
import { requireOnboardedUser } from "@/lib/auth/require-user"
import { getInvoiceDetailForUser } from "@/server/invoiceService"
import type { InvoiceDetailData } from "@/types/invoice"
import {
  formatInvoiceDate,
  formatInvoiceMoney,
} from "@/utils/invoiceCalculations"

export const metadata: Metadata = {
  title: "Invoice",
  alternates: {
    canonical: "/dashboard/invoice/[id]",
  },
}

function SummaryRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  )
}

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireOnboardedUser()
  const { id } = await params

  const invoice: InvoiceDetailData | null = await getInvoiceDetailForUser(
    user.id,
    id
  )

  if (!invoice) {
    notFound()
  }

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-6 px-4 py-7 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-3">
        <Button
          asChild
          variant="ghost"
          size="xs"
          className="w-fit text-muted-foreground"
        >
          <Link href="/dashboard/invoice">← Back to invoices</Link>
        </Button>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-bold text-2xl tracking-[-0.03em]">
              {invoice.invoiceNumber}
            </h1>
            <p className="mt-0.5 flex items-center gap-2 text-muted-foreground text-sm">
              <InvoiceStatusBadge status={invoice.status} />
              <span aria-hidden>·</span>
              <span>
                Updated{" "}
                {formatInvoiceDate(
                  invoice.updatedAt.toISOString().slice(0, 10)
                )}
              </span>
            </p>
          </div>
        </div>
        <InvoiceDetailActions invoice={invoice} />
      </header>

      <main>
        <InvoiceDocument invoice={invoice} />

        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 rounded-xl border bg-card p-4 sm:grid-cols-4">
          <SummaryRow
            label="Subtotal"
            value={formatInvoiceMoney(
              invoice.totals.subtotal,
              invoice.currency
            )}
          />
          <SummaryRow
            label="Discount"
            value={`−${formatInvoiceMoney(invoice.totals.discountAmount, invoice.currency)}`}
          />
          <SummaryRow
            label={
              invoice.taxLabel
                ? `${invoice.taxLabel} (${invoice.taxRate}%)`
                : "Tax"
            }
            value={formatInvoiceMoney(
              invoice.totals.taxAmount,
              invoice.currency
            )}
          />
          <SummaryRow
            label="Total"
            value={formatInvoiceMoney(invoice.totals.total, invoice.currency)}
          />
          <SummaryRow
            label="Amount paid"
            value={formatInvoiceMoney(invoice.amountPaid, invoice.currency)}
          />
          <SummaryRow
            label="Balance due"
            value={formatInvoiceMoney(invoice.balanceDue, invoice.currency)}
          />
          <SummaryRow
            label="Issued"
            value={formatInvoiceDate(invoice.issuedAt)}
          />
          <SummaryRow label="Due" value={formatInvoiceDate(invoice.dueDate)} />
        </div>
      </main>
    </div>
  )
}
