"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { listDealDeliverablesAction } from "@/app/action/deliverableActions"
import type { DeliverableStatus } from "@/enums/deliverable"
import type {
  DeliverableListData,
  DeliverableListItem,
} from "@/types/deliverable"

type UseDealDeliverablesOptions = {
  dealId: string
  initialData: DeliverableListData
}

export function useDealDeliverables({
  dealId,
  initialData,
}: UseDealDeliverablesOptions) {
  const [deliverables, setDeliverables] = useState<DeliverableListItem[]>(
    initialData.items
  )
  const [pagination, setPagination] = useState(initialData.pagination)
  const [summary, setSummary] = useState(initialData.summary)
  const [search, setSearch] = useState(initialData.filters.search)
  const [status, setStatus] = useState<DeliverableStatus | "all">(
    initialData.filters.status ?? "all"
  )
  const [platform, setPlatform] = useState(
    initialData.filters.platform ?? "all"
  )
  const [archive, setArchive] = useState<"active" | "archived">(
    initialData.filters.archive
  )
  const [sort, setSort] = useState<
    "order" | "dueDate" | "updatedAt" | "status"
  >(initialData.filters.sort)
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState("")
  const hasHydratedRef = useRef(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setDeliverables(initialData.items)
    setPagination(initialData.pagination)
    setSummary(initialData.summary)
    setSearch(initialData.filters.search)
    setStatus(initialData.filters.status ?? "all")
    setPlatform(initialData.filters.platform ?? "all")
    setArchive(initialData.filters.archive)
    setSort(initialData.filters.sort)
    setLoadError("")
    setIsLoading(false)
    hasHydratedRef.current = false
  }, [initialData])

  const refetch = useCallback(
    async (nextPage = 1) => {
      setIsLoading(true)
      const result = await listDealDeliverablesAction({
        dealId,
        search: search.trim() || undefined,
        status: status === "all" ? undefined : status,
        platform: platform === "all" ? undefined : platform,
        archive,
        sort,
        page: nextPage,
      })
      setIsLoading(false)

      if (!result.success || !result.data) {
        setLoadError(result.message ?? "Could not load deliverables.")
        return
      }

      setLoadError("")
      setDeliverables(result.data.items)
      setPagination(result.data.pagination)
      setSummary(result.data.summary)
    },
    [archive, dealId, platform, search, sort, status]
  )

  useEffect(() => {
    if (!hasHydratedRef.current) {
      hasHydratedRef.current = true
      return
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      void refetch(1)
    }, 250)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [refetch])

  return {
    deliverables,
    pagination,
    summary,
    search,
    status,
    platform,
    archive,
    sort,
    isLoading,
    loadError,
    setDeliverables,
    setSearch,
    setStatus,
    setPlatform,
    setArchive,
    setSort,
    setPage: (page: number) => refetch(page),
    refetch,
  }
}
