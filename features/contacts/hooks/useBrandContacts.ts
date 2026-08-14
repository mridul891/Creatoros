"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { listContactsByBrandAction } from "@/features/contacts/actions/contactActions"
import type { ContactFilter } from "@/features/contacts/enums/contact"
import type {
  ContactListData,
  ContactListItem,
} from "@/features/contacts/types/contact"

type UseBrandContactsOptions = {
  brandId: string
  initialData: ContactListData
}

export function useBrandContacts({
  brandId,
  initialData,
}: UseBrandContactsOptions) {
  const [contacts, setContacts] = useState<ContactListItem[]>(initialData.items)
  const [total, setTotal] = useState(initialData.total)
  const [search, setSearch] = useState(initialData.filters.search)
  const [status, setStatus] = useState<ContactFilter>(
    initialData.filters.status
  )
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState("")
  const hasHydratedRef = useRef(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const refetch = useCallback(
    async (nextSearch: string, nextStatus: ContactFilter) => {
      setIsLoading(true)
      const result = await listContactsByBrandAction({
        brandId,
        search: nextSearch,
        status: nextStatus,
      })
      setIsLoading(false)

      if (!result.success || !result.data) {
        setLoadError(result.message ?? "Could not load contacts.")
        return
      }

      setLoadError("")
      setContacts(result.data.items)
      setTotal(result.data.total)
    },
    [brandId]
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
      void refetch(search.trim(), status)
    }, 250)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [refetch, search, status])

  return {
    contacts,
    total,
    search,
    status,
    isLoading,
    loadError,
    setSearch,
    setStatus,
    setContacts,
    setTotal,
    refetch,
  }
}
