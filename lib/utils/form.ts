export function sanitizeOptionalString(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return undefined
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}
