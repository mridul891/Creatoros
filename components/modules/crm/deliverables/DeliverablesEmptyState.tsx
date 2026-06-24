import { CrmEmptyState } from "../shared"

type DeliverablesEmptyStateProps = {
  onCreate: () => void
}

export function DeliverablesEmptyState({ onCreate }: DeliverablesEmptyStateProps) {
  return (
    <CrmEmptyState
      title="No deliverables yet"
      description="Track brand-facing campaign outputs and approvals from this workspace."
      actionLabel="Add Deliverable"
      onAction={onCreate}
    />
  )
}
