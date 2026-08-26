"use server"

import { revalidatePath } from "next/cache"
import { requireOnboardedUser } from "@/lib/auth/require-user"
import { getFieldErrors } from "@/lib/utils/form-errors"
import { generateInvoiceSchema, invoiceFormSchema } from "@/schemas/invoice"
import {
  createManualInvoice,
  deleteInvoiceForUser,
  generateMediaKitInvoice,
  InvoiceServiceError,
  updateInvoiceStatusForUser,
  updateManualInvoice,
} from "@/server/invoiceService"
import type { GenerateInvoiceResult, InvoiceStatusValue } from "@/types/invoice"

export type InvoiceMutationResult =
  | { status: "success"; invoiceId: string }
  | {
      status: "error"
      message: string
      fieldErrors?: Partial<Record<string, string>>
    }

export async function generateInvoiceAction(
  input: unknown
): Promise<GenerateInvoiceResult> {
  const user = await requireOnboardedUser()

  const parsed = generateInvoiceSchema.safeParse(input)

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      fieldErrors: getFieldErrors<string>(parsed.error),
    }
  }

  try {
    const invoice = await generateMediaKitInvoice(user.id, parsed.data)

    revalidatePath("/dashboard/invoice")

    return {
      status: "success",
      invoice,
    }
  } catch (error) {
    if (error instanceof InvoiceServiceError) {
      return {
        status: "error",
        message: error.message,
      }
    }

    console.error("media_kit_invoice.generation_failed", {
      userId: user.id,
      error,
    })

    return {
      status: "error",
      message:
        "We could not generate your invoice right now. Please try again.",
    }
  }
}

function revalidateInvoicePaths(invoiceId?: string) {
  revalidatePath("/dashboard/invoice")
  if (invoiceId) {
    revalidatePath(`/dashboard/invoice/${invoiceId}`)
    revalidatePath(`/dashboard/invoice/${invoiceId}/edit`)
  }
}

export async function createInvoiceAction(
  input: unknown
): Promise<InvoiceMutationResult> {
  const user = await requireOnboardedUser()

  const parsed = invoiceFormSchema.safeParse(input)

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      fieldErrors: getFieldErrors<string>(parsed.error),
    }
  }

  try {
    const created = await createManualInvoice(user.id, parsed.data)

    revalidateInvoicePaths(created.id)

    return { status: "success", invoiceId: created.id }
  } catch (error) {
    if (error instanceof InvoiceServiceError) {
      return { status: "error", message: error.message }
    }

    console.error("invoice.create_failed", { userId: user.id, error })

    return {
      status: "error",
      message: "We could not save your invoice right now. Please try again.",
    }
  }
}

export async function updateInvoiceAction(
  invoiceId: string,
  input: unknown
): Promise<InvoiceMutationResult> {
  const user = await requireOnboardedUser()

  const parsed = invoiceFormSchema.safeParse(input)

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      fieldErrors: getFieldErrors<string>(parsed.error),
    }
  }

  try {
    await updateManualInvoice(user.id, invoiceId, parsed.data)

    revalidateInvoicePaths(invoiceId)

    return { status: "success", invoiceId }
  } catch (error) {
    if (error instanceof InvoiceServiceError) {
      return { status: "error", message: error.message }
    }

    console.error("invoice.update_failed", {
      userId: user.id,
      invoiceId,
      error,
    })

    return {
      status: "error",
      message: "We could not update your invoice right now. Please try again.",
    }
  }
}

export async function deleteInvoiceAction(
  invoiceId: string
): Promise<InvoiceMutationResult> {
  const user = await requireOnboardedUser()

  try {
    await deleteInvoiceForUser(user.id, invoiceId)

    revalidateInvoicePaths()

    return { status: "success", invoiceId }
  } catch (error) {
    if (error instanceof InvoiceServiceError) {
      return { status: "error", message: error.message }
    }

    console.error("invoice.delete_failed", {
      userId: user.id,
      invoiceId,
      error,
    })

    return {
      status: "error",
      message: "We could not delete this invoice. Please try again.",
    }
  }
}

export async function updateInvoiceStatusAction(
  invoiceId: string,
  status: InvoiceStatusValue
): Promise<InvoiceMutationResult> {
  const user = await requireOnboardedUser()

  try {
    await updateInvoiceStatusForUser(user.id, invoiceId, status)

    revalidateInvoicePaths(invoiceId)

    return { status: "success", invoiceId }
  } catch (error) {
    if (error instanceof InvoiceServiceError) {
      return { status: "error", message: error.message }
    }

    console.error("invoice.status_update_failed", {
      userId: user.id,
      invoiceId,
      error,
    })

    return {
      status: "error",
      message: "We could not update the invoice status. Please try again.",
    }
  }
}
