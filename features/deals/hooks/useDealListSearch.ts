"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { buildDealsUrl } from "@/features/deals/utils/dealsUrl"

type UseDealListSearchOptions = {
  initialSearch: string
  view: string
  archive: string
  stage?: string
  priority?: string
  brandId?: string
  sort: string
}

export function useDealListSearch({
  initialSearch,
  view,
  archive,
  stage,
  priority,
  brandId,
  sort,
}: UseDealListSearchOptions) {
  const router = useRouter()
  const [search, setSearch] = useState(initialSearch)
  const hasMountedRef = useRef(false)

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }
    if (search.trim() === initialSearch.trim()) {
      return
    }

    const timeout = setTimeout(() => {
      router.replace(
        buildDealsUrl({
          search,
          view,
          archive,
          stage,
          priority,
          brandId,
          sort,
          page: 1,
        })
      )
    }, 300)

    return () => clearTimeout(timeout)
  }, [
    archive,
    brandId,
    initialSearch,
    priority,
    router,
    search,
    sort,
    stage,
    view,
  ])

  return {
    search,
    setSearch,
  }
}
