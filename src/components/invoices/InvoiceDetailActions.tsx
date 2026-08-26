"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import {
  deleteInvoiceAction,
  updateInvoiceStatusAction,
} from "@/app/actions/invoiceActions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { InvoiceDetailData, InvoiceStatusValue } from "@/types/invoice"
import { downloadInvoicePdf } from "@/utils/downloadInvoicePdf"

const STATUS_OPTIONS: Array<{ value: InvoiceStatusValue; label: string }> = [
  { value: "Draft", label: "Draft" },
  { value: "Sent", label: "Sent" },
  { value: "Unpaid", label: "Unpaid" },
  { value: "PartiallyPaid", label: "Partially paid" },
  { value: "Paid", label: "Paid" },
  { value: "Overdue", label: "Overdue" },
  { value: "Archived", label: "Archived" },
]

export function InvoiceDetailActions({
  invoice,
}: {
  invoice: InvoiceDetailData
}) {
  const router = useRouter()

  const [isDownloading, setIsDownloading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  async function handleDownload() {
    setIsDownloading(true)
    try {
      await downloadInvoicePdf(invoice, invoice.invoiceNumber)
      toast.success("Invoice PDF downloaded.")
    } catch {
      toast.error("Could not generate the PDF. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  async function handleStatusChange(status: InvoiceStatusValue) {
    setIsUpdatingStatus(true)
    try {
      const result = await updateInvoiceStatusAction(invoice.id, status)
      if (result.status === "error") {
        toast.error(result.message)
        return
      }
      toast.success(
        `Status updated to ${status.replace(/([a-z])([A-Z])/g, "$1 $2")}.`
      )
      router.refresh()
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  async function handleDelete() {
    setIsDeleting(true)
    try {
      const result = await deleteInvoiceAction(invoice.id)
      if (result.status === "error") {
        toast.error(result.message)
        return
      }
      toast.success("Invoice deleted.")
      router.push("/dashboard/invoice")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={`/dashboard/invoice/${invoice.id}/edit`}>
            Edit Invoice
          </Link>
        </Button>
        <Button size="sm" onClick={handleDownload} disabled={isDownloading}>
          {isDownloading ? "Preparing…" : "Download PDF"}
        </Button>
        <Select
          value={invoice.status}
          onValueChange={(value) =>
            handleStatusChange(value as InvoiceStatusValue)
          }
          disabled={isUpdatingStatus}
        >
          <SelectTrigger
            size="sm"
            className="w-[160px]"
            aria-label="Invoice status"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-destructive hover:text-destructive"
            >
              Delete Invoice
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this invoice?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently deletes{" "}
                <span className="font-medium">{invoice.invoiceNumber}</span>.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={isDeleting}
                onClick={(event) => {
                  event.preventDefault()
                  void handleDelete()
                }}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting…" : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
