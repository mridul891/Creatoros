import type { Metadata } from "next"

import { listBrandsAction } from "@/app/action/brandActions"
import { BrandsPage } from "@/components/modules/crm/brands/BrandsPage"

type DashboardBrandsPageProps = {
  searchParams: Promise<{
    search?: string
    page?: string
  }>
}

export const metadata: Metadata = {
  title: "Brands",
  alternates: {
    canonical: "/dashboard/brands",
  },
}

export default async function DashboardBrandsPage({ searchParams }: DashboardBrandsPageProps) {
  const params = await searchParams
  const search = params.search ?? ""
  const page = Number(params.page ?? 1)
  const result = await listBrandsAction({
    search,
    page,
  })

  if (!result.success || !result.data) {
    return (
      <div className="w-full max-w-[960px] px-9 py-7">
        <div className="rounded-[18px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] px-6 py-12">
          <h1 className="text-xl font-bold text-white">Could not load brands</h1>
          <p className="mt-2 text-[13px] text-[rgba(255,255,255,0.5)]">
            {result.message ?? "Please refresh and try again."}
          </p>
        </div>
      </div>
    )
  }

  return <BrandsPage listData={result.data} initialSearch={search} />
}
