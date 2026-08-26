import type { Metadata } from "next"
import Link from "next/link"

import { InvoiceEmptyState } from "@/components/invoices/InvoiceEmptyState"
import { InvoiceForm } from "@/components/invoices/InvoiceForm"
import { RecentInvoicesList } from "@/components/invoices/RecentInvoicesList"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { requireOnboardedUser } from "@/lib/auth/require-user"
import {
  getInvoiceDraftData,
  listRecentInvoices,
} from "@/server/invoiceService"

export const metadata: Metadata = {
  title: "Generate Invoice from Media Kit",
  alternates: {
    canonical: "/dashboard/invoice/generate",
  },
}

export default async function GenerateInvoicePage() {
  const user = await requireOnboardedUser()
  const [draft, recentInvoices] = await Promise.all([
    getInvoiceDraftData(user.id),
    listRecentInvoices(user.id),
  ])

  return (
    <div className="mx-auto flex w-full max-w-[880px] flex-col gap-6 px-4 py-7 sm:px-6 lg:px-8">
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
          Generate from media kit
        </h1>
        <p className="text-muted-foreground text-sm leading-[1.7]">
          Generate invoices from your media kit rate card. Amounts are always
          calculated from your saved pricing.
        </p>
      </header>

      {draft ? (
        <>
          <Separator />
          <main>
            <InvoiceForm draft={draft} />
          </main>
          <RecentInvoicesList invoices={recentInvoices} />
        </>
      ) : (
        <InvoiceEmptyState />
      )}
    </div>
  )
}
