import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.notyetlaunched.xyz",
    },
    {
      url: "https://www.notyetlaunched.xyz/product",
    },
    {
      url: "https://www.notyetlaunched.xyz/features",
    },
    {
      url: "https://www.notyetlaunched.xyz/pricing",
    },
    {
      url: "https://www.notyetlaunched.xyz/waitlist",
    },
    {
      url: "https://www.notyetlaunched.xyz/privacy-policy",
    },
    {
      url: "https://www.notyetlaunched.xyz/terms-and-conditions",
    },
  ]
}