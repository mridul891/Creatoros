import type { Metadata } from "next"
import { CalendarPage } from "@/features/calendar/components/CalendarPage"

export const metadata: Metadata = {
  title: "Calendar",
  alternates: {
    canonical: "/dashboard/calendar",
  },
}

export default function DashboardCalendarPage() {
  return <CalendarPage />
}
