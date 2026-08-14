"use server"

import { revalidatePath } from "next/cache"
import { requireOnboardedUser } from "@/lib/auth/require-user"
import {
  BrandServiceError,
  createBrand,
  deleteBrand,
  getBrand,
  listBrands,
  updateBrand,
} from "@/lib/crm/brands/brandService"
import { brandCreateUpdateSchema } from "@/lib/crm/brands/brandValidation"
import { getFieldErrors } from "@/lib/crm/shared/action"
import { sanitizeOptionalString } from "@/lib/crm/shared/form"
import type { BrandField, BrandListData } from "@/types/brand"

export type BrandMutationResult = {
  success: boolean
  message?: string
  data?: {
    id: string
    name: string
  }
  fieldErrors?: Partial<Record<BrandField, string>>
}

export type BrandListResult = {
  success: boolean
  message?: string
  data?: BrandListData
}

type BrandGetResult =
  | {
      success: true
      data: {
        id: string
        name: string
        category: string | null
        website: string | null
        primaryContactName: string | null
        primaryContactEmail: string | null
        notes: string | null
        createdAt: Date
        updatedAt: Date
      }
    }
  | {
      success: false
      message: string
    }

function mapBrandServiceError(error: unknown): BrandMutationResult | null {
  if (!(error instanceof BrandServiceError)) {
    return null
  }

  if (error.code === "DUPLICATE" && error.field) {
    return {
      success: false,
      message: "A brand with this name already exists.",
      fieldErrors: {
        [error.field]: error.message,
      },
    }
  }

  return {
    success: false,
    message: error.message,
  }
}

export async function listBrandsAction(input?: {
  search?: string
  page?: number
  pageSize?: number
}): Promise<BrandListResult> {
  const user = await requireOnboardedUser()

  try {
    const data = await listBrands(user.id, input)
    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("brands.list_failed", { userId: user.id, error })
    return {
      success: false,
      message: "We could not load your brands. Please try again.",
    }
  }
}

export async function getBrandAction(brandId: string): Promise<BrandGetResult> {
  const user = await requireOnboardedUser()

  try {
    const brand = await getBrand(user.id, brandId)

    if (!brand) {
      return {
        success: false,
        message: "Brand not found.",
      }
    }

    return {
      success: true,
      data: brand,
    }
  } catch (error) {
    console.error("brands.get_failed", { userId: user.id, brandId, error })
    return {
      success: false,
      message: "We could not load this brand. Please try again.",
    }
  }
}

export async function createBrandAction(
  formData: FormData
): Promise<BrandMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = brandCreateUpdateSchema.safeParse({
    name: formData.get("name"),
    category: sanitizeOptionalString(formData.get("category")),
    website: sanitizeOptionalString(formData.get("website")),
    primaryContactName: sanitizeOptionalString(
      formData.get("primaryContactName")
    ),
    primaryContactEmail: sanitizeOptionalString(
      formData.get("primaryContactEmail")
    ),
    notes: sanitizeOptionalString(formData.get("notes")),
  })

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: getFieldErrors(parsed.error),
    }
  }

  try {
    const created = await createBrand(user.id, parsed.data)

    revalidatePath("/dashboard/brands")
    revalidatePath(`/dashboard/brands/${created.id}`)

    return {
      success: true,
      message: "Brand created successfully.",
      data: created,
    }
  } catch (error) {
    const mappedError = mapBrandServiceError(error)
    if (mappedError) {
      return mappedError
    }

    console.error("brands.create_failed", { userId: user.id, error })
    return {
      success: false,
      message: "We could not create this brand. Please try again.",
    }
  }
}

export async function updateBrandAction(
  formData: FormData
): Promise<BrandMutationResult> {
  const user = await requireOnboardedUser()
  const brandId = formData.get("brandId")

  if (typeof brandId !== "string" || brandId.length === 0) {
    return {
      success: false,
      message: "Brand id is required.",
    }
  }

  const parsed = brandCreateUpdateSchema.safeParse({
    name: formData.get("name"),
    category: sanitizeOptionalString(formData.get("category")),
    website: sanitizeOptionalString(formData.get("website")),
    primaryContactName: sanitizeOptionalString(
      formData.get("primaryContactName")
    ),
    primaryContactEmail: sanitizeOptionalString(
      formData.get("primaryContactEmail")
    ),
    notes: sanitizeOptionalString(formData.get("notes")),
  })

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: getFieldErrors(parsed.error),
    }
  }

  try {
    const updated = await updateBrand(user.id, brandId, parsed.data)
    if (!updated) {
      return {
        success: false,
        message: "Brand not found.",
      }
    }

    revalidatePath("/dashboard/brands")
    revalidatePath(`/dashboard/brands/${brandId}`)

    return {
      success: true,
      message: "Brand updated successfully.",
      data: updated,
    }
  } catch (error) {
    const mappedError = mapBrandServiceError(error)
    if (mappedError) {
      return mappedError
    }

    console.error("brands.update_failed", { userId: user.id, brandId, error })
    return {
      success: false,
      message: "We could not update this brand. Please try again.",
    }
  }
}

export async function deleteBrandAction(
  brandId: string
): Promise<BrandMutationResult> {
  const user = await requireOnboardedUser()

  if (!brandId) {
    return {
      success: false,
      message: "Brand id is required.",
    }
  }

  try {
    const deleted = await deleteBrand(user.id, brandId)
    if (!deleted) {
      return {
        success: false,
        message: "Brand not found.",
      }
    }

    revalidatePath("/dashboard/brands")
    revalidatePath(`/dashboard/brands/${brandId}`)

    return {
      success: true,
      message: "Brand deleted successfully.",
      data: {
        id: brandId,
        name: "",
      },
    }
  } catch (error) {
    console.error("brands.delete_failed", { userId: user.id, brandId, error })
    return {
      success: false,
      message: "We could not delete this brand. Please try again.",
    }
  }
}
