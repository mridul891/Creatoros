"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { saveMediaKitAction } from "@/features/media-kit/actions/mediaKitActions";
import {
  mediaKitFormSchema,
  type MediaKitFormData,
} from "@/features/media-kit/schema";
import type { MediaKitPageProps } from "@/features/media-kit/types/media-kit-page";
import { mergeMediaKitWithCreatorDefaults } from "@/features/media-kit/utils/mediaKitMappers";

export function useMediaKitForm(
  creatorsDetails: MediaKitPageProps["creatorsDetails"],
  mediaKit: MediaKitPageProps["mediaKit"]
) {
  const router = useRouter();
  const form = useForm<MediaKitFormData>({
    resolver: zodResolver(mediaKitFormSchema),
    defaultValues: mergeMediaKitWithCreatorDefaults(creatorsDetails, mediaKit),
    mode: "onBlur",
  });

  async function onSubmit(data: MediaKitFormData) {
    const result = await saveMediaKitAction(data);

    if (!result.success) {
      toast.error(result.message ?? "Could not save media kit.");
      return;
    }

    toast.success(result.message ?? "Media kit saved.");
    router.refresh();
  }

  return {
    form,
    onSubmit,
  };
}
