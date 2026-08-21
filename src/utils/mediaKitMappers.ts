import type {
  MediaKit,
  MediaKitRateDeliverable,
  MediaKitWorkItem,
  Prisma,
} from "@prisma/client"

import type { MediaKitFormData } from "@/schemas/mediaKit"
import type { MediaKitPageProps } from "@/types/media-kit-page"
import { MEDIA_KIT_FORM_DEFAULT_VALUES } from "@/utils/mediaKitFormDefaults"
import { normalizeMediaKitHandle } from "@/utils/normalizeMediaKitHandle"

export type MediaKitWithRelations = MediaKit & {
  workItems: MediaKitWorkItem[]
  rateDeliverables: MediaKitRateDeliverable[]
}

function toNumber(value: Prisma.Decimal) {
  return Number(value)
}

function emptyToNull(value: string | null | undefined) {
  if (value == null) {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function mapCategoryToForm(
  category: MediaKit["category"]
): MediaKitFormData["profile"]["category"] {
  return category as MediaKitFormData["profile"]["category"]
}

function mapCurrencyToForm(
  currency: MediaKit["currency"]
): MediaKitFormData["rates"]["currency"] {
  return currency as MediaKitFormData["rates"]["currency"]
}

export function mapMediaKitToFormData(
  record: MediaKitWithRelations
): MediaKitFormData {
  const addOns = record.addOns as MediaKitFormData["rates"]["addOns"]

  return {
    profile: {
      name: record.displayName,
      handle: record.handle,
      category: mapCategoryToForm(record.category),
      bio: record.bio ?? "",
      avatarUrl: record.avatarUrl ?? "",
    },
    stats: {
      followers: record.followers,
      avgReelViews: record.avgReelViews,
      avgLikes: record.avgLikes,
      avgComments: record.avgComments,
      avgStoryViews: record.avgStoryViews,
      engagementRate: toNumber(record.engagementRate),
    },
    audience: {
      topAgeGroups: record.topAgeGroups,
      womenPercentage: toNumber(record.womenPercentage),
      cities: record.cities,
      countries: record.countries,
    },
    work: {
      items: record.workItems
        .slice()
        .sort((left, right) => left.orderIndex - right.orderIndex)
        .map((item) => ({
          title: item.title,
          url: item.url,
          views: item.views,
        })),
      brandsWorkedWith: record.brandsWorkedWith ?? "",
    },
    rates: {
      currency: mapCurrencyToForm(record.currency),
      ratePerThousand: toNumber(record.ratePerThousand),
      deliverables: record.rateDeliverables
        .slice()
        .sort((left, right) => left.orderIndex - right.orderIndex)
        .map((item) => ({
          title: item.title,
          price: toNumber(item.price),
        })),
      addOns,
      paymentTerms: record.paymentTerms,
    },
    contactInfo: {
      email: record.contactEmail,
      phone: record.contactPhone,
      website: record.contactWebsite,
    },
  }
}

export function mapFormDataToMediaKitScalars(input: MediaKitFormData) {
  const handle = normalizeMediaKitHandle(input.profile.handle)

  return {
    displayName: input.profile.name.trim(),
    handle,
    category: input.profile.category,
    bio: emptyToNull(input.profile.bio),
    avatarUrl: emptyToNull(input.profile.avatarUrl),
    followers: input.stats.followers,
    avgReelViews: input.stats.avgReelViews,
    avgLikes: input.stats.avgLikes,
    avgComments: input.stats.avgComments,
    avgStoryViews: input.stats.avgStoryViews,
    engagementRate: input.stats.engagementRate,
    topAgeGroups: input.audience.topAgeGroups.trim(),
    womenPercentage: input.audience.womenPercentage,
    cities: input.audience.cities,
    countries: input.audience.countries,
    brandsWorkedWith: emptyToNull(input.work.brandsWorkedWith),
    currency: input.rates.currency,
    ratePerThousand: input.rates.ratePerThousand,
    paymentTerms: input.rates.paymentTerms.trim(),
    addOns: input.rates.addOns,
    contactEmail: input.contactInfo.email.trim(),
    contactPhone: emptyToNull(input.contactInfo.phone ?? undefined),
    contactWebsite: emptyToNull(input.contactInfo.website ?? undefined),
  }
}

export function mapFormDataToWorkItems(input: MediaKitFormData) {
  return input.work.items.map((item, index) => ({
    title: item.title.trim(),
    url: item.url.trim(),
    views: item.views,
    orderIndex: index,
  }))
}

export function mapFormDataToRateDeliverables(input: MediaKitFormData) {
  return input.rates.deliverables.map((item, index) => ({
    title: item.title.trim(),
    price: item.price,
    orderIndex: index,
  }))
}

export function mapFormDataToProfileSync(input: MediaKitFormData) {
  const handle = normalizeMediaKitHandle(input.profile.handle)

  return {
    user: {
      name: input.profile.name.trim(),
      avatarUrl: emptyToNull(input.profile.avatarUrl),
    },
    creator: {
      instagramHandle: handle,
      bio: emptyToNull(input.profile.bio),
    },
  }
}

export function mergeMediaKitWithCreatorDefaults(
  creatorsDetails: MediaKitPageProps["creatorsDetails"],
  mediaKit?: MediaKitFormData | null
): MediaKitFormData {
  if (mediaKit) {
    return mediaKit
  }

  if (!creatorsDetails) {
    return MEDIA_KIT_FORM_DEFAULT_VALUES
  }

  return {
    ...MEDIA_KIT_FORM_DEFAULT_VALUES,
    profile: {
      ...MEDIA_KIT_FORM_DEFAULT_VALUES.profile,
      name: creatorsDetails.user.name ?? "",
      handle: creatorsDetails.instagramHandle ?? "",
      bio: creatorsDetails.bio ?? "",
      avatarUrl: creatorsDetails.user.avatarUrl ?? "",
    },
    contactInfo: {
      ...MEDIA_KIT_FORM_DEFAULT_VALUES.contactInfo,
    },
  }
}
