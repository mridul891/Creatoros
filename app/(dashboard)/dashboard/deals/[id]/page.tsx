import type { Metadata } from "next"

import { getDealAction } from "@/features/deals/actions/dealActions"
import { DealDetailPageServer } from "@/features/deals/components/DealDetailPageServer"
import {
  type DealWorkspaceTab,
  isDealWorkspaceTab,
} from "@/features/deals/utils/dealWorkspaceTabs"

type DashboardDealDetailPageProps = {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    tab?: string
  }>
}

export async function generateMetadata({
  params,
}: DashboardDealDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const dealResult = await getDealAction(id)
  if (!dealResult.success) {
    return { title: "Deal Details" }
  }
  return {
    title: `${dealResult.data.campaignName} · Deal Details`,
  }
}

export default async function DashboardDealDetailPage({
  params,
  searchParams,
}: DashboardDealDetailPageProps) {
  const { id } = await params
  const search = await searchParams
  const initialTab: DealWorkspaceTab = isDealWorkspaceTab(search.tab)
    ? search.tab
    : "overview"

  return <DealDetailPageServer dealId={id} initialTab={initialTab} />
}
