import { InvoicesPage } from "@/components/modules/dashboard/InvoicesPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoices",
  alternates: {
    canonical: "/dashboard/invoices",
  },
};

export default function DashboardInvoicesPage() {
  return <InvoicesPage />;
}
