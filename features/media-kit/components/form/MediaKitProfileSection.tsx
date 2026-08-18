"use client";

import { Controller, useFormContext } from "react-hook-form";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MEDIA_KIT_CATEGORY_LABELS,
  MEDIA_KIT_CREATOR_CATEGORIES,
} from "@/features/media-kit/constants/mediaKitForm";
import { MediaKitFormSection } from "@/features/media-kit/components/form/MediaKitFormSection";
import type { MediaKitFormData } from "@/features/media-kit/schema";
import { countSectionErrors } from "@/features/media-kit/utils/mediaKitFormErrors";

export function MediaKitProfileSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<MediaKitFormData>();

  return (
    <MediaKitFormSection
      step={1}
      title="Profile"
      description="Your public identity — name, handle, and category brands see first."
      errorCount={countSectionErrors(errors, "profile")}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field className="sm:col-span-2">
          <FieldLabel>Creator name</FieldLabel>
          <Input
            {...register("profile.name")}
            placeholder="Mridul Pandey"
            aria-invalid={Boolean(errors.profile?.name)}
          />
          <FieldError>{errors.profile?.name?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Handle</FieldLabel>
          <Input
            {...register("profile.handle")}
            placeholder="@crytek"
            aria-invalid={Boolean(errors.profile?.handle)}
          />
          <FieldError>{errors.profile?.handle?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Category</FieldLabel>
          <Controller
            control={control}
            name="profile.category"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {MEDIA_KIT_CREATOR_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {MEDIA_KIT_CATEGORY_LABELS[category]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError>{errors.profile?.category?.message}</FieldError>
        </Field>

        <Field className="sm:col-span-2">
          <FieldLabel>One line about you</FieldLabel>
          <Input
            {...register("profile.bio")}
            placeholder="Short intro brands see on your kit"
            aria-invalid={Boolean(errors.profile?.bio)}
          />
          <FieldError>{errors.profile?.bio?.message}</FieldError>
        </Field>

        <Field className="sm:col-span-2">
          <FieldLabel>Avatar URL</FieldLabel>
          <Input
            {...register("profile.avatarUrl")}
            placeholder="https://..."
            aria-invalid={Boolean(errors.profile?.avatarUrl)}
          />
          <FieldDescription>
            Optional. Paste a direct link to your profile photo.
          </FieldDescription>
          <FieldError>{errors.profile?.avatarUrl?.message}</FieldError>
        </Field>
      </div>
    </MediaKitFormSection>
  );
}
