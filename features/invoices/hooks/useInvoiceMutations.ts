"use client"

import { useState } from "react"
import { toast } from "sonner"

import { createInvoiceFromDeliverableAction } from "@/features/invoices/actions/invoiceActions"

type UseInvoiceMutationsOptions = {
  onRefresh?: () => void
}

export function useInvoiceMutations({
  onRefresh,
}: UseInvoiceMutationsOptions = {}) {
  const [isCreatingFromDeliverableId, setIsCreatingFromDeliverableId] =
    useState<string | null>(null)

  async function createFromDeliverable(deliverableId: string) {
    setIsCreatingFromDeliverableId(deliverableId)
    try {
      const result = await createInvoiceFromDeliverableAction(deliverableId)
      if (!result.success) {
        toast.error(result.message ?? "Could not create invoice.")
        return result
      }

      toast.success(result.message ?? "Invoice draft created.")
      onRefresh?.()
      return result
    } finally {
      setIsCreatingFromDeliverableId(null)
    }
  }

  return {
    isCreatingFromDeliverableId,
    createFromDeliverable,
  }
}
