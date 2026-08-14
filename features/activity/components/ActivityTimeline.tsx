import type { ActivityListItem } from "@/features/activity/types/activity"
import { ActivityTimelineItem } from "./ActivityTimelineItem"

type ActivityTimelineProps = {
  items: ActivityListItem[]
}

export function ActivityTimeline({ items }: ActivityTimelineProps) {
  return (
    <ul className="space-y-4">
      {items.map((item, index) => (
        <ActivityTimelineItem
          key={item.id}
          item={item}
          isLast={index === items.length - 1}
        />
      ))}
    </ul>
  )
}
