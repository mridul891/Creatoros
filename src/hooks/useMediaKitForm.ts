"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import posthog from "posthog-js"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { saveMediaKitAction } from "@/app/actions/mediaKitActions"
import { type MediaKitFormData, mediaKitFormSchema } from "@/schemas/mediaKit"
import type { MediaKitPageProps } from "@/types/media-kit-page"
import { mergeMediaKitWithCreatorDefaults } from "@/utils/mediaKitMappers"

export function useMediaKitForm(
  creatorsDetails: MediaKitPageProps["creatorsDetails"],
  mediaKit: MediaKitPageProps["mediaKit"]
) {
  const router = useRouter()
  const form = useForm<MediaKitFormData>({
    resolver: zodResolver(mediaKitFormSchema),
    defaultValues: mergeMediaKitWithCreatorDefaults(creatorsDetails, mediaKit),
    mode: "onBlur",
  })

  async function onSubmit(data: MediaKitFormData) {
    const result = await saveMediaKitAction(data)

    if (!result.success) {
      toast.error(result.message ?? "Could not save media kit.")
      return
    }

    posthog.capture("media_kit_saved", {
      is_new_media_kit: mediaKit === null,
      deliverable_count: data.rates.deliverables.length,
      work_item_count: data.work.items.length,
    })
    toast.success(result.message ?? "Media kit saved.")
    router.refresh()
  }

  return {
    form,
    onSubmit,
  }
}
