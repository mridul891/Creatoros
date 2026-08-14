"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { listBrandActivitiesAction } from "@/app/action/activityActions"
import type { ActivityListData, ActivityListItem } from "@/types/activity"

type UseBrandActivityOptions = {
  brandId: string
  initialData: ActivityListData
}

export function useBrandActivity({
  brandId,
  initialData,
}: UseBrandActivityOptions) {
  const [activities, setActivities] = useState<ActivityListItem[]>(
    initialData.items
  )
  const [pagination, setPagination] = useState(initialData.pagination)
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState("")
  const hasHydratedRef = useRef(false)

  const refetch = useCallback(
    async (nextPage: number) => {
      setIsLoading(true)
      const result = await listBrandActivitiesAction({
        brandId,
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
    [brandId, pagination.pageSize]
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
