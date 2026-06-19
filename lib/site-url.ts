const FALLBACK_SITE_URL = "https://www.notyetlaunched.xyz"

function normalizeCandidate(candidate: string): string {
  // Handles values copied with quotes or trailing spaces from hosting dashboards.
  const unquoted = candidate.trim().replace(/^['"]|['"]$/g, "")
  if (!unquoted) return FALLBACK_SITE_URL
  return unquoted.startsWith("http") ? unquoted : `https://${unquoted}`
}

export function getSiteUrl(): string {
  const candidate =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    FALLBACK_SITE_URL

  try {
    return new URL(normalizeCandidate(candidate)).toString().replace(/\/$/, "")
  } catch {
    return FALLBACK_SITE_URL
  }
}
