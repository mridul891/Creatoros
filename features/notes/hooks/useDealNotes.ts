"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { listDealNotesAction } from "@/features/notes/actions/noteActions"
import type {
  DealNoteListData,
  DealNoteListItem,
} from "@/features/notes/types/dealNote"

type UseDealNotesOptions = {
  dealId: string
  initialData: DealNoteListData
}

export function useDealNotes({ dealId, initialData }: UseDealNotesOptions) {
  const [notes, setNotes] = useState<DealNoteListItem[]>(initialData.items)
  const [pagination, setPagination] = useState(initialData.pagination)
  const [search, setSearch] = useState(initialData.filters.search)
  const [archive, setArchive] = useState<"active" | "archived">(
    initialData.filters.archive
  )
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState("")
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasHydratedRef = useRef(false)

  useEffect(() => {
    setNotes(initialData.items)
    setPagination(initialData.pagination)
    setSearch(initialData.filters.search)
    setArchive(initialData.filters.archive)
    setLoadError("")
    setIsLoading(false)
    hasHydratedRef.current = false
  }, [initialData])

  const refetch = useCallback(
    async (nextPage = 1) => {
      setIsLoading(true)
      const result = await listDealNotesAction({
        dealId,
        search: search.trim() || undefined,
        archive,
        page: nextPage,
      })
      setIsLoading(false)

      if (!result.success || !result.data) {
        setLoadError(result.message ?? "Could not load notes.")
        return
      }

      setLoadError("")
      setNotes(result.data.items)
      setPagination(result.data.pagination)
    },
    [archive, dealId, search]
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
    notes,
    pagination,
    search,
    archive,
    isLoading,
    loadError,
    setSearch,
    setArchive,
    setPage: (page: number) => refetch(page),
    refetch,
  }
}
