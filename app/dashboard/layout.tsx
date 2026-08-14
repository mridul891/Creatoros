import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Sidebar } from "@/components/modules/dashboard/analytics/Sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { requireOnboardedUser } from "@/lib/auth/require-user"

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Dashboard | NotYetLaunched",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  await requireOnboardedUser()

  return (
    <SidebarProvider className="h-screen overflow-hidden bg-background">
      <Sidebar />
      <SidebarInset className="flex flex-1 flex-col overflow-hidden bg-transparent">
        <div className="sticky top-0 z-10 flex h-14 items-center border-border border-b bg-background/95 px-4 backdrop-blur md:hidden">
          <SidebarTrigger className="text-foreground hover:bg-muted hover:text-foreground" />
        </div>
        <main className="flex flex-1 flex-col overflow-y-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
