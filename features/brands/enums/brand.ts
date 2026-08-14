export const BRAND_CATEGORIES = [
  "Beauty",
  "Health",
  "Technology",
  "Fashion",
  "Food & Bev",
  "Finance",
  "Travel",
  "Lifestyle",
  "Fitness",
  "Miscellaneous",
] as const

export type BrandCategory = (typeof BRAND_CATEGORIES)[number]
