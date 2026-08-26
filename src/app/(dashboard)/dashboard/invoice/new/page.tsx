import type { Metadata } from "next"
import Link from "next/link"

import { InvoiceEditor } from "@/components/invoices/InvoiceEditor"
import { Button } from "@/components/ui/button"
import { requireOnboardedUser } from "@/lib/auth/require-user"

export const metadata: Metadata = {
  title: "Create Invoice",
  alternates: {
    canonical: "/dashboard/invoice/new",
  },
}

export default async function NewInvoicePage() {
  await requireOnboardedUser()

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 py-7 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-1">
        <Button
          asChild
          variant="ghost"
          size="xs"
          className="w-fit text-muted-foreground"
        >
          <Link href="/dashboard/invoice">← Back to invoices</Link>
        </Button>
        <h1 className="font-bold text-2xl tracking-[-0.03em]">
          Create New Invoice
        </h1>
        <p className="text-muted-foreground text-sm leading-[1.7]">
          Fill in the details below — the preview updates as you type.
        </p>
      </header>

      <main>
        <InvoiceEditor mode="create" />
      </main>
    </div>
  )
}
