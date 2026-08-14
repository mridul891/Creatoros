import { Clock01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { CrmEmptyState } from "@/components/shared/crm"

export function ActivityTimelineEmptyState() {
  return (
    <CrmEmptyState
      title="No activity yet"
      description="Important updates for this brand will appear here automatically."
      icon={<HugeiconsIcon icon={Clock01Icon} size={18} />}
      className="py-10"
    />
  )
}
