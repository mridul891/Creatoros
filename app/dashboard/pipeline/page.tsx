import { PipelinePage } from "@/components/modules/dashboard/sponsorship";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content Pipeline",
  alternates: {
    canonical: "/dashboard/analytics",
  },
};

export default function DashboardDealsAnalyticsPage() {
  return <PipelinePage />;
}
