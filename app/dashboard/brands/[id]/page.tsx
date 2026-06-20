import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getBrandAction } from "@/app/action/brandActions"
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
  const result = await getBrandAction(id)

  if (!result.success) {
    notFound()
  }

  return <BrandDetailPage brand={result.data} />
}
