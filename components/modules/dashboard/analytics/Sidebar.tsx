"use client";

import {
  BarChart3,
  Calendar,
  FileText,
  Handshake,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { DashboardRoute } from "@/enums/dashboard-route";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import {
  Sidebar as AppSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const NAV_ITEMS = [
  { href: DashboardRoute.ROOT, label: "Dashboard", icon: LayoutDashboard },
  { href: DashboardRoute.CALENDAR, label: "Calendar", icon: Calendar },
  { href: DashboardRoute.ANALYTICS, label: "Analytics", icon: BarChart3 },
  { href: DashboardRoute.DEALS, label: "Sponsorships", icon: Handshake },
  { href: DashboardRoute.INVOICES, label: "Invoices", icon: FileText },
  { href: DashboardRoute.MEDIA_KIT, label: "Media Kit", icon: Sparkles },
];

function isNavItemActive(pathname: string, href: DashboardRoute) {
  if (href === DashboardRoute.ROOT) {
    return pathname === href;
  }

  if (href === DashboardRoute.DEALS) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return pathname === href;
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleNavigate = (href: DashboardRoute) => {
    router.push(href);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      setIsSigningOut(false);
      return;
    }

    router.replace("/login");
    router.refresh();
  };

  return (
    <AppSidebar
      collapsible="offcanvas"
      className="border-r border-[rgba(255,255,255,0.07)] bg-[#080808] [--sidebar:#080808] [--sidebar-foreground:#ffffff] [--sidebar-border:rgba(255,255,255,0.07)] [--sidebar-accent:rgba(255,255,255,0.07)] [--sidebar-accent-foreground:#ffffff] [--sidebar-ring:rgba(232,64,42,0.45)]"
    >
      <SidebarHeader className="border-b border-[rgba(255,255,255,0.07)] px-4 py-5">
        <div className="flex items-center gap-[9px]">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white">
            <Sparkles size={14} color="#000" />
          </div>
          <span className="text-sm font-bold tracking-[-0.025em] text-white">CreatorOS</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-[10px] py-3">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="mb-2 px-2 font-mono text-[9px] tracking-[0.12em] text-[rgba(255,255,255,0.4)]">
            WORKSPACE
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = isNavItemActive(pathname, href);
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      isActive={active}
                      onClick={() => handleNavigate(href)}
                      className="h-9 cursor-pointer gap-[9px] rounded-lg px-[10px] text-[13px] font-normal text-[rgba(255,255,255,0.4)] transition-all duration-150 hover:bg-[rgba(255,255,255,0.05)] hover:text-[rgba(255,255,255,0.9)] data-active:bg-[rgba(255,255,255,0.07)] data-active:font-semibold data-active:text-white"
                    >
                      <Icon size={14} />
                      <span>{label}</span>
                      {active && <div className="ml-auto h-1 w-1 rounded-full bg-[#E8402A]" />}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-[rgba(255,255,255,0.07)] px-[10px] py-3">
        <div className="flex items-center gap-[9px] rounded-lg px-[10px] py-2">
          <img
            src="https://images.unsplash.com/photo-1531539134685-27d854339120?w=40&h=40&fit=crop&crop=face"
            alt="Maya"
            className="h-[30px] w-[30px] rounded-full border border-[rgba(255,255,255,0.07)] object-cover"
          />
          <div>
            <div className="text-xs font-semibold text-white">Maya Chen</div>
            <div className="font-mono text-[10px] text-[rgba(255,255,255,0.4)]">Pro Plan</div>
          </div>
          <Settings size={13} color="rgba(255,255,255,0.4)" className="ml-auto" />
        </div>
        <SidebarMenu className="mt-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="h-9 cursor-pointer gap-[9px] rounded-lg px-[10px] text-[13px] font-normal text-[rgba(255,255,255,0.4)] transition-all duration-150 hover:bg-[rgba(255,255,255,0.05)] hover:text-[rgba(255,255,255,0.9)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <LogOut size={14} />
              <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </AppSidebar>
  );
}
