"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export function useBrandListSearch(initialSearch: string) {
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
      params.set("page", "1")

      const query = params.toString()
      router.replace(query ? `/dashboard/brands?${query}` : "/dashboard/brands")
    }, 300)

    return () => clearTimeout(timeout)
  }, [router, search])

  return {
    search,
    setSearch,
  }
}
