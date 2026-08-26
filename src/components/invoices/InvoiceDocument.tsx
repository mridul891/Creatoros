import { cn } from "@/lib/utils"
import type { InvoiceDetailData, InvoicePaymentDetails } from "@/types/invoice"
import {
  formatInvoiceDate,
  formatInvoiceMoney,
} from "@/utils/invoiceCalculations"

function AddressLines({ lines }: { lines: Array<string | null | undefined> }) {
  const filtered = lines.filter((line): line is string => Boolean(line?.trim()))
  if (filtered.length === 0) return null
  return (
    <div className="min-w-0 text-[12px] text-neutral-600 leading-[1.65] [overflow-wrap:anywhere]">
      {filtered.map((line) => (
        <div key={line}>{line}</div>
      ))}
    </div>
  )
}

type PartyContact = {
  addressLine?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  email?: string
  phone?: string
}

function PartyBlock({
  title,
  name,
  party,
  extra,
}: {
  title: string
  name: string
  party: PartyContact
  extra?: string[]
}) {
  return (
    <div className="min-w-0">
      <h3 className="mb-1.5 font-semibold text-[10.5px] text-neutral-500 uppercase tracking-[0.11em]">
        {title}
      </h3>
      <div className="mb-0.5 break-words font-semibold text-[14px] [overflow-wrap:anywhere]">
        {name || "—"}
      </div>
      <AddressLines
        lines={[
          party.addressLine,
          [party.city, party.state, party.postalCode]
            .filter(Boolean)
            .join(", "),
          party.country,
          party.email,
          party.phone,
          ...(extra ?? []),
        ]}
      />
    </div>
  )
}

function PaymentLines({ payment }: { payment: InvoicePaymentDetails }) {
  const rows = [
    ["Account name", payment.accountName],
    ["Account no.", payment.accountNumber],
    ["IFSC / SWIFT", payment.ifscOrSwift],
    ["Bank", payment.bankName],
    ["UPI / PayPal", payment.upiOrPaypal],
  ].filter(([, value]) => Boolean(value))

  if (rows.length === 0) return null

  return (
    <div className="min-w-0 space-y-0.5 text-[12px] text-neutral-700 leading-[1.75] [overflow-wrap:anywhere]">
      {rows.map(([label, value]) => (
        <div key={label}>
          <span className="font-semibold">{label}</span> {value}
        </div>
      ))}
    </div>
  )
}

export type InvoiceDocumentModel = Omit<
  InvoiceDetailData,
  "id" | "status" | "paidDate" | "createdAt" | "updatedAt"
>

export function InvoiceDocument({
  invoice,
  className,
}: {
  invoice: InvoiceDocumentModel
  className?: string
}) {
  const money = (amount: number) => formatInvoiceMoney(amount, invoice.currency)

  const hasDiscount = invoice.totals.discountAmount > 0

  const th =
    "border-b border-neutral-200 pb-2 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-neutral-500"
  const td = "border-b border-neutral-100 py-2.5 align-top text-[13.5px]"

  return (
    <div
      className={cn(
        "w-full min-w-0 rounded-lg border border-neutral-200 bg-white px-6 py-8 text-neutral-900 [overflow-wrap:anywhere] sm:px-9 sm:py-10",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4 border-neutral-900 border-b-2 pb-5">
        <div className="min-w-0">
          {invoice.seller.logoUrl ? (
            // biome-ignore lint/performance/noImgElement: logo is a user-uploaded data URL
            <img
              src={invoice.seller.logoUrl}
              alt="Logo"
              className="mb-2.5 max-h-[52px] max-w-[170px] object-contain"
            />
          ) : null}
          <h2 className="font-bold text-[24px] tracking-[-0.03em]">INVOICE</h2>
          {invoice.invoiceNumber ? (
            <p className="mt-0.5 break-words text-[12.5px] text-neutral-500 [overflow-wrap:anywhere]">
              No. {invoice.invoiceNumber}
            </p>
          ) : null}
        </div>
        <div className="min-w-0 max-w-[55%] shrink text-right text-[12.5px] leading-[1.65] [overflow-wrap:anywhere]">
          {invoice.seller.businessName ? (
            <div className="break-words font-semibold">
              {invoice.seller.businessName}
            </div>
          ) : null}
          <div>
            <span className="font-semibold">Issued</span>{" "}
            {formatInvoiceDate(invoice.issuedAt)}
          </div>
          {invoice.dueDate ? (
            <div>
              <span className="font-semibold">Due</span>{" "}
              {formatInvoiceDate(invoice.dueDate)}
            </div>
          ) : null}
          {invoice.seller.taxId ? (
            <div className="break-words opacity-75">{invoice.seller.taxId}</div>
          ) : null}
        </div>
      </div>

      {/* Parties */}
      <div className="my-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="min-w-0">
          <PartyBlock
            title="From"
            name={invoice.seller.businessName || invoice.seller.name}
            party={invoice.seller}
            extra={[invoice.seller.website]}
          />
        </div>
        <div className="min-w-0">
          <PartyBlock
            title="Billed to"
            name={invoice.customer.name}
            party={invoice.customer}
            extra={
              invoice.customer.taxId
                ? [`Tax ID: ${invoice.customer.taxId}`]
                : []
            }
          />
        </div>
      </div>

      {invoice.shipping && !invoice.shippingSameAsBilling ? (
        <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="min-w-0">
            <PartyBlock
              title="Ship to"
              name={invoice.shipping.name}
              party={invoice.shipping}
            />
          </div>
        </div>
      ) : null}

      {/* Items — auto layout so numeric columns keep their natural width */}
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className={cn(th, "w-1/2 text-left")}>Item</th>
            <th className={cn(th, "whitespace-nowrap text-right")}>Qty</th>
            <th className={cn(th, "whitespace-nowrap pl-2 text-right")}>
              Rate
            </th>
            {hasDiscount ? (
              <th className={cn(th, "whitespace-nowrap pl-2 text-right")}>
                Disc.
              </th>
            ) : null}
            <th className={cn(th, "whitespace-nowrap pl-2 text-right")}>
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item) => (
            <tr key={item.id}>
              <td className={cn(td, "min-w-0 pr-3")}>
                <div className="break-words font-medium [overflow-wrap:anywhere]">
                  {item.name}
                </div>
                {item.description ? (
                  <div className="mt-0.5 whitespace-pre-line break-words text-neutral-500 text-xs leading-relaxed [overflow-wrap:anywhere]">
                    {item.description}
                  </div>
                ) : null}
              </td>
              <td
                className={cn(
                  td,
                  "whitespace-nowrap text-right tabular-nums [overflow-wrap:normal]"
                )}
              >
                {item.quantity}
              </td>
              <td
                className={cn(
                  td,
                  "whitespace-nowrap pl-2 text-right text-[13px] tabular-nums [overflow-wrap:normal]"
                )}
              >
                {money(item.unitPrice)}
              </td>
              {hasDiscount ? (
                <td
                  className={cn(
                    td,
                    "whitespace-nowrap pl-2 text-right text-[13px] tabular-nums [overflow-wrap:normal]"
                  )}
                >
                  {item.discountPercent > 0 ? `${item.discountPercent}%` : "—"}
                </td>
              ) : null}
              <td
                className={cn(
                  td,
                  "whitespace-nowrap pl-2 text-right font-medium text-[13px] tabular-nums [overflow-wrap:normal]"
                )}
              >
                {money(item.lineTotal)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="mt-4 ml-auto flex w-full max-w-[280px] flex-col gap-1.5 text-[13.5px]">
        <div className="flex items-baseline justify-between gap-4">
          <span>Subtotal</span>
          <span className="shrink-0 tabular-nums">
            {money(invoice.totals.subtotal)}
          </span>
        </div>
        {hasDiscount ? (
          <div className="flex items-baseline justify-between gap-4">
            <span>Discount</span>
            <span className="shrink-0 tabular-nums">
              −{money(invoice.totals.discountAmount)}
            </span>
          </div>
        ) : null}
        {invoice.taxRate > 0 ? (
          <div className="flex items-baseline justify-between gap-4">
            <span className="min-w-0">
              {invoice.taxLabel || "Tax"} ({invoice.taxRate}%)
            </span>
            <span className="shrink-0 tabular-nums">
              {money(invoice.totals.taxAmount)}
            </span>
          </div>
        ) : null}
        <div className="mt-2 flex items-baseline justify-between gap-4 border-neutral-900 border-t-2 pt-2.5 font-bold text-[18px] tracking-[-0.02em]">
          <span>Total</span>
          <span className="shrink-0 tabular-nums">
            {money(invoice.totals.total)}
          </span>
        </div>
        {invoice.amountPaid > 0 ? (
          <>
            <div className="flex items-baseline justify-between gap-4 pt-1">
              <span>Amount paid</span>
              <span className="shrink-0 tabular-nums">
                {money(invoice.amountPaid)}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-4 font-semibold">
              <span>Balance due</span>
              <span className="shrink-0 tabular-nums">
                {money(invoice.balanceDue)}
              </span>
            </div>
          </>
        ) : null}
      </div>

      {/* Payment details + reference */}
      <div className="mt-7 grid grid-cols-1 gap-6 border-neutral-200 border-t pt-5 sm:grid-cols-2">
        <div className="min-w-0">
          <h3 className="mb-1.5 font-semibold text-[10.5px] text-neutral-500 uppercase tracking-[0.11em]">
            Payment details
          </h3>
          <PaymentLines payment={invoice.paymentDetails} />
        </div>
        <div className="min-w-0">
          <h3 className="mb-1.5 font-semibold text-[10.5px] text-neutral-500 uppercase tracking-[0.11em]">
            Reference
          </h3>
          <div className="space-y-0.5 text-[12px] text-neutral-700 leading-[1.75] [overflow-wrap:anywhere]">
            {invoice.invoiceNumber ? (
              <div>
                <span className="font-semibold">Invoice</span>{" "}
                {invoice.invoiceNumber}
              </div>
            ) : null}
            {invoice.dueDate ? (
              <div>
                <span className="font-semibold">Due</span>{" "}
                {formatInvoiceDate(invoice.dueDate)}
              </div>
            ) : null}
            <div>
              <span className="font-semibold">Amount</span>{" "}
              {money(
                invoice.balanceDue > 0
                  ? invoice.balanceDue
                  : invoice.totals.total
              )}
            </div>
          </div>
        </div>
      </div>

      {invoice.notes || invoice.terms ? (
        <div className="mt-5 space-y-3 whitespace-pre-line text-neutral-600 text-xs leading-relaxed [overflow-wrap:anywhere]">
          {invoice.notes ? <div>{invoice.notes}</div> : null}
          {invoice.terms ? (
            <div>
              <span className="font-semibold text-neutral-800">Terms: </span>
              {invoice.terms}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
