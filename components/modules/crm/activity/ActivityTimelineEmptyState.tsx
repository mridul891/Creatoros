import { ClockCounterClockwise } from "@phosphor-icons/react/dist/ssr"

import { CrmEmptyState } from "@/components/modules/crm/shared"

export function ActivityTimelineEmptyState() {
  return (
    <CrmEmptyState
      title="No activity yet"
      description="Important updates for this brand will appear here automatically."
      icon={<ClockCounterClockwise size={18} />}
      className="py-10"
    />
  )
}
