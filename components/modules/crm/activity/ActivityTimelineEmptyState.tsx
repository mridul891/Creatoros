"use client"

import { History } from "lucide-react"

import { CrmEmptyState } from "@/components/modules/crm/shared"

export function ActivityTimelineEmptyState() {
  return (
    <CrmEmptyState
      title="No activity yet"
      description="Important updates for this brand will appear here automatically."
      icon={<History size={18} />}
      className="py-10"
    />
  )
}
