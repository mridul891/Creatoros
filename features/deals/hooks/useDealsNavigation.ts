"use client"

import { useRouter } from "next/navigation"
import type { DealListData } from "@/features/deals/types/deal"
import { buildDealsUrl } from "@/features/deals/utils/dealsUrl"

type DealsFilterPatch = Partial<{
  search: string
  view: string
  archive: string
  stage: string | undefined
  priority: string | undefined
  brandId: string | undefined
  sort: string
}>

export function useDealsNavigation(filters: DealListData["filters"]) {
  const router = useRouter()

  function navigateWith(nextFilters: DealsFilterPatch) {
    router.push(
      buildDealsUrl({
        search: "search" in nextFilters ? nextFilters.search : filters.search,
        view: "view" in nextFilters ? nextFilters.view : filters.view,
        archive:
          "archive" in nextFilters ? nextFilters.archive : filters.archive,
        stage: "stage" in nextFilters ? nextFilters.stage : filters.stage,
        priority:
          "priority" in nextFilters ? nextFilters.priority : filters.priority,
        brandId:
          "brandId" in nextFilters ? nextFilters.brandId : filters.brandId,
        sort: "sort" in nextFilters ? nextFilters.sort : filters.sort,
        page: 1,
      })
    )
  }

  function navigateToPage(page: number) {
    router.push(
      buildDealsUrl({
        search: filters.search,
        view: filters.view,
        archive: filters.archive,
        stage: filters.stage,
        priority: filters.priority,
        brandId: filters.brandId,
        sort: filters.sort,
        page,
      })
    )
  }

  return {
    navigateWith,
    navigateToPage,
    refresh: () => router.refresh(),
  }
}
