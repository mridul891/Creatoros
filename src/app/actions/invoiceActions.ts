"use server"

import { revalidatePath } from "next/cache"
import { requireOnboardedUser } from "@/lib/auth/require-user"
import { getFieldErrors } from "@/lib/utils/form-errors"
import { generateInvoiceSchema } from "@/schemas/invoice"
import {
  generateMediaKitInvoice,
  InvoiceServiceError,
} from "@/server/invoiceService"
import type { GenerateInvoiceResult } from "@/types/invoice"

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
