"use client";

import {
  BarChart3,
  Building2,
  Calendar,
  ChevronsLeft,
  FileText,
  Handshake,
  LayoutDashboard,
  LogOut,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const NAV_ITEMS = [
  { href: DashboardRoute.ROOT, label: "Dashboard", icon: LayoutDashboard },
  { href: DashboardRoute.CALENDAR, label: "Calendar", icon: Calendar },
  { href: DashboardRoute.BRANDS, label: "Brands", icon: Building2 },
  { href: DashboardRoute.ANALYTICS, label: "Analytics", icon: BarChart3 },
  { href: DashboardRoute.DEALS, label: "Deal", icon: Handshake },
  { href: DashboardRoute.INVOICES, label: "Invoices", icon: FileText },
  { href: DashboardRoute.MEDIA_KIT, label: "Media Kit", icon: Sparkles },
];

function isNavItemActive(pathname: string, href: DashboardRoute) {
  if (href === DashboardRoute.ROOT) {
    return pathname === href;
  }

  if (href === DashboardRoute.DEALS || href === DashboardRoute.BRANDS) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return pathname === href;
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile, setOpenMobile, state } = useSidebar();
  const [isSigningOut, setIsSigningOut] = useState(false);

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
    <AppSidebar variant="inset" collapsible="icon">
      <SidebarHeader className="px-3 py-3">
        <div className="flex items-center gap-2">
          <SidebarMenu className="min-w-0 flex-1">
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" className="h-11 rounded-xl px-2.5" asChild>
                <Link
                  href={DashboardRoute.ROOT}
                  className="flex min-w-0 items-center gap-2"
                  onClick={() => {
                    if (isMobile) setOpenMobile(false);
                  }}
                >
                  <span className="truncate text-[15px] font-semibold tracking-[-0.01em] text-white group-data-[collapsible=icon]:hidden text-center">
                    !yetlaunched
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarTrigger
            className="relative z-20 size-9 shrink-0 rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
            title={state === "collapsed" ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronsLeft className={`size-4 transition-transform ${state === "collapsed" ? "rotate-180" : ""}`} />
            <span className="sr-only">Toggle sidebar</span>
          </SidebarTrigger>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup className="py-2">
          <SidebarGroupLabel className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-sidebar-foreground/55">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = isNavItemActive(pathname, href);
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      isActive={active}
                      asChild
                      tooltip={label}
                      className="h-10 rounded-xl px-3 text-[13px] font-medium"
                    >
                      <Link
                        href={href}
                        onClick={() => {
                          if (isMobile) setOpenMobile(false);
                        }}
                      >
                        <Icon />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2 pb-3 pt-2">
        <SidebarSeparator className="mx-1 mb-2" />
        <SidebarMenu className="gap-1.5">
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="h-11 rounded-xl px-3">
              <Image
                src="https://images.unsplash.com/photo-1531539134685-27d854339120?w=40&h=40&fit=crop&crop=face"
                alt="Maya"
                width={32}
                height={32}
                className="size-8 rounded-lg object-cover"
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Maya Chen</span>
                <span className="truncate text-xs text-muted-foreground">Pro Plan</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="h-10 rounded-xl px-3 text-[13px] font-medium"
            >
              <LogOut />
              <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </AppSidebar>
  );
}
