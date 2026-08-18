"use client";

import { useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { MediaKitActionsBar } from "@/features/media-kit/components/MediaKitActionsBar";
import { MediaKitPreviewContent } from "@/features/media-kit/components/preview/MediaKitPreviewContent";
import type { MediaKitFormData } from "@/features/media-kit/schema";
import { MEDIA_KIT_FORM_DEFAULT_VALUES } from "@/features/media-kit/utils/mediaKitFormDefaults";

export function MediaKitPreview() {
  const { control } = useFormContext<MediaKitFormData>();
  const kitRef = useRef<HTMLElement>(null);

  const profile = useWatch({ control, name: "profile" });
  const stats = useWatch({ control, name: "stats" });
  const audience = useWatch({ control, name: "audience" });
  const work = useWatch({ control, name: "work" });
  const rates = useWatch({ control, name: "rates" });
  const contactInfo = useWatch({ control, name: "contactInfo" });

  const data: MediaKitFormData = {
    profile: profile ?? MEDIA_KIT_FORM_DEFAULT_VALUES.profile,
    stats: stats ?? MEDIA_KIT_FORM_DEFAULT_VALUES.stats,
    audience: audience ?? MEDIA_KIT_FORM_DEFAULT_VALUES.audience,
    work: work ?? MEDIA_KIT_FORM_DEFAULT_VALUES.work,
    rates: rates ?? MEDIA_KIT_FORM_DEFAULT_VALUES.rates,
    contactInfo: contactInfo ?? MEDIA_KIT_FORM_DEFAULT_VALUES.contactInfo,
  };

  const handle = data.profile.handle.trim();
  const displayName = data.profile.name.trim() || "media-kit";

  return (
    <div className="space-y-4">
      <MediaKitActionsBar
        handle={handle}
        displayName={displayName}
        kitRef={kitRef}
      />
      <MediaKitPreviewContent
        data={data}
        showPreviewLabel
        kitRef={kitRef}
      />
    </div>
  );
}
