"use client"

import { Add01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  InvoiceStatusBadge,
  invoiceStatusLabel,
} from "@/components/invoices/InvoiceStatusBadge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { InvoiceListItem, InvoiceStatusValue } from "@/types/invoice"
import { formatInvoiceMoney } from "@/utils/invoiceCalculations"

type StatusFilter = "all" | InvoiceStatusValue
type SortOption = "newest" | "oldest" | "highest" | "lowest"

function formatTableDate(value: Date) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function InvoicesDashboard({
  invoices,
}: {
  invoices: InvoiceListItem[]
}) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [sort, setSort] = useState<SortOption>("newest")

  const filtered = invoices
    .filter((invoice) => {
      if (statusFilter !== "all" && invoice.status !== statusFilter) {
        return false
      }

      const query = search.trim().toLowerCase()
      if (!query) return true

      return (
        invoice.invoiceNumber.toLowerCase().includes(query) ||
        (invoice.customerName ?? "").toLowerCase().includes(query)
      )
    })
    .sort((a, b) => {
      switch (sort) {
        case "oldest":
          return a.issuedAt.getTime() - b.issuedAt.getTime()
        case "highest":
          return b.amount - a.amount
        case "lowest":
          return a.amount - b.amount
        default:
          return b.issuedAt.getTime() - a.issuedAt.getTime()
      }
    })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by invoice no. or customer…"
          className="sm:max-w-xs"
          aria-label="Search invoices"
        />
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as StatusFilter)}
        >
          <SelectTrigger
            className="w-full sm:w-[180px]"
            aria-label="Filter by status"
          >
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {(Object.keys(STATUS_KEYS) as InvoiceStatusValue[]).map(
              (status) => (
                <SelectItem key={status} value={status}>
                  {invoiceStatusLabel(status)}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
        <Select
          value={sort}
          onValueChange={(value) => setSort(value as SortOption)}
        >
          <SelectTrigger
            className="w-full sm:ml-auto sm:w-[190px]"
            aria-label="Sort invoices"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="highest">Highest amount</SelectItem>
            <SelectItem value="lowest">Lowest amount</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        invoices.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="rounded-xl border border-dashed py-16 text-center text-muted-foreground text-sm">
            No invoices match your search or filters.
          </div>
        )
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[16%] pl-4">Invoice No.</TableHead>
                <TableHead className="w-[24%]">Customer</TableHead>
                <TableHead className="w-[11%]">Issued</TableHead>
                <TableHead className="w-[11%]">Due</TableHead>
                <TableHead className="w-[14%] text-right">Amount</TableHead>
                <TableHead className="w-[11%]">Status</TableHead>
                <TableHead className="w-[13%] pr-4 text-right">
                  Updated
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/dashboard/invoice/${invoice.id}`)
                  }
                >
                  <TableCell className="whitespace-nowrap pl-4 font-medium">
                    <Link
                      href={`/dashboard/invoice/${invoice.id}`}
                      className="underline-offset-4 hover:underline"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {invoice.invoiceNumber}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate">
                    {invoice.customerName || "—"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatTableDate(invoice.issuedAt)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {invoice.dueDate ? formatTableDate(invoice.dueDate) : "—"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right font-medium tabular-nums">
                    {formatInvoiceMoney(invoice.amount, invoice.currency)}
                  </TableCell>
                  <TableCell>
                    <InvoiceStatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap pr-4 text-right text-muted-foreground">
                    {formatTableDate(invoice.updatedAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

const STATUS_KEYS = {
  Draft: true,
  Sent: true,
  Paid: true,
  PartiallyPaid: true,
  Unpaid: true,
  Overdue: true,
  Archived: true,
} as const

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed px-6 py-20 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-xl">
        🧾
      </div>
      <div className="space-y-1">
        <h2 className="font-semibold text-lg tracking-[-0.02em]">
          No invoices yet
        </h2>
        <p className="text-muted-foreground text-sm">
          Create your first invoice to start managing your billing.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard/invoice/new">
          <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
          Create New Invoice
        </Link>
      </Button>
    </div>
  )
}
