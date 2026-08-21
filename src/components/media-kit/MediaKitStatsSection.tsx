"use client"

import { useFormContext, useWatch } from "react-hook-form"
import { MediaKitFormSection } from "@/components/media-kit/MediaKitFormSection"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { MediaKitFormData } from "@/schemas/mediaKit"
import { countSectionErrors } from "@/utils/mediaKitFormErrors"
import { formatCompactNumber, getEngagementRate } from "@/utils/mediaKitStats"

export function MediaKitStatsSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<MediaKitFormData>()

  const watchedStats = useWatch({
    control,
    name: "stats",
  })

  const engagementRate = getEngagementRate(
    watchedStats?.followers ?? 0,
    watchedStats?.avgLikes ?? 0,
    watchedStats?.avgComments ?? 0,
    watchedStats?.engagementRate ?? 0
  )

  return (
    <MediaKitFormSection
      step={2}
      title="Numbers"
      description="Enter your latest Instagram insights manually. These update your live preview."
      errorCount={countSectionErrors(errors, "stats")}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>Followers</FieldLabel>
          <Input
            type="number"
            min={0}
            {...register("stats.followers", { valueAsNumber: true })}
            placeholder="250000"
            aria-invalid={Boolean(errors.stats?.followers)}
          />
          <FieldError>{errors.stats?.followers?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Avg reel views</FieldLabel>
          <Input
            type="number"
            min={0}
            {...register("stats.avgReelViews", { valueAsNumber: true })}
            placeholder="52300"
            aria-invalid={Boolean(errors.stats?.avgReelViews)}
          />
          <FieldError>{errors.stats?.avgReelViews?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Avg likes per reel</FieldLabel>
          <Input
            type="number"
            min={0}
            {...register("stats.avgLikes", { valueAsNumber: true })}
            placeholder="15000"
            aria-invalid={Boolean(errors.stats?.avgLikes)}
          />
          <FieldError>{errors.stats?.avgLikes?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Avg comments</FieldLabel>
          <Input
            type="number"
            min={0}
            {...register("stats.avgComments", { valueAsNumber: true })}
            placeholder="8000"
            aria-invalid={Boolean(errors.stats?.avgComments)}
          />
          <FieldError>{errors.stats?.avgComments?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Avg story views</FieldLabel>
          <Input
            type="number"
            min={0}
            {...register("stats.avgStoryViews", { valueAsNumber: true })}
            placeholder="50000"
            aria-invalid={Boolean(errors.stats?.avgStoryViews)}
          />
          <FieldError>{errors.stats?.avgStoryViews?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Engagement % override</FieldLabel>
          <Input
            type="number"
            min={0}
            max={100}
            step="0.01"
            {...register("stats.engagementRate", { valueAsNumber: true })}
            placeholder="Leave blank to auto-calculate"
            aria-invalid={Boolean(errors.stats?.engagementRate)}
          />
          <FieldDescription>
            Optional. Overrides the calculated engagement rate.
          </FieldDescription>
          <FieldError>{errors.stats?.engagementRate?.message}</FieldError>
        </Field>
      </div>

      {(watchedStats?.followers ?? 0) > 0 ? (
        <Alert className="border-violet-200 bg-violet-50 text-violet-950">
          <AlertDescription>
            Engagement rate:{" "}
            <span className="font-medium">{engagementRate.toFixed(1)}%</span> (
            {formatCompactNumber(watchedStats?.avgLikes ?? 0)} likes +{" "}
            {formatCompactNumber(watchedStats?.avgComments ?? 0)} comments /{" "}
            {formatCompactNumber(watchedStats?.followers ?? 0)} followers).
          </AlertDescription>
        </Alert>
      ) : null}
    </MediaKitFormSection>
  )
}
