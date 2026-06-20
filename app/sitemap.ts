import type { MetadataRoute } from "next"
import { getSiteUrl } from "@/lib/site-url"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const lastModified = new Date().toISOString()

  const paths = [
    "/",
    "/analytics",
    "/dashboard",
    "/dashboard/analytics",
    "/dashboard/brands",
    "/dashboard/calendar",
    "/dashboard/deals",
    "/dashboard/invoices",
    "/dashboard/media-kit",
    "/features",
    "/login",
    "/onboarding",
    "/pricing",
    "/privacy-policy",
    "/product",
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