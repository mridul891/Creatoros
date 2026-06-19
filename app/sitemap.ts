import type { MetadataRoute } from "next"

type SitemapRoute = {
  path: `/${string}` | "/"
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>
  priority: number
}

const routes: SitemapRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/product", changeFrequency: "weekly", priority: 0.9 },
  { path: "/features", changeFrequency: "weekly", priority: 0.9 },
  { path: "/pricing", changeFrequency: "weekly", priority: 0.9 },
  { path: "/waitlist", changeFrequency: "weekly", priority: 0.9 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.5 },
  { path: "/terms-and-conditions", changeFrequency: "yearly", priority: 0.5 },
]

function getBaseUrl(): string {
  const candidate =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    "https://www.notyetlaunched.xyz"

  return candidate.startsWith("http")
    ? candidate.replace(/\/$/, "")
    : `https://${candidate.replace(/\/$/, "")}`
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl()
  const lastModified = new Date()

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: new URL(path, baseUrl).toString(),
    lastModified,
    changeFrequency,
    priority,
  }))
}
