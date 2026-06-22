"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

type UseDealListSearchOptions = {
  initialSearch: string
  view: string
  archive: string
  stage?: string
  priority?: string
  brandId?: string
  sort: string
}

export function useDealListSearch({ initialSearch, view, archive, stage, priority, brandId, sort }: UseDealListSearchOptions) {
  const router = useRouter()
  const [search, setSearch] = useState(initialSearch)
  const hasMountedRef = useRef(false)

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }

    const timeout = setTimeout(() => {
      const params = new URLSearchParams()
      if (search.trim()) {
        params.set("search", search.trim())
      }
      if (view) {
        params.set("view", view)
      }
      if (archive) {
        params.set("archive", archive)
      }
      if (stage) {
        params.set("stage", stage)
      }
      if (priority) {
        params.set("priority", priority)
      }
      if (brandId) {
        params.set("brandId", brandId)
      }
      if (sort) {
        params.set("sort", sort)
      }
      params.set("page", "1")

      router.replace(`/dashboard/deals?${params.toString()}`)
    }, 300)

    return () => clearTimeout(timeout)
  }, [archive, brandId, priority, router, search, sort, stage, view])

  return {
    search,
    setSearch,
  }
}
