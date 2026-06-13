import { ProductPage } from "@/components/individualPages/product-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product",
  description:
    "Explore how NotYetLaunched helps creators manage brand deals, sponsorship pipelines, deliverables, invoices, and payments in one workspace.",
  alternates: {
    canonical: "/product",
  },
};

export default function ProductRoutePage() {
  return <ProductPage />;
}
