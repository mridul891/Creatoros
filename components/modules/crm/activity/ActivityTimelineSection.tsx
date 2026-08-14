"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { useBrandActivity } from "@/hooks/useBrandActivity"
import type { ActivityListData } from "@/types/activity"
import { CrmPagination } from "../shared"
import { ActivityTimeline } from "./ActivityTimeline"
import { ActivityTimelineEmptyState } from "./ActivityTimelineEmptyState"
import { ActivityTimelineSkeleton } from "./ActivityTimelineSkeleton"

type ActivityTimelineSectionProps = {
  brandId: string
  initialData: ActivityListData
  title?: string
}

export function ActivityTimelineSection({
  brandId,
  initialData,
  title = "Recent Activity",
}: ActivityTimelineSectionProps) {
  const { activities, pagination, isLoading, loadError, setPage } =
    useBrandActivity({
      brandId,
      initialData,
    })

  return (
    <div className="mt-6 rounded-[20px] border border-border bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-bold text-foreground text-lg">{title}</h2>
          <p className="mt-1 text-[12px] text-muted-foreground">
            {pagination.total}{" "}
            {pagination.total === 1 ? "activity" : "activities"}
          </p>
        </div>
      </div>

      {loadError ? (
        <Alert
          variant="destructive"
          className="mt-4 border-[rgba(232,64,42,0.35)] bg-[rgba(232,64,42,0.1)]"
        >
          <AlertDescription className="text-[#E8402A] text-[12px]">
            {loadError}
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="mt-4">
        {isLoading ? (
          <ActivityTimelineSkeleton />
        ) : activities.length === 0 ? (
          <ActivityTimelineEmptyState />
        ) : (
          <ActivityTimeline items={activities} />
        )}
      </div>

      {pagination.totalPages > 1 ? (
        <CrmPagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      ) : null}
    </div>
  )
}
