"use client";

import {
  Agreement02Icon,
  ArrowLeftDoubleIcon,
  BarChartIcon,
  Building03Icon,
  Calendar03Icon,
  File02Icon,
  FileCodeIcon,
  GridViewIcon,
  Logout01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";

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
import { DashboardRoute } from "@/enums/dashboard-route";
import { signOut } from "@/lib/insforge/auth-actions";

type UserInfo = {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
};

type NavItem = {
  href: DashboardRoute;
  label: string;
  icon: typeof GridViewIcon;
};

const NAV_ITEMS: readonly NavItem[] = [
  // {
  //   href: DashboardRoute.ROOT,
  //   label: "Dashboard",
  //   icon: GridViewIcon,
  // },
  // {
  //   href: DashboardRoute.CALENDAR,
  //   label: "Calendar",
  //   icon: Calendar03Icon,
  // },
  // {
  //   href: DashboardRoute.BRANDS,
  //   label: "Brands",
  //   icon: Building03Icon,
  // },
  // {
  //   href: DashboardRoute.PIPELINE,
  //   label: "Content Pipeline",
  //   icon: BarChartIcon,
  // },
  // {
  //   href: DashboardRoute.DEALS,
  //   label: "Deals",
  //   icon: Agreement02Icon,
  // },
  // {
  //   href: DashboardRoute.INVOICES,
  //   label: "Invoices",
  //   icon: File02Icon,
  // },
  {
    href: DashboardRoute.MEDIA_KIT,
    label: "Media Kit",
    icon: SparklesIcon,
  },
  // {
  //   href: DashboardRoute.SCRIPTS,
  //   label: "Scripts",
  //   icon: FileCodeIcon,
  // },
] as const;

/**
 * Routes where child routes should also mark the parent navigation item active.
 */
const NESTED_ROUTES = new Set<DashboardRoute>([
  DashboardRoute.BRANDS,
  DashboardRoute.DEALS,
]);

function isNavItemActive(pathname: string, href: DashboardRoute): boolean {
  if (href === DashboardRoute.ROOT) {
    return pathname === href;
  }

  if (NESTED_ROUTES.has(href)) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return pathname === href;
}

function getInitials(name: string | null): string {
  const initials = (name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "U";
}

type SidebarProps = {
  data: UserInfo;
};

export function Sidebar({ data }: SidebarProps) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile, state } = useSidebar();
  const [isPending, startTransition] = useTransition();

  const closeMobileSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, setOpenMobile]);

  const handleSignOut = useCallback(() => {
    if (isPending) {
      return;
    }

    startTransition(async () => {
      try {
        await signOut();
      } catch (error) {
        console.error("Failed to sign out:", error);
      }
    });
  }, [isPending]);

  const userInitials = getInitials(data.name);

  return (
    <AppSidebar variant="inset" collapsible="icon" aria-label="Main navigation">
      <SidebarHeader className="px-3 py-3">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <SidebarMenu className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                size="lg"
                tooltip="Dashboard"
                className="h-11 rounded-xl px-2.5"
              >
                <Link
                  href={DashboardRoute.ROOT}
                  onClick={closeMobileSidebar}
                  aria-label="Go to dashboard"
                  className="flex min-w-0 items-center gap-2"
                >
                  <span className="truncate font-semibold text-[15px] text-foreground tracking-[-0.01em]">
                    !yetlaunched
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarTrigger
            className="relative z-20 size-9 shrink-0 rounded-lg text-foreground hover:bg-muted hover:text-foreground"
            title={
              state === "collapsed" ? "Expand sidebar" : "Collapse sidebar"
            }
            aria-label={
              state === "collapsed" ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            <HugeiconsIcon
              icon={ArrowLeftDoubleIcon}
              aria-hidden="true"
              className={`size-4 transition-transform duration-200 ${
                state === "collapsed" ? "rotate-180" : ""
              }`}
            />
          </SidebarTrigger>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup className="py-2">
          <SidebarGroupLabel className="px-3 pb-1 font-semibold text-[11px] text-sidebar-foreground/55 uppercase tracking-[0.06em]">
            Workspace
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {NAV_ITEMS.map(({ href, label, icon }) => {
                const active = isNavItemActive(pathname, href);

                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={label}
                      className="h-10 rounded-xl px-3 font-medium text-[13px] data-[active=true]:bg-black data-[active=true]:text-white dark:data-[active=true]:bg-white dark:data-[active=true]:text-black"
                    >
                      <Link
                        href={href}
                        onClick={closeMobileSidebar}
                        aria-current={active ? "page" : undefined}
                      >
                        <HugeiconsIcon icon={icon} aria-hidden="true" />
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

      <SidebarFooter className="px-2 pt-2 pb-3">
        <SidebarSeparator className="mx-1 mb-2" />

        <SidebarMenu className="gap-1.5">
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip={`${data.name} — ${data.email}`}
              className="h-12 rounded-xl px-3"
            >
              {data.avatarUrl ? (
                <Image
                  src={data.avatarUrl}
                  alt=""
                  width={32}
                  height={32}
                  className="size-8 shrink-0 rounded-lg object-cover"
                  priority
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted font-semibold text-xs"
                >
                  {userInitials}
                </span>
              )}

              <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{data.name}</span>
                <span className="truncate text-muted-foreground text-xs">
                  {data.email}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              type="button"
              onClick={handleSignOut}
              disabled={isPending}
              tooltip="Sign out"
              className="h-10 rounded-xl px-3 font-medium text-[13px]"
            >
              <HugeiconsIcon icon={Logout01Icon} aria-hidden="true" />

              <span>{isPending ? "Signing out..." : "Sign out"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </AppSidebar>
  );
}
