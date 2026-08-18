"use client";

import { Separator } from "@/components/ui/separator";
import { MediaKitAudienceSection } from "@/features/media-kit/components/form/MediaKitAudienceSection";
import { MediaKitContactSection } from "@/features/media-kit/components/form/MediaKitContactSection";
import { MediaKitFormSubmitFooter } from "@/features/media-kit/components/form/MediaKitFormSubmitFooter";
import { MediaKitProfileSection } from "@/features/media-kit/components/form/MediaKitProfileSection";
import { MediaKitRatesSection } from "@/features/media-kit/components/form/MediaKitRatesSection";
import { MediaKitStatsSection } from "@/features/media-kit/components/form/MediaKitStatsSection";
import { MediaKitWorkSection } from "@/features/media-kit/components/form/MediaKitWorkSection";
import type { MediaKitFormData } from "@/features/media-kit/schema";
import { useFormContext } from "react-hook-form";

type MediaKitFormProps = {
  onSubmit: (data: MediaKitFormData) => Promise<void>;
};

export function MediaKitForm({ onSubmit }: MediaKitFormProps) {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useFormContext<MediaKitFormData>();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex min-h-full flex-col"
      noValidate
    >
      <div className="flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="space-y-1">
          <h1 className="font-heading font-semibold text-xl tracking-tight">
            Edit media kit
          </h1>
          <p className="text-muted-foreground text-sm">
            Update your profile, stats, and rates. Changes reflect in the live
            preview on the right.
          </p>
        </header>

        <Separator />

        <div className="flex flex-col gap-4">
          <MediaKitProfileSection />
          <MediaKitStatsSection />
          <MediaKitAudienceSection />
          <MediaKitWorkSection />
          <MediaKitRatesSection />
          <MediaKitContactSection />
        </div>
      </div>
      <MediaKitFormSubmitFooter isSubmitting={isSubmitting} />
    </form>
  );
}
