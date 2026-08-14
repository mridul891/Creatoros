"use client"

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
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTransition } from "react"
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
} from "@/components/ui/sidebar"
import { DashboardRoute } from "@/enums/dashboard-route"
import { signOut } from "@/lib/inforge/auth-actions"

const NAV_ITEMS = [
  { href: DashboardRoute.ROOT, label: "Dashboard", icon: GridViewIcon },
  { href: DashboardRoute.CALENDAR, label: "Calendar", icon: Calendar03Icon },
  { href: DashboardRoute.BRANDS, label: "Brands", icon: Building03Icon },
  {
    href: DashboardRoute.PIPELINE,
    label: "Content Pipeline",
    icon: BarChartIcon,
  },
  { href: DashboardRoute.DEALS, label: "Deal", icon: Agreement02Icon },
  { href: DashboardRoute.INVOICES, label: "Invoices", icon: File02Icon },
  { href: DashboardRoute.MEDIA_KIT, label: "Media Kit", icon: SparklesIcon },
  { href: DashboardRoute.SCRIPTS, label: "Scripts", icon: FileCodeIcon },
]

function isNavItemActive(pathname: string, href: DashboardRoute) {
  if (href === DashboardRoute.ROOT) {
    return pathname === href
  }

  if (href === DashboardRoute.DEALS || href === DashboardRoute.BRANDS) {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return pathname === href
}

export function Sidebar() {
  const pathname = usePathname()
  const { isMobile, setOpenMobile, state } = useSidebar()
  const [isPending, startTransition] = useTransition()

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut()
    })
  }

  return (
    <AppSidebar variant="inset" collapsible="icon">
      <SidebarHeader className="px-3 py-3">
        <div className="flex items-center gap-2">
          <SidebarMenu className="min-w-0 flex-1">
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="h-11 rounded-xl px-2.5"
                asChild
              >
                <Link
                  href={DashboardRoute.ROOT}
                  className="flex min-w-0 items-center gap-2"
                  onClick={() => {
                    if (isMobile) setOpenMobile(false)
                  }}
                >
                  <span className="truncate text-center font-semibold text-[15px] text-foreground tracking-[-0.01em] group-data-[collapsible=icon]:hidden">
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
          >
            <HugeiconsIcon
              icon={ArrowLeftDoubleIcon}
              className={`size-4 transition-transform`}
            />
            <span className="sr-only">Toggle sidebar</span>
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
                const active = isNavItemActive(pathname, href)
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      isActive={active}
                      asChild
                      tooltip={label}
                      className="h-10 rounded-xl px-3 font-medium text-[13px] data-[active=true]:bg-black data-[active=true]:text-white"
                    >
                      <Link
                        href={href}
                        onClick={() => {
                          if (isMobile) setOpenMobile(false)
                        }}
                      >
                        <HugeiconsIcon icon={icon} />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2 pt-2 pb-3">
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
                <span className="truncate text-muted-foreground text-xs">
                  Pro Plan
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              disabled={isPending}
              className="h-10 rounded-xl px-3 font-medium text-[13px]"
            >
              <HugeiconsIcon icon={Logout01Icon} />
              <span>{isPending ? "Signing out..." : "Sign out"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </AppSidebar>
  )
}
