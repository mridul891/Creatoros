import type { z } from "zod"

export function getFieldErrors<TField extends string>(
  error: z.ZodError
): Partial<Record<TField, string>> {
  const fields: Partial<Record<TField, string>> = {}

  for (const issue of error.issues) {
    const path = issue.path[0]
    if (typeof path !== "string") {
      continue
    }

    const field = path as TField
    if (!fields[field]) {
      fields[field] = issue.message
    }
  }

  return fields
}

type FieldMap = Record<string, string>

export function keepUnresolvedErrors<TField extends string>(
  currentErrors: Partial<Record<TField, string>>,
  nextErrors: Partial<Record<TField, string>>
): Partial<Record<TField, string>> {
  const unresolved: Partial<Record<TField, string>> = {}

  for (const field of Object.keys(currentErrors) as TField[]) {
    const message = nextErrors[field]
    if (message) {
      unresolved[field] = message
    }
  }

  return unresolved
}

export type { FieldMap }
