"use client"

import { useFormContext } from "react-hook-form"
import { MediaKitAudienceSection } from "@/components/media-kit/MediaKitAudienceSection"
import { MediaKitContactSection } from "@/components/media-kit/MediaKitContactSection"
import { MediaKitFormSubmitFooter } from "@/components/media-kit/MediaKitFormSubmitFooter"
import { MediaKitProfileSection } from "@/components/media-kit/MediaKitProfileSection"
import { MediaKitRatesSection } from "@/components/media-kit/MediaKitRatesSection"
import { MediaKitStatsSection } from "@/components/media-kit/MediaKitStatsSection"
import { MediaKitWorkSection } from "@/components/media-kit/MediaKitWorkSection"
import { Separator } from "@/components/ui/separator"
import type { MediaKitFormData } from "@/schemas/mediaKit"

type MediaKitFormProps = {
  onSubmit: (data: MediaKitFormData) => Promise<void>
}

export function MediaKitForm({ onSubmit }: MediaKitFormProps) {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useFormContext<MediaKitFormData>()

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
  )
}
