"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
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

    toast.success(result.message ?? "Media kit saved.")
    router.refresh()
  }

  return {
    form,
    onSubmit,
  }
}
