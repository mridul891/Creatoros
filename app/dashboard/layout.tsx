import type { ReactNode } from "react";
import type { Metadata } from "next";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/modules/dashboard/analytics/Sidebar";

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
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider className="h-screen overflow-hidden bg-[#050505] font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,system-ui,sans-serif]">
      <Sidebar />
      <SidebarInset className="flex flex-1 flex-col overflow-hidden bg-transparent">
        <div className="sticky top-0 z-10 flex h-14 items-center border-b border-[rgba(255,255,255,0.07)] bg-[#050505]/95 px-4 backdrop-blur md:hidden">
          <SidebarTrigger className="text-white hover:bg-white/10 hover:text-white" />
        </div>
        <main className="flex flex-1 flex-col overflow-y-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
