"use client"

import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DEAL_WORKSPACE_TAB_DEFINITIONS,
  type DealWorkspaceTab,
  isDealWorkspaceTab,
} from "@/lib/crm/deals/dealWorkspaceTabs"
import { buildDealWorkspaceUrl } from "@/lib/crm/deals/dealWorkspaceUrl"

type DealWorkspaceTabsProps = {
  dealId: string
  activeTab: DealWorkspaceTab
  taskCount: number
  deliverableCount: number
  renderTabContent: (tab: DealWorkspaceTab) => ReactNode
}

export function DealWorkspaceTabs({
  dealId,
  activeTab,
  taskCount,
  deliverableCount,
  renderTabContent,
}: DealWorkspaceTabsProps) {
  const router = useRouter()

  function handleTabChange(nextTab: string) {
    const tab = isDealWorkspaceTab(nextTab) ? nextTab : "overview"
    router.replace(buildDealWorkspaceUrl({ dealId, tab }))
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="h-9 rounded-[10px] border border-border bg-muted p-1">
        {DEAL_WORKSPACE_TAB_DEFINITIONS.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="h-7 rounded-[8px] px-3 text-[11px] data-[state=active]:text-[#E8402A]"
          >
            {tab.label}
            {tab.id === "tasks" ? ` (${taskCount})` : ""}
            {tab.id === "deliverables" ? ` (${deliverableCount})` : ""}
          </TabsTrigger>
        ))}
      </TabsList>

      {DEAL_WORKSPACE_TAB_DEFINITIONS.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-4">
          {tab.isPlaceholder ? (
            <Card className="rounded-[20px] border-border bg-card p-6">
              <h2 className="font-bold text-foreground text-lg">{tab.label}</h2>
              <p className="mt-2 text-[13px] text-muted-foreground">
                {tab.label} module is planned and architecture-ready.
              </p>
            </Card>
          ) : (
            renderTabContent(tab.id)
          )}
        </TabsContent>
      ))}
    </Tabs>
  )
}
