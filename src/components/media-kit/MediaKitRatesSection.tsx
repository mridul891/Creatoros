"use client"

import { Add01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"
import { MediaKitArrayItemCard } from "@/components/media-kit/MediaKitArrayItemCard"
import { MediaKitFormSection } from "@/components/media-kit/MediaKitFormSection"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { MEDIA_KIT_CURRENCIES } from "@/config/mediaKitForm"
import type { MediaKitFormData } from "@/schemas/mediaKit"
import { countSectionErrors } from "@/utils/mediaKitFormErrors"

export function MediaKitRatesSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<MediaKitFormData>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rates.deliverables",
  })

  return (
    <MediaKitFormSection
      step={5}
      title="Rates"
      description="Define your pricing so brands know what to expect before reaching out."
      errorCount={countSectionErrors(errors, "rates")}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>Currency</FieldLabel>
          <Controller
            control={control}
            name="rates.currency"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {MEDIA_KIT_CURRENCIES.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError>{errors.rates?.currency?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Rate per 1K followers</FieldLabel>
          <Input
            type="number"
            min={0}
            step="0.01"
            {...register("rates.ratePerThousand", { valueAsNumber: true })}
            placeholder="500"
            aria-invalid={Boolean(errors.rates?.ratePerThousand)}
          />
          <FieldError>{errors.rates?.ratePerThousand?.message}</FieldError>
        </Field>
      </div>

      <Separator />

      <div className="space-y-3">
        <FieldLegend variant="label">What the brand is asking for</FieldLegend>

        <div className="space-y-3 rounded-lg border bg-muted/30 p-3">
          <div className="flex items-start gap-3">
            <Controller
              control={control}
              name="rates.addOns.paidAdUsage.enabled"
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-1"
                />
              )}
            />
            <div className="min-w-0 flex-1 space-y-2">
              <div>
                <p className="font-medium text-sm">Paid ad usage</p>
                <p className="text-muted-foreground text-xs">
                  Your content used in their advertising, not just posted on
                  your page.
                </p>
              </div>
              <Controller
                control={control}
                name="rates.addOns.paidAdUsage.durationMonths"
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={(value) =>
                      field.onChange(Number(value) as 1 | 3 | 6 | 12)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">For 1 month (+25%)</SelectItem>
                      <SelectItem value="3">For 3 months (+50%)</SelectItem>
                      <SelectItem value="6">For 6 months (+80%)</SelectItem>
                      <SelectItem value="12">For 1 year (+120%)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Controller
              control={control}
              name="rates.addOns.noCompetitorWork.enabled"
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-1"
                />
              )}
            />
            <div className="min-w-0 flex-1 space-y-2">
              <div>
                <p className="font-medium text-sm">
                  No competitor collaborations
                </p>
                <p className="text-muted-foreground text-xs">
                  You agree not to work with similar brands for a while.
                </p>
              </div>
              <Controller
                control={control}
                name="rates.addOns.noCompetitorWork.durationMonths"
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={(value) =>
                      field.onChange(Number(value) as 3 | 6)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">For 3 months (+30%)</SelectItem>
                      <SelectItem value="6">For 6 months (+60%)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Controller
              control={control}
              name="rates.addOns.adsFromHandle.enabled"
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-1"
                />
              )}
            />
            <div>
              <p className="font-medium text-sm">Ads from your handle</p>
              <p className="text-muted-foreground text-xs">
                Ads that look like they came from your account. Usually called
                whitelisting. (+30%)
              </p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <FieldLegend variant="label">Deliverables</FieldLegend>
        <FieldDescription>
          List each offering with its base price. Add-ons are calculated in the
          preview automatically.
        </FieldDescription>

        {fields.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No deliverables yet. Add items like reels, stories, or posts.
          </p>
        ) : null}

        {fields.map((field, index) => (
          <MediaKitArrayItemCard
            key={field.id}
            onRemove={() => remove(index)}
            removeLabel="Remove deliverable"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Deliverable</FieldLabel>
                <Input
                  {...register(`rates.deliverables.${index}.title`)}
                  placeholder="1 reel"
                  aria-invalid={Boolean(
                    errors.rates?.deliverables?.[index]?.title
                  )}
                />
                <FieldError>
                  {errors.rates?.deliverables?.[index]?.title?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>Base price</FieldLabel>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  {...register(`rates.deliverables.${index}.price`, {
                    valueAsNumber: true,
                  })}
                  placeholder="1900"
                  aria-invalid={Boolean(
                    errors.rates?.deliverables?.[index]?.price
                  )}
                />
                <FieldError>
                  {errors.rates?.deliverables?.[index]?.price?.message}
                </FieldError>
              </Field>
            </div>
          </MediaKitArrayItemCard>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              title: "",
              price: 0,
            })
          }
        >
          <HugeiconsIcon icon={Add01Icon} className="size-3.5" />
          Add deliverable
        </Button>
      </div>

      <Field>
        <FieldLabel>Payment terms</FieldLabel>
        <Textarea
          rows={3}
          {...register("rates.paymentTerms")}
          placeholder="e.g., 50% advance"
          aria-invalid={Boolean(errors.rates?.paymentTerms)}
        />
        <FieldError>{errors.rates?.paymentTerms?.message}</FieldError>
      </Field>
    </MediaKitFormSection>
  )
}
