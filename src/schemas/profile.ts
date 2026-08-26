import { z } from "zod"

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(120, "Name is too long"),
  avatarUrl: z
    .string()
    .trim()
    .max(500_000, "Image is too large — use one under 500 KB")
    .optional()
    .or(z.literal("")),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
