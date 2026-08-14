import type { DealWorkspaceTab } from "@/lib/crm/deals/dealWorkspaceTabs"

type BuildDealWorkspaceUrlOptions = {
  dealId: string
  tab?: DealWorkspaceTab
}

export function buildDealWorkspaceUrl({
  dealId,
  tab,
}: BuildDealWorkspaceUrlOptions) {
  const params = new URLSearchParams()
  if (tab && tab !== "overview") {
    params.set("tab", tab)
  }
  const query = params.toString()
  return query
    ? `/dashboard/deals/${dealId}?${query}`
    : `/dashboard/deals/${dealId}`
}
