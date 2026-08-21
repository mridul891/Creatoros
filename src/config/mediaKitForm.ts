import { creatorCategorySchema } from "@/schemas/mediaKit"

export const MEDIA_KIT_CREATOR_CATEGORIES = creatorCategorySchema.options

export const MEDIA_KIT_CATEGORY_LABELS: Record<
  (typeof MEDIA_KIT_CREATOR_CATEGORIES)[number],
  string
> = {
  fashion: "Fashion",
  beauty: "Beauty",
  fitness: "Fitness",
  gaming: "Gaming",
  technology: "Technology",
  lifestyle: "Lifestyle",
  travel: "Travel",
  food: "Food",
  business: "Business",
  other: "Other",
}

export const MEDIA_KIT_CURRENCIES = ["USD", "EUR", "GBP", "INR"] as const
