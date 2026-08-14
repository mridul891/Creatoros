"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { listDealActivitiesAction } from "@/app/action/activityActions"
import type { ActivityListData, ActivityListItem } from "@/types/activity"

type UseDealActivityOptions = {
  dealId: string
  initialData: ActivityListData
}

export function useDealActivity({
  dealId,
  initialData,
}: UseDealActivityOptions) {
  const [activities, setActivities] = useState<ActivityListItem[]>(
    initialData.items
  )
  const [pagination, setPagination] = useState(initialData.pagination)
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState("")
  const hasHydratedRef = useRef(false)

  useEffect(() => {
    setActivities(initialData.items)
    setPagination(initialData.pagination)
    setLoadError("")
    setIsLoading(false)
    hasHydratedRef.current = false
  }, [initialData])

  const refetch = useCallback(
    async (nextPage: number) => {
      setIsLoading(true)
      const result = await listDealActivitiesAction({
        dealId,
        page: nextPage,
        pageSize: pagination.pageSize,
      })
      setIsLoading(false)

      if (!result.success || !result.data) {
        setLoadError(result.message ?? "Could not load activities.")
        return
      }

      setLoadError("")
      setActivities(result.data.items)
      setPagination(result.data.pagination)
    },
    [dealId, pagination.pageSize]
  )

  useEffect(() => {
    if (!hasHydratedRef.current) {
      hasHydratedRef.current = true
      return
    }

    void refetch(pagination.page)
  }, [pagination.page, refetch])

  return {
    activities,
    pagination,
    isLoading,
    loadError,
    setPage: (page: number) => {
      setPagination((previous) => ({
        ...previous,
        page,
      }))
    },
    refetch,
  }
}
