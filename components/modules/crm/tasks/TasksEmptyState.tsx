"use client"

import { ClipboardIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { CrmEmptyStateClient } from "../shared"

type TasksEmptyStateProps = {
  hasFilters: boolean
  isReadOnly?: boolean
  onCreate: () => void
}

export function TasksEmptyState({
  hasFilters,
  isReadOnly = false,
  onCreate,
}: TasksEmptyStateProps) {
  const canCreate = !hasFilters && !isReadOnly

  return (
    <CrmEmptyStateClient
      icon={<HugeiconsIcon icon={ClipboardIcon} size={18} />}
      title={hasFilters ? "No matching tasks" : "No tasks yet"}
      description={
        hasFilters
          ? "Try clearing a filter or updating your search to find more tasks."
          : isReadOnly
            ? "This archived deal is read-only. Restore the deal to create new tasks."
            : "Create your first internal task to track campaign execution from brief to publish."
      }
      actionLabel={canCreate ? "Create Task" : undefined}
      onAction={canCreate ? onCreate : undefined}
    />
  )
}
