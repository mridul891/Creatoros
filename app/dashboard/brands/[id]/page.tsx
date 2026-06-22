import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { listBrandActivitiesAction } from "@/app/action/activityActions"
import { getBrandAction } from "@/app/action/brandActions"
import { listContactsByBrandAction } from "@/app/action/contactActions"
import { BrandDetailPage } from "@/components/modules/crm/brands/BrandDetailPage"

type DashboardBrandDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

export const metadata: Metadata = {
  title: "Brand Details",
}

export default async function DashboardBrandDetailPage({ params }: DashboardBrandDetailPageProps) {
  const { id } = await params
  const [result, contactsResult, activitiesResult] = await Promise.all([
    getBrandAction(id),
    listContactsByBrandAction({
      brandId: id,
      status: "active",
    }),
    listBrandActivitiesAction({
      brandId: id,
    }),
  ])

  if (!result.success) {
    notFound()
  }

  return (
    <BrandDetailPage
      brand={result.data}
      contactsData={
        contactsResult.success && contactsResult.data
          ? contactsResult.data
          : {
              items: [],
              total: 0,
              filters: {
                search: "",
                status: "active",
              },
            }
      }
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
                brandId: id,
              },
            }
      }
    />
  )
}
