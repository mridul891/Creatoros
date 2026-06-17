import { SponsorshipPage } from "@/components/modules/dashboard/SponsorshipPage";
import { SponsorshipMode } from "@/enums/sponsorship";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content Pipeline",
  alternates: {
    canonical: "/dashboard/deals",
  },
};

export default function DashboardDealsPage() {
  return <SponsorshipPage mode={SponsorshipMode.KANBAN} />;
}
