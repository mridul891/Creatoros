import type { Metadata } from "next"

import { listDealsAction, listDealFormOptionsAction } from "@/app/action/dealActions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DealsPageServer } from "@/components/modules/crm/deals/DealsPageServer"

export const metadata: Metadata = {
  title: "Deals",
  alternates: {
    canonical: "/dashboard/deals",
  },
}

type DashboardDealsPageProps = {
  searchParams: Promise<{
    search?: string
    stage?: string
    priority?: string
    brandId?: string
    archive?: string
    sort?: string
    view?: string
    fromDate?: string
    toDate?: string
    page?: string
    pageSize?: string
  }>
}

export default async function DashboardDealsPage({ searchParams }: DashboardDealsPageProps) {
  const params = await searchParams
  const page = Number(params.page ?? 1)
  const pageSize = params.pageSize ? Number(params.pageSize) : undefined

  const [listResult, optionsResult] = await Promise.all([
    listDealsAction({
      search: params.search,
      stage: params.stage,
      priority: params.priority,
      brandId: params.brandId,
      archive: params.archive,
      sort: params.sort,
      view: params.view,
      fromDate: params.fromDate,
      toDate: params.toDate,
      page,
      pageSize,
    }),
    listDealFormOptionsAction(),
  ])

  if (!listResult.success || !listResult.data || !optionsResult.success || !optionsResult.data) {
    return (
      <div className="w-full max-w-[960px] px-9 py-7">
        <Alert className="rounded-[18px] border-border bg-card px-6 py-12">
          <AlertTitle className="text-xl font-bold text-foreground">Could not load deals</AlertTitle>
          <AlertDescription className="mt-2 text-[13px] text-muted-foreground">
            {listResult.message ?? optionsResult.message ?? "Please refresh and try again."}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <DealsPageServer
      listData={listResult.data}
      brands={optionsResult.data.brands}
      contactsByBrand={optionsResult.data.contactsByBrand}
    />
  )
}
