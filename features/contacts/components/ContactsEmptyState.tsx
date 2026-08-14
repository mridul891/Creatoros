"use client"

import { CrmEmptyStateClient } from "@/components/shared/crm"

type ContactsEmptyStateProps = {
  isSearch: boolean
  status: "active" | "archived"
  onCreate: () => void
}

export function ContactsEmptyState({
  isSearch,
  status,
  onCreate,
}: ContactsEmptyStateProps) {
  return (
    <CrmEmptyStateClient
      title={
        isSearch
          ? "No contacts match your filters"
          : status === "archived"
            ? "No archived contacts"
            : "No contacts yet"
      }
      description={
        isSearch
          ? "Try another name, email, or position."
          : status === "archived"
            ? "Archived contacts appear here for historical context."
            : "Add your first contact for this brand to keep outreach and negotiation ownership clear."
      }
      actionLabel={!isSearch && status === "active" ? "Add Contact" : undefined}
      onAction={!isSearch && status === "active" ? onCreate : undefined}
      className="rounded-[16px] px-6 py-10"
    />
  )
}
