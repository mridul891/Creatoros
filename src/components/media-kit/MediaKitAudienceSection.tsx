"use client"

import { useFormContext, useWatch } from "react-hook-form"
import { MediaKitFormSection } from "@/components/media-kit/MediaKitFormSection"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { MediaKitFormData } from "@/schemas/mediaKit"
import { countSectionErrors } from "@/utils/mediaKitFormErrors"

export function MediaKitAudienceSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<MediaKitFormData>()

  const watchedAudience = useWatch({
    control,
    name: "audience",
  })

  const womenPercentage = watchedAudience?.womenPercentage ?? 0
  const menPercentage = Math.max(0, 100 - womenPercentage)

  return (
    <MediaKitFormSection
      step={3}
      title="Audience"
      description="Demographics you share with brands. This data rarely changes."
      errorCount={countSectionErrors(errors, "audience")}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>Top age group</FieldLabel>
          <Input
            {...register("audience.topAgeGroups")}
            placeholder="25-34"
            aria-invalid={Boolean(errors.audience?.topAgeGroups)}
          />
          <FieldError>{errors.audience?.topAgeGroups?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Women %</FieldLabel>
          <Input
            type="number"
            min={0}
            max={100}
            step="0.01"
            {...register("audience.womenPercentage", {
              valueAsNumber: true,
            })}
            placeholder="48"
            aria-invalid={Boolean(errors.audience?.womenPercentage)}
          />
          <FieldError>{errors.audience?.womenPercentage?.message}</FieldError>
        </Field>
      </div>

      {womenPercentage > 0 ? (
        <Alert className="border-violet-200 bg-violet-50 text-violet-950">
          <AlertDescription>
            Audience:{" "}
            <span className="font-medium">{womenPercentage}% women</span> ·{" "}
            <span className="font-medium">{menPercentage}% men</span>
          </AlertDescription>
        </Alert>
      ) : null}
    </MediaKitFormSection>
  )
}
