import type { MetadataRoute } from "next"

const siteUrl ="https://www.notyetlaunched.xyz"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
