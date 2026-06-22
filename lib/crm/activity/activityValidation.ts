import { z } from "zod"

export const activityListSchema = z.object({
  brandId: z.uuid("Brand id is invalid."),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional(),
})

export const activityDealListSchema = z.object({
  dealId: z.uuid("Deal id is invalid."),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional(),
})

export type ActivityListInput = z.infer<typeof activityListSchema>
export type ActivityDealListInput = z.infer<typeof activityDealListSchema>
