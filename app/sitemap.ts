import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.notyetlaunched.xyz"

  return [
    "/",
    "/product",
    "/features",
    "/pricing",
    "/waitlist",
    "/privacy-policy",
    "/terms-and-conditions",
  ].map((path) => ({
    url: `${base}${path === "/" ? "" : path}`,
  }))
}