import type { BrandListItem } from "@/types/brand"

export type BrandFormValues = {
  name: string
  category: string
  website: string
  primaryContactName: string
  primaryContactEmail: string
  notes: string
}

export const EMPTY_BRAND_FORM: BrandFormValues = {
  name: "",
  category: "",
  website: "",
  primaryContactName: "",
  primaryContactEmail: "",
  notes: "",
}

export function brandToFormValues(
  brand: Pick<BrandListItem, keyof BrandFormValues>
): BrandFormValues {
  return {
    name: brand.name,
    category: brand.category ?? "",
    website: brand.website ?? "",
    primaryContactName: brand.primaryContactName ?? "",
    primaryContactEmail: brand.primaryContactEmail ?? "",
    notes: brand.notes ?? "",
  }
}

export function buildBrandFormData(values: BrandFormValues, brandId?: string) {
  const formData = new FormData()
  if (brandId) {
    formData.set("brandId", brandId)
  }
  formData.set("name", values.name)
  formData.set("category", values.category)
  formData.set("website", values.website)
  formData.set("primaryContactName", values.primaryContactName)
  formData.set("primaryContactEmail", values.primaryContactEmail)
  formData.set("notes", values.notes)
  return formData
}
