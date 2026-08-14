"use server"

import { revalidatePath } from "next/cache"
import {
  createInvoiceFromDeliverableSchema,
  invoiceListSchema,
} from "@/features/invoices/schemas/invoiceValidation"
import {
  createInvoiceFromDeliverable,
  InvoiceServiceError,
  listUserInvoices,
} from "@/features/invoices/services/invoiceService"
import type {
  InvoiceListData,
  InvoiceListItem,
} from "@/features/invoices/types/invoice"
import { requireOnboardedUser } from "@/lib/auth/require-user"

export type InvoiceMutationResult = {
  success: boolean
  message?: string
  data?: InvoiceListItem
}

export type InvoiceListResult = {
  success: boolean
  message?: string
  data?: InvoiceListData
}

function revalidateInvoicePaths(dealId?: string | null) {
  revalidatePath("/dashboard/invoices")
  revalidatePath("/dashboard")
  if (dealId) {
    revalidatePath(`/dashboard/deals/${dealId}`)
  }
}

function mapInvoiceServiceError(
  error: unknown,
  fallbackMessage: string
): InvoiceMutationResult {
  if (error instanceof InvoiceServiceError) {
    return {
      success: false,
      message: error.message,
    }
  }

  return {
    success: false,
    message: fallbackMessage,
  }
}

export async function createInvoiceFromDeliverableAction(
  deliverableId: string
): Promise<InvoiceMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = createInvoiceFromDeliverableSchema.safeParse({ deliverableId })

  if (!parsed.success) {
    return {
      success: false,
      message: "Deliverable id is invalid.",
    }
  }

  try {
    const data = await createInvoiceFromDeliverable(
      user.id,
      parsed.data.deliverableId
    )
    revalidateInvoicePaths(data.dealId)
    return {
      success: true,
      message: "Invoice draft created.",
      data,
    }
  } catch (error) {
    console.error("invoices.create_from_deliverable_failed", {
      userId: user.id,
      deliverableId: parsed.data.deliverableId,
      error,
    })
    return mapInvoiceServiceError(
      error,
      "We could not create this invoice. Please try again."
    )
  }
}

export async function listInvoicesAction(
  input: { search?: string; status?: string } = {}
): Promise<InvoiceListResult> {
  const user = await requireOnboardedUser()
  const parsed = invoiceListSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid invoices list request.",
    }
  }

  try {
    const data = await listUserInvoices(user.id, parsed.data)
    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("invoices.list_failed", {
      userId: user.id,
      input: parsed.data,
      error,
    })
    return {
      success: false,
      message: "We could not load invoices. Please try again.",
    }
  }
}
