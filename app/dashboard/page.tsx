import { AnalyticsDashboard } from "@/components/modules/dashboard/AnalyticsDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Overview",
  alternates: {
    canonical: "/dashboard",
  },
};

export default function DashboardPage() {
  return <AnalyticsDashboard />;
}
