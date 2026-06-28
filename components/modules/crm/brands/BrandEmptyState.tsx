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
      className="border-[rgba(255,255,255,0.07)] bg-[#0D0D0D]"
    />
  )
}
