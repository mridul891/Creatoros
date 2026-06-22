import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { listDealActivitiesAction } from "@/app/action/activityActions"
import { getDealAction, listDealFormOptionsAction } from "@/app/action/dealActions"
import { DealDetailPage } from "@/components/modules/crm/deals/DealDetailPage"

type DashboardDealDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: DashboardDealDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const dealResult = await getDealAction(id)
  if (!dealResult.success) {
    return { title: "Deal Details" }
  }
  return {
    title: `${dealResult.data.campaignName} · Deal Details`,
  }
}

export default async function DashboardDealDetailPage({ params }: DashboardDealDetailPageProps) {
  const { id } = await params

  const [dealResult, activitiesResult, optionsResult] = await Promise.all([
    getDealAction(id),
    listDealActivitiesAction({ dealId: id }),
    listDealFormOptionsAction(),
  ])

  if (!dealResult.success || !optionsResult.success || !optionsResult.data) {
    notFound()
  }

  return (
    <DealDetailPage
      deal={dealResult.data}
      activityError={activitiesResult.success ? undefined : activitiesResult.message ?? "Could not load deal timeline activities."}
      activityData={
        activitiesResult.success && activitiesResult.data
          ? activitiesResult.data
          : {
              items: [],
              pagination: {
                page: 1,
                pageSize: 20,
                total: 0,
                totalPages: 1,
              },
              filters: {
                dealId: id,
              },
            }
      }
      brands={optionsResult.data.brands}
      contacts={optionsResult.data.contactsByBrand[dealResult.data.brandId] ?? []}
    />
  )
}
