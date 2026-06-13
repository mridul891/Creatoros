import { SponsorshipPage } from "@/components/modules/dashboard/SponsorshipPage";
import { SponsorshipMode } from "@/enums/sponsorship";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deals Analytics",
  alternates: {
    canonical: "/dashboard/analytics",
  },
};

export default function DashboardDealsAnalyticsPage() {
  return <SponsorshipPage mode={SponsorshipMode.ANALYTICS} />;
}
