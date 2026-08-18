"use client";

import { FormProvider } from "react-hook-form";

import { MediaKitForm } from "@/features/media-kit/components/MediaKitForm";
import { MediaKitPreview } from "@/features/media-kit/components/preview/MediaKitPreview";
import { useMediaKitForm } from "@/features/media-kit/hooks/useMediaKitForm";
import type { MediaKitPageProps } from "@/features/media-kit/types/media-kit-page";

export function MediaKitPageClient({
  creatorsDetails,
  mediaKit,
}: MediaKitPageProps) {
  const { form, onSubmit } = useMediaKitForm(creatorsDetails, mediaKit);

  return (
    <FormProvider {...form}>
      <main className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-2">
        <section className="min-h-0 min-w-0 overflow-y-auto border-r bg-muted/20">
          <MediaKitForm onSubmit={onSubmit} />
        </section>

        <section className="min-h-0 min-w-0 overflow-y-auto bg-background p-4 sm:p-6">
          <MediaKitPreview />
        </section>
      </main>
    </FormProvider>
  );
}
