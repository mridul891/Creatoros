import type { Metadata } from "next"
import Link from "next/link"

import { InvoicesDashboard } from "@/components/invoices/InvoicesDashboard"
import { Button } from "@/components/ui/button"
import { requireOnboardedUser } from "@/lib/auth/require-user"
import { listInvoicesForUser } from "@/server/invoiceService"

export const metadata: Metadata = {
  title: "Invoices",
  alternates: {
    canonical: "/dashboard/invoice",
  },
}

export default async function DashboardInvoicePage() {
  const user = await requireOnboardedUser()
  const invoices = await listInvoicesForUser(user.id)

  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 px-4 py-7 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-2xl tracking-[-0.03em]">Invoices</h1>
          <p className="text-muted-foreground text-sm leading-[1.7]">
            Create, manage, edit and download your invoices.
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link href="/dashboard/invoice/new">+ Create New Invoice</Link>
        </Button>
      </header>

      <main>
        <InvoicesDashboard invoices={invoices} />
      </main>
    </div>
  )
}
