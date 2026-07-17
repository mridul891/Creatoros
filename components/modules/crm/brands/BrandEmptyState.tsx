"use client"

import { CrmEmptyStateClient } from "../shared"

type BrandEmptyStateProps = {
  isSearch: boolean
  onCreate: () => void
}

export function BrandEmptyState({ isSearch, onCreate }: BrandEmptyStateProps) {
  return (
    <CrmEmptyStateClient
      title={isSearch ? "No brands match this search" : "No brands yet"}
      description={
        isSearch
          ? "Try a different keyword or clear the search input."
          : "Create your first brand to track sponsors, contacts, and opportunities in one place."
      }
      actionLabel={isSearch ? undefined : "Create Brand"}
      onAction={isSearch ? undefined : onCreate}
      className="border-border bg-card"
    />
  )
}
