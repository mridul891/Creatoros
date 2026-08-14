"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { listDealTasksAction } from "@/app/action/taskActions"
import type {
  TaskArchiveFilter,
  TaskDueDateFilter,
  TaskPriority,
  TaskSortOption,
  TaskStatus,
} from "@/enums/task"
import type { TaskListData, TaskListItem } from "@/types/task"

type UseDealTasksOptions = {
  dealId: string
  initialData: TaskListData
}

export function useDealTasks({ dealId, initialData }: UseDealTasksOptions) {
  const [tasks, setTasks] = useState<TaskListItem[]>(initialData.items)
  const [pagination, setPagination] = useState(initialData.pagination)
  const [summary, setSummary] = useState(initialData.summary)
  const [search, setSearch] = useState(initialData.filters.search)
  const [status, setStatus] = useState<TaskStatus | "all">(
    initialData.filters.status ?? "all"
  )
  const [priority, setPriority] = useState<TaskPriority | "all">(
    initialData.filters.priority ?? "all"
  )
  const [archive, setArchive] = useState<TaskArchiveFilter>(
    initialData.filters.archive
  )
  const [dueDate, setDueDate] = useState<TaskDueDateFilter>(
    initialData.filters.dueDate
  )
  const [sort, setSort] = useState<TaskSortOption>(initialData.filters.sort)
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState("")
  const hasHydratedRef = useRef(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setTasks(initialData.items)
    setPagination(initialData.pagination)
    setSummary(initialData.summary)
    setSearch(initialData.filters.search)
    setStatus(initialData.filters.status ?? "all")
    setPriority(initialData.filters.priority ?? "all")
    setArchive(initialData.filters.archive)
    setDueDate(initialData.filters.dueDate)
    setSort(initialData.filters.sort)
    setLoadError("")
    setIsLoading(false)
    hasHydratedRef.current = false
  }, [initialData])

  const refetch = useCallback(
    async (nextPage = 1) => {
      setIsLoading(true)
      const result = await listDealTasksAction({
        dealId,
        search: search.trim() || undefined,
        status: status === "all" ? undefined : status,
        priority: priority === "all" ? undefined : priority,
        archive,
        dueDate,
        sort,
        page: nextPage,
      })
      setIsLoading(false)

      if (!result.success || !result.data) {
        setLoadError(result.message ?? "Could not load tasks.")
        return
      }

      setLoadError("")
      setTasks(result.data.items)
      setPagination(result.data.pagination)
      setSummary(result.data.summary)
    },
    [archive, dealId, dueDate, priority, search, sort, status]
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

  async function setPage(nextPage: number) {
    await refetch(nextPage)
  }

  return {
    tasks,
    pagination,
    summary,
    search,
    status,
    priority,
    archive,
    dueDate,
    sort,
    isLoading,
    loadError,
    setTasks,
    setSummary,
    setSearch,
    setStatus,
    setPriority,
    setArchive,
    setDueDate,
    setSort,
    setPage,
    refetch,
  }
}
