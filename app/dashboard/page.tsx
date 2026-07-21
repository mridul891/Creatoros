import type { Metadata } from "next";
import { DashboardOverview } from "@/components/modules/dashboard/overview";

export const metadata: Metadata = {
  title: "Overview",
  alternates: {
    canonical: "/dashboard",
  },
};

export default function DashboardPage() {
  return <DashboardOverview />;
}
