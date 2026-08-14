type DealsUrlFilters = {
  search?: string
  view?: string
  archive?: string
  stage?: string
  priority?: string
  brandId?: string
  sort?: string
  page?: number
}

export function buildDealsUrl(filters: DealsUrlFilters) {
  const params = new URLSearchParams()
  if (filters.search?.trim()) params.set("search", filters.search.trim())
  if (filters.view) params.set("view", filters.view)
  if (filters.archive) params.set("archive", filters.archive)
  if (filters.stage) params.set("stage", filters.stage)
  if (filters.priority) params.set("priority", filters.priority)
  if (filters.brandId) params.set("brandId", filters.brandId)
  if (filters.sort) params.set("sort", filters.sort)
  if (filters.page) params.set("page", String(filters.page))
  return `/dashboard/deals?${params.toString()}`
}
