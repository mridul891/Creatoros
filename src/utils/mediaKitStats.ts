export function formatCompactNumber(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return "0"
  }

  if (value >= 100_000) {
    return `${(value / 100_000)
      .toFixed(value >= 1_000_000 ? 1 : 1)
      .replace(/\.0$/, "")}L`
  }

  if (value >= 1_000) {
    return `${(value / 1_000)
      .toFixed(value >= 10_000 ? 0 : 1)
      .replace(/\.0$/, "")}K`
  }

  return String(Math.round(value))
}

export function getEngagementRate(
  followers: number,
  avgLikes: number,
  avgComments: number,
  override: number
) {
  if (override > 0) {
    return override
  }

  if (followers <= 0) {
    return 0
  }

  return ((avgLikes + avgComments) / followers) * 100
}
