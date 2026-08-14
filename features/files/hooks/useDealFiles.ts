"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { listDealFilesAction } from "@/features/files/actions/fileActions"
import type { DealFileCategory } from "@/features/files/enums/dealFile"
import type {
  DealFileListData,
  DealFileListItem,
} from "@/features/files/types/dealFile"

type UseDealFilesOptions = {
  dealId: string
  initialData: DealFileListData
}

export function useDealFiles({ dealId, initialData }: UseDealFilesOptions) {
  const [files, setFiles] = useState<DealFileListItem[]>(initialData.items)
  const [pagination, setPagination] = useState(initialData.pagination)
  const [search, setSearch] = useState(initialData.filters.search)
  const [archive, setArchive] = useState<"active" | "archived">(
    initialData.filters.archive
  )
  const [category, setCategory] = useState<DealFileCategory | "all">(
    initialData.filters.category ?? "all"
  )
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState("")
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasHydratedRef = useRef(false)

  useEffect(() => {
    setFiles(initialData.items)
    setPagination(initialData.pagination)
    setSearch(initialData.filters.search)
    setArchive(initialData.filters.archive)
    setCategory(initialData.filters.category ?? "all")
    setLoadError("")
    setIsLoading(false)
    hasHydratedRef.current = false
  }, [initialData])

  const refetch = useCallback(
    async (nextPage = 1) => {
      setIsLoading(true)
      const result = await listDealFilesAction({
        dealId,
        search: search.trim() || undefined,
        archive,
        category: category === "all" ? undefined : category,
        page: nextPage,
      })
      setIsLoading(false)

      if (!result.success || !result.data) {
        setLoadError(result.message ?? "Could not load files.")
        return
      }

      setLoadError("")
      setFiles(result.data.items)
      setPagination(result.data.pagination)
    },
    [archive, category, dealId, search]
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
    files,
    pagination,
    search,
    archive,
    category,
    isLoading,
    loadError,
    setSearch,
    setArchive,
    setCategory,
    setPage: (page: number) => refetch(page),
    refetch,
  }
}
