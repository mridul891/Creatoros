"use client"

import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { buildDealWorkspaceUrl } from "@/lib/crm/deals/dealWorkspaceUrl"
import { DEAL_WORKSPACE_TAB_DEFINITIONS, isDealWorkspaceTab, type DealWorkspaceTab } from "@/lib/crm/deals/dealWorkspaceTabs"

type DealWorkspaceTabsProps = {
  dealId: string
  activeTab: DealWorkspaceTab
  taskCount: number
  deliverableCount: number
  renderTabContent: (tab: DealWorkspaceTab) => ReactNode
}

export function DealWorkspaceTabs({ dealId, activeTab, taskCount, deliverableCount, renderTabContent }: DealWorkspaceTabsProps) {
  const router = useRouter()

  function handleTabChange(nextTab: string) {
    const tab = isDealWorkspaceTab(nextTab) ? nextTab : "overview"
    router.replace(buildDealWorkspaceUrl({ dealId, tab }))
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="h-9 rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] p-1">
        {DEAL_WORKSPACE_TAB_DEFINITIONS.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} className="h-7 rounded-[8px] px-3 text-[11px] data-[state=active]:text-[#E8402A]">
            {tab.label}
            {tab.id === "tasks" ? ` (${taskCount})` : ""}
            {tab.id === "deliverables" ? ` (${deliverableCount})` : ""}
          </TabsTrigger>
        ))}
      </TabsList>

      {DEAL_WORKSPACE_TAB_DEFINITIONS.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-4">
          {tab.isPlaceholder ? (
            <Card className="rounded-[20px] border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-6">
              <h2 className="text-lg font-bold text-white">{tab.label}</h2>
              <p className="mt-2 text-[13px] text-[rgba(255,255,255,0.6)]">{tab.label} module is planned and architecture-ready.</p>
            </Card>
          ) : (
            renderTabContent(tab.id)
          )}
        </TabsContent>
      ))}
    </Tabs>
  )
}
