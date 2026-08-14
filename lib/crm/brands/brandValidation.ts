import { z } from "zod"

import { BRAND_CATEGORIES } from "@/enums/brand"

const websiteSchema = z
  .url({ error: "Please enter a valid website URL." })
  .refine(
    (value) => value.startsWith("http://") || value.startsWith("https://"),
    {
      message: "Website must start with http:// or https://",
    }
  )

export const brandCreateUpdateSchema = z.object({
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
  primaryContactEmail: z
    .email("Please enter a valid email address.")
    .optional(),
  notes: z
    .string()
    .trim()
    .max(5000, "Notes cannot exceed 5000 characters.")
    .optional(),
})

export type BrandCreateUpdateInput = z.infer<typeof brandCreateUpdateSchema>

export function normalizeBrandName(name: string) {
  return name.toLowerCase().replace(/\s+/g, " ").trim()
}
