import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { InvoiceEditor } from "@/components/invoices/InvoiceEditor"
import { Button } from "@/components/ui/button"
import { requireOnboardedUser } from "@/lib/auth/require-user"
import { getInvoiceDetailForUser } from "@/server/invoiceService"

export const metadata: Metadata = {
  title: "Edit Invoice",
  alternates: {
    canonical: "/dashboard/invoice/[id]/edit",
  },
}

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireOnboardedUser()
  const { id } = await params

  const invoice = await getInvoiceDetailForUser(user.id, id)

  if (!invoice) {
    notFound()
  }

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 py-7 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-1">
        <Button
          asChild
          variant="ghost"
          size="xs"
          className="w-fit text-muted-foreground"
        >
          <Link href={`/dashboard/invoice/${invoice.id}`}>
            ← Back to invoice
          </Link>
        </Button>
        <h1 className="font-bold text-2xl tracking-[-0.03em]">
          Edit {invoice.invoiceNumber}
        </h1>
        <p className="text-muted-foreground text-sm leading-[1.7]">
          Changes update the existing invoice — the preview updates as you type.
        </p>
      </header>

      <main>
        <InvoiceEditor
          mode="edit"
          invoiceId={invoice.id}
          initialInvoice={invoice}
        />
      </main>
    </div>
  )
}
