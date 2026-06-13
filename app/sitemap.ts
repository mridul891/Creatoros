import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.notyetlaunched.xyz";

const routes: Array<{
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}> = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "product", changeFrequency: "weekly", priority: 0.9 },
  { path: "features", changeFrequency: "weekly", priority: 0.9 },
  { path: "pricing", changeFrequency: "weekly", priority: 0.9 },
  { path: "waitlist", changeFrequency: "weekly", priority: 0.9 },
  { path: "privacy-policy", changeFrequency: "yearly", priority: 0.5 },
  { path: "terms-and-conditions", changeFrequency: "yearly", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: path ? `${siteUrl}/${path}` : siteUrl,
    lastModified,
    changeFrequency,
    priority,
  }));
}
