"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { BRAND_CATEGORIES } from "@/enums/brand"
import type { BrandField, BrandListData } from "@/types/brand"
import { prisma } from "@/lib/prisma"
import { requireOnboardedUser } from "@/lib/auth/require-user"

const PAGE_SIZE_DEFAULT = 20
const PAGE_SIZE_MAX = 50

const websiteSchema = z
  .url({ error: "Please enter a valid website URL." })
  .refine((value) => value.startsWith("http://") || value.startsWith("https://"), {
    message: "Website must start with http:// or https://",
  })

const brandCreateUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Brand name must be at least 2 characters.")
    .max(120, "Brand name cannot exceed 120 characters."),
  category: z.enum(BRAND_CATEGORIES).optional(),
  website: websiteSchema.optional(),
  primaryContactName: z
    .string()
    .trim()
    .max(120, "Contact name cannot exceed 120 characters.")
    .optional(),
  primaryContactEmail: z.email("Please enter a valid email address.").optional(),
  notes: z.string().trim().max(5000, "Notes cannot exceed 5000 characters.").optional(),
})

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

function sanitizeOptionalString(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return undefined
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function normalizeBrandName(name: string) {
  return name.toLowerCase().replace(/\s+/g, " ").trim()
}

function getFieldErrors(error: z.ZodError): Partial<Record<BrandField, string>> {
  const fields: Partial<Record<BrandField, string>> = {}
  for (const issue of error.issues) {
    const path = issue.path[0]
    if (typeof path !== "string") {
      continue
    }

    const field = path as BrandField
    if (!fields[field]) {
      fields[field] = issue.message
    }
  }

  return fields
}

function clampPage(input: number | undefined) {
  if (!input || Number.isNaN(input)) {
    return 1
  }

  return Math.max(1, Math.floor(input))
}

function clampPageSize(input: number | undefined) {
  if (!input || Number.isNaN(input)) {
    return PAGE_SIZE_DEFAULT
  }

  return Math.max(1, Math.min(PAGE_SIZE_MAX, Math.floor(input)))
}

async function ensureNoDuplicateName(options: {
  userId: string
  normalizedName: string
  excludingId?: string
}) {
  const existing = await prisma.brand.findFirst({
    where: {
      userId: options.userId,
      normalizedName: options.normalizedName,
      ...(options.excludingId ? { id: { not: options.excludingId } } : {}),
    },
    select: { id: true },
  })

  return !existing
}

export async function listBrandsAction(input?: {
  search?: string
  page?: number
  pageSize?: number
}): Promise<BrandListResult> {
  const user = await requireOnboardedUser()
  const search = input?.search?.trim() ?? ""
  const page = clampPage(input?.page)
  const pageSize = clampPageSize(input?.pageSize)
  const skip = (page - 1) * pageSize

  try {
    const where = {
      userId: user.id,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { category: { contains: search, mode: "insensitive" as const } },
              { primaryContactName: { contains: search, mode: "insensitive" as const } },
              { primaryContactEmail: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    }

    const [items, total] = await prisma.$transaction([
      prisma.brand.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip,
        take: pageSize,
        select: {
          id: true,
          name: true,
          category: true,
          website: true,
          primaryContactName: true,
          primaryContactEmail: true,
          updatedAt: true,
        },
      }),
      prisma.brand.count({ where }),
    ])

    return {
      success: true,
      data: {
        items,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.max(1, Math.ceil(total / pageSize)),
        },
      },
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
    const brand = await prisma.brand.findFirst({
      where: {
        id: brandId,
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
        category: true,
        website: true,
        primaryContactName: true,
        primaryContactEmail: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    })

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

export async function createBrandAction(formData: FormData): Promise<BrandMutationResult> {
  const user = await requireOnboardedUser()
  const parsed = brandCreateUpdateSchema.safeParse({
    name: formData.get("name"),
    category: sanitizeOptionalString(formData.get("category")),
    website: sanitizeOptionalString(formData.get("website")),
    primaryContactName: sanitizeOptionalString(formData.get("primaryContactName")),
    primaryContactEmail: sanitizeOptionalString(formData.get("primaryContactEmail")),
    notes: sanitizeOptionalString(formData.get("notes")),
  })

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: getFieldErrors(parsed.error),
    }
  }

  const normalizedName = normalizeBrandName(parsed.data.name)
  const isUnique = await ensureNoDuplicateName({
    userId: user.id,
    normalizedName,
  })

  if (!isUnique) {
    return {
      success: false,
      message: "A brand with this name already exists.",
      fieldErrors: {
        name: "Brand name already exists.",
      },
    }
  }

  try {
    const created = await prisma.brand.create({
      data: {
        userId: user.id,
        name: parsed.data.name,
        normalizedName,
        category: parsed.data.category ?? null,
        website: parsed.data.website ?? null,
        primaryContactName: parsed.data.primaryContactName ?? null,
        primaryContactEmail: parsed.data.primaryContactEmail ?? null,
        notes: parsed.data.notes ?? null,
      },
      select: {
        id: true,
        name: true,
      },
    })

    revalidatePath("/dashboard/brands")
    revalidatePath(`/dashboard/brands/${created.id}`)

    return {
      success: true,
      message: "Brand created successfully.",
      data: created,
    }
  } catch (error) {
    console.error("brands.create_failed", { userId: user.id, error })
    return {
      success: false,
      message: "We could not create this brand. Please try again.",
    }
  }
}

export async function updateBrandAction(formData: FormData): Promise<BrandMutationResult> {
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
    primaryContactName: sanitizeOptionalString(formData.get("primaryContactName")),
    primaryContactEmail: sanitizeOptionalString(formData.get("primaryContactEmail")),
    notes: sanitizeOptionalString(formData.get("notes")),
  })

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: getFieldErrors(parsed.error),
    }
  }

  const normalizedName = normalizeBrandName(parsed.data.name)
  const isUnique = await ensureNoDuplicateName({
    userId: user.id,
    normalizedName,
    excludingId: brandId,
  })

  if (!isUnique) {
    return {
      success: false,
      message: "A brand with this name already exists.",
      fieldErrors: {
        name: "Brand name already exists.",
      },
    }
  }

  try {
    const updated = await prisma.brand.updateMany({
      where: {
        id: brandId,
        userId: user.id,
      },
      data: {
        name: parsed.data.name,
        normalizedName,
        category: parsed.data.category ?? null,
        website: parsed.data.website ?? null,
        primaryContactName: parsed.data.primaryContactName ?? null,
        primaryContactEmail: parsed.data.primaryContactEmail ?? null,
        notes: parsed.data.notes ?? null,
      },
    })

    if (updated.count === 0) {
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
      data: {
        id: brandId,
        name: parsed.data.name,
      },
    }
  } catch (error) {
    console.error("brands.update_failed", { userId: user.id, brandId, error })
    return {
      success: false,
      message: "We could not update this brand. Please try again.",
    }
  }
}

export async function deleteBrandAction(brandId: string): Promise<BrandMutationResult> {
  const user = await requireOnboardedUser()

  if (!brandId) {
    return {
      success: false,
      message: "Brand id is required.",
    }
  }

  try {
    const deleted = await prisma.brand.deleteMany({
      where: {
        id: brandId,
        userId: user.id,
      },
    })

    if (deleted.count === 0) {
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
