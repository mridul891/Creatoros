"use client";

import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MediaKitArrayItemCard } from "@/features/media-kit/components/form/MediaKitArrayItemCard";
import { MediaKitFormSection } from "@/features/media-kit/components/form/MediaKitFormSection";
import type { MediaKitFormData } from "@/features/media-kit/schema";
import { countSectionErrors } from "@/features/media-kit/utils/mediaKitFormErrors";

export function MediaKitWorkSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<MediaKitFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "work.items",
  });

  return (
    <MediaKitFormSection
      step={4}
      title="Previous work"
      description="Showcase campaigns and content that represent your best brand collaborations."
      errorCount={countSectionErrors(errors, "work")}
    >
      <div className="space-y-4">
        {fields.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No work items yet. Add your best-performing collaborations.
          </p>
        ) : null}

        {fields.map((field, index) => (
          <MediaKitArrayItemCard
            key={field.id}
            onRemove={() => remove(index)}
            removeLabel="Remove work"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field className="sm:col-span-2">
                <FieldLabel>Title</FieldLabel>
                <Input
                  {...register(`work.items.${index}.title`)}
                  placeholder="Campaign name"
                  aria-invalid={Boolean(errors.work?.items?.[index]?.title)}
                />
                <FieldError>
                  {errors.work?.items?.[index]?.title?.message}
                </FieldError>
              </Field>

              <Field className="sm:col-span-2">
                <FieldLabel>URL</FieldLabel>
                <Input
                  {...register(`work.items.${index}.url`)}
                  placeholder="https://instagram.com/reel/..."
                  aria-invalid={Boolean(errors.work?.items?.[index]?.url)}
                />
                <FieldError>
                  {errors.work?.items?.[index]?.url?.message}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel>Views</FieldLabel>
                <Input
                  type="number"
                  min={0}
                  {...register(`work.items.${index}.views`, {
                    valueAsNumber: true,
                  })}
                  placeholder="100000"
                  aria-invalid={Boolean(errors.work?.items?.[index]?.views)}
                />
                <FieldError>
                  {errors.work?.items?.[index]?.views?.message}
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
              url: "",
              views: 0,
            })
          }
        >
          <HugeiconsIcon icon={Add01Icon} className="size-3.5" />
          Add work
        </Button>
      </div>

      <Field>
        <FieldLabel>Brands you&apos;ve worked with</FieldLabel>
        <Textarea
          rows={3}
          {...register("work.brandsWorkedWith")}
          placeholder="Nykaa, Mamaearth, Myntra"
          aria-invalid={Boolean(errors.work?.brandsWorkedWith)}
        />
        <FieldDescription>Comma separated.</FieldDescription>
        <FieldError>{errors.work?.brandsWorkedWith?.message}</FieldError>
      </Field>
    </MediaKitFormSection>
  );
}
