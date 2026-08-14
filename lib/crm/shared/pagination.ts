export function clampPage(input: number | undefined) {
  if (!input || Number.isNaN(input)) {
    return 1
  }

  return Math.max(1, Math.floor(input))
}

export function clampPageSize(
  input: number | undefined,
  defaults: { pageSize: number; maxPageSize: number }
) {
  if (!input || Number.isNaN(input)) {
    return defaults.pageSize
  }

  return Math.max(1, Math.min(defaults.maxPageSize, Math.floor(input)))
}
