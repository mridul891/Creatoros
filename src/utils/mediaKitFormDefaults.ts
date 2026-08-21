import type { MediaKitFormData } from "@/schemas/mediaKit"

export const MEDIA_KIT_FORM_DEFAULT_VALUES: MediaKitFormData = {
  profile: {
    name: "",
    handle: "",
    category: "lifestyle",
    bio: "",
    avatarUrl: "",
  },

  stats: {
    followers: 0,
    avgReelViews: 0,
    avgLikes: 0,
    avgComments: 0,
    avgStoryViews: 0,
    engagementRate: 0,
  },

  audience: {
    topAgeGroups: "",
    womenPercentage: 0,
    cities: [],
    countries: [],
  },

  work: {
    items: [],
    brandsWorkedWith: "",
  },

  rates: {
    currency: "INR",
    ratePerThousand: 0,
    deliverables: [],
    addOns: {
      paidAdUsage: {
        enabled: true,
        durationMonths: 6,
      },
      noCompetitorWork: {
        enabled: true,
        durationMonths: 6,
      },
      adsFromHandle: {
        enabled: true,
      },
    },
    paymentTerms: "50% advance",
  },

  contactInfo: {
    email: "",
    phone: "",
    website: "",
  },
}
