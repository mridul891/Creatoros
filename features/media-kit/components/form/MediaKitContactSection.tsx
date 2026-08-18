"use client";

import { useFormContext } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { MediaKitFormSection } from "@/features/media-kit/components/form/MediaKitFormSection";
import type { MediaKitFormData } from "@/features/media-kit/schema";
import { countSectionErrors } from "@/features/media-kit/utils/mediaKitFormErrors";

export function MediaKitContactSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<MediaKitFormData>();

  return (
    <MediaKitFormSection
      step={6}
      title="Contact"
      description="How brands can reach you after viewing your media kit."
      errorCount={countSectionErrors(errors, "contactInfo")}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field className="sm:col-span-2">
          <FieldLabel>Email</FieldLabel>
          <Input
            type="email"
            {...register("contactInfo.email")}
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.contactInfo?.email)}
          />
          <FieldError>{errors.contactInfo?.email?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Phone</FieldLabel>
          <Input
            {...register("contactInfo.phone")}
            placeholder="+91 98765 43210"
            aria-invalid={Boolean(errors.contactInfo?.phone)}
          />
          <FieldError>{errors.contactInfo?.phone?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Website</FieldLabel>
          <Input
            {...register("contactInfo.website")}
            placeholder="https://yoursite.com"
            aria-invalid={Boolean(errors.contactInfo?.website)}
          />
          <FieldError>{errors.contactInfo?.website?.message}</FieldError>
        </Field>
      </div>
    </MediaKitFormSection>
  );
}
