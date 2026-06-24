import { InvoicesPage } from "@/components/modules/dashboard/InvoicesPage";
import type { Metadata } from "next";
import { listInvoicesAction } from "@/app/action/invoiceActions";

export const metadata: Metadata = {
  title: "Invoices",
  alternates: {
    canonical: "/dashboard/invoices",
  },
};

type DashboardInvoicesPageProps = {
  searchParams: Promise<{
    invoice?: string
  }>
}

export default async function DashboardInvoicesPage({ searchParams }: DashboardInvoicesPageProps) {
  const search = await searchParams
  const result = await listInvoicesAction()

  return (
    <InvoicesPage
      initialData={
        result.success && result.data
          ? result.data
          : {
              items: [],
              summary: {
                total: 0,
                paidAmount: 0,
                sentAmount: 0,
                overdueAmount: 0,
              },
              filters: {
                search: "",
              },
            }
      }
      selectedInvoiceId={search.invoice}
    />
  );
}
