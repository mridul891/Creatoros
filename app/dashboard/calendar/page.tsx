import type { Metadata } from "next"
import { CalendarPage } from "@/components/modules/dashboard/CalendarPage"

export const metadata: Metadata = {
  title: "Calendar",
  alternates: {
    canonical: "/dashboard/calendar",
  },
}

export default function DashboardCalendarPage() {
  return <CalendarPage />
}
