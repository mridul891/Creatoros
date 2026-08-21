import { redirect } from "next/navigation"

import { DashboardRoute } from "@/enums/dashboard-route"

export default function DashboardPage() {
  redirect(DashboardRoute.MEDIA_KIT)
}
