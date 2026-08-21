import type { FieldError, FieldErrors } from "react-hook-form"

import type { MediaKitFormData } from "@/schemas/mediaKit"

function countNestedErrors(error: unknown): number {
  if (!error || typeof error !== "object") {
    return 0
  }

  if ("message" in error && typeof (error as FieldError).message === "string") {
    return 1
  }

  if (Array.isArray(error)) {
    return error.reduce<number>((sum, item) => sum + countNestedErrors(item), 0)
  }

  return Object.values(error).reduce<number>(
    (sum, value) => sum + countNestedErrors(value),
    0
  )
}

export function countSectionErrors(
  errors: FieldErrors<MediaKitFormData>,
  sectionKey: keyof MediaKitFormData
): number {
  const sectionErrors = errors[sectionKey]
  if (!sectionErrors) {
    return 0
  }

  return countNestedErrors(sectionErrors)
}

export function hasSectionErrors(
  errors: FieldErrors<MediaKitFormData>,
  sectionKey: keyof MediaKitFormData
): boolean {
  return countSectionErrors(errors, sectionKey) > 0
}
