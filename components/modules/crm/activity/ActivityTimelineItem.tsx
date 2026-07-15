import { Archive, CurrencyDollar, BuildingOffice, PencilSimpleLine, PlusCircle, Star, UserCircle } from "@phosphor-icons/react/dist/ssr"

import { Badge } from "@/components/ui/badge"
import { formatRelativeTime } from "@/lib/format/date"
import type { ActivityListItem } from "@/types/activity"

type ActivityTimelineItemProps = {
  item: ActivityListItem
  isLast: boolean
}

function getActivityIcon(type: ActivityListItem["type"]) {
  switch (type) {
    case "BrandCreated":
    case "ContactCreated":
      return <PlusCircle size={14} />
    case "BrandUpdated":
    case "ContactUpdated":
      return <PencilSimpleLine size={14} />
    case "BrandArchived":
    case "ContactArchived":
      return <Archive size={14} />
    case "ContactPrimaryChanged":
      return <Star size={14} />
    case "DealCreated":
      return <PlusCircle size={14} />
    case "DealUpdated":
      return <PencilSimpleLine size={14} />
    case "DealStageChanged":
      return <CurrencyDollar size={14} />
    case "DealArchived":
      return <Archive size={14} />
    case "DealRestored":
      return <Star size={14} />
    default:
      return <UserCircle size={14} />
  }
}

function getActivityBadge(type: ActivityListItem["type"]) {
  switch (type) {
    case "BrandCreated":
    case "BrandUpdated":
    case "BrandArchived":
      return "Brand"
    case "ContactCreated":
    case "ContactUpdated":
    case "ContactArchived":
    case "ContactPrimaryChanged":
      return "Contact"
    case "DealCreated":
    case "DealUpdated":
    case "DealStageChanged":
    case "DealArchived":
    case "DealRestored":
      return "Deal"
    default:
      return "Activity"
  }
}

export function ActivityTimelineItem({ item, isLast }: ActivityTimelineItemProps) {
  return (
    <li className="relative pl-12">
      <div className="absolute top-1 left-0 flex w-8 justify-center">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.72)]">
          {item.entityType === "Brand" ? <BuildingOffice size={14} /> : getActivityIcon(item.type)}
        </span>
      </div>

      {!isLast ? (
        <span className="absolute top-9 left-[15px] h-[calc(100%-6px)] w-px bg-[rgba(255,255,255,0.08)]" />
      ) : null}

      <div className="rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.03)] px-2 py-0.5 text-[10px] tracking-wide text-[rgba(255,255,255,0.72)]"
          >
            {getActivityBadge(item.type)}
          </Badge>
          <p className="font-mono text-[11px] text-[rgba(255,255,255,0.45)]">{formatRelativeTime(item.createdAt)}</p>
        </div>

        <p className="mt-2 text-[14px] font-semibold text-white">{item.title}</p>
        {item.description ? <p className="mt-1 text-[13px] text-[rgba(255,255,255,0.65)]">{item.description}</p> : null}
      </div>
    </li>
  )
}
