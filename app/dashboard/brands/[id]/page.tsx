import type { Metadata } from "next"
import { notFound } from "next/navigation"

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
  const [result, contactsResult] = await Promise.all([
    getBrandAction(id),
    listContactsByBrandAction({
      brandId: id,
      status: "active",
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
    />
  )
}
