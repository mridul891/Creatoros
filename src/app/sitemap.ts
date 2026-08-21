import type { MetadataRoute } from "next"
import { getSiteUrl } from "@/lib/infrastructure/site-url"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const lastModified = new Date().toISOString()

  // Keep sitemap limited to public, indexable marketing/legal pages only.
  // Do not add auth, onboarding, dashboard, or redirect-only routes here.
  const paths = [
    "/",
    "/features",
    "/pricing",
    "/product",
    "/privacy-policy",
    "/terms-and-conditions",
    "/waitlist",
  ]

  return [
    {
      url: `${siteUrl}/`,
      lastModified,
    },
    ...paths
      .filter((path) => path !== "/")
      .map((path) => ({
        url: `${siteUrl}${path}`,
        lastModified,
      })),
  ]
}
