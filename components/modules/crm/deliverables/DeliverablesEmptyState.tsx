"use client"

import { CrmEmptyStateClient } from "../shared"

type DeliverablesEmptyStateProps = {
  onCreate: () => void
}

export function DeliverablesEmptyState({
  onCreate,
}: DeliverablesEmptyStateProps) {
  return (
    <CrmEmptyStateClient
      title="No deliverables yet"
      description="Track brand-facing campaign outputs and approvals from this workspace."
      actionLabel="Add Deliverable"
      onAction={onCreate}
    />
  )
}
