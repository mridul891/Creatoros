import { z } from "zod";

export const creatorCategorySchema = z.enum([
  "fashion",
  "beauty",
  "fitness",
  "gaming",
  "technology",
  "lifestyle",
  "travel",
  "food",
  "business",
  "other",
]);

export const currencySchema = z.enum([
  "USD",
  "EUR",
  "GBP",
  "INR",
]);

const nonNegativeNumber = z
  .number()
  .finite()
  .min(0);

const percentage = z
  .number()
  .finite()
  .min(0)
  .max(100);

export const creatorProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name is too long"),

  handle: z
    .string()
    .trim()
    .min(1, "Handle is required")
    .max(50, "Handle is too long"),

  category: creatorCategorySchema,

  bio: z
    .string()
    .trim()
    .max(280, "Bio is too long")
    .optional()
    .or(z.literal("")),

  avatarUrl: z
    .url("Enter a valid avatar URL")
    .optional()
    .or(z.literal("")),
});

export const mediaKitStatsSchema = z.object({
  followers: nonNegativeNumber,

  avgReelViews: nonNegativeNumber,

  avgLikes: nonNegativeNumber,

  avgComments: nonNegativeNumber,

  avgStoryViews: nonNegativeNumber,

  engagementRate: percentage,
});

export const mediaKitAudienceSchema = z.object({
  topAgeGroups: z
    .string()
    .trim()
    .min(1, "Age group is required"),

  womenPercentage: percentage,

  cities: z
    .array(
      z
        .string()
        .trim()
        .min(1)
    )
    .max(20, "You can add up to 20 cities"),

  countries: z
    .array(
      z
        .string()
        .trim()
        .min(1)
    )
    .max(20, "You can add up to 20 countries"),
});

export const mediaKitWorkItemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(150),

  url: z
    .url("Enter a valid URL"),

  views: nonNegativeNumber,
});

export const mediaKitWorkSchema = z.object({
  items: z
    .array(mediaKitWorkItemSchema)
    .max(50, "You can add up to 50 work items"),

  brandsWorkedWith: z
    .string()
    .max(1000, "Brand list is too long"),
});

export const mediaKitDeliverableSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Deliverable name is required")
    .max(100),

  price: nonNegativeNumber,
});

export const mediaKitRateAddOnsSchema = z.object({
  paidAdUsage: z.object({
    enabled: z.boolean(),
    durationMonths: z.union([z.literal(1), z.literal(3), z.literal(6), z.literal(12)]),
  }),
  noCompetitorWork: z.object({
    enabled: z.boolean(),
    durationMonths: z.union([z.literal(3), z.literal(6)]),
  }),
  adsFromHandle: z.object({
    enabled: z.boolean(),
  }),
});

export const mediaKitRatesSchema = z.object({
  currency: currencySchema,

  ratePerThousand: nonNegativeNumber,

  deliverables: z
    .array(mediaKitDeliverableSchema)
    .max(50, "You can add up to 50 deliverables"),

  addOns: mediaKitRateAddOnsSchema,

  paymentTerms: z
    .string()
    .trim()
    .min(1, "Payment terms are required")
    .max(500),
});

export const mediaKitFormSchema = z.object({
  profile: creatorProfileSchema,

  stats: mediaKitStatsSchema,

  audience: mediaKitAudienceSchema,

  work: mediaKitWorkSchema,

  rates: mediaKitRatesSchema,

  contactInfo: z.object({
    email: z.email("Invalid email address"),
    phone: z.string().optional().nullable(),
    website: z.string().optional().nullable(),
  }),
});

export type MediaKitFormData = z.infer<typeof mediaKitFormSchema>;