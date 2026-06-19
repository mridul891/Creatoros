import type { MetadataRoute } from "next"
import { getSiteUrl } from "@/lib/site-url"

const siteUrl = getSiteUrl()

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        // OpenAI crawlers (search and retrieval contexts)
        userAgent: ["GPTBot", "ChatGPT-User", "OAI-SearchBot"],
        allow: "/",
      },
      {
        // Anthropic crawler
        userAgent: ["ClaudeBot", "Claude-Web"],
        allow: "/",
      },
      {
        // Google AI/LLM-related crawler identifiers
        userAgent: ["Googlebot", "Google-Extended"],
        allow: "/",
      },
      {
        // Common AI/search crawlers used by assistants
        userAgent: ["PerplexityBot", "CCBot", "Bytespider"],
        allow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
