import type { ReactNode } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { requireOnboardedUser } from "@/lib/auth/require-user"

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const data = await requireOnboardedUser()

  return (
    <SidebarProvider className="h-screen overflow-hidden bg-background">
      <Sidebar data={data} />
      <SidebarInset className="flex flex-1 flex-col overflow-hidden bg-transparent">
        <div className="sticky top-0 z-10 flex h-14 items-center border-border border-b bg-background/95 px-4 backdrop-blur md:hidden">
          <SidebarTrigger className="text-foreground hover:bg-muted hover:text-foreground" />
        </div>
        <main className="flex flex-1 flex-col overflow-y-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
