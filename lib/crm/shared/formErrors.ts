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
