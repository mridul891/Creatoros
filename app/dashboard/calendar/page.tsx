import { CalendarPage } from "@/components/modules/dashboard/CalendarPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendar",
  alternates: {
    canonical: "/dashboard/calendar",
  },
};

export default function DashboardCalendarPage() {
  return <CalendarPage />;
}
