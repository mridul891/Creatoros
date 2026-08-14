export function parseDateOnlyInput(value: string): Date | undefined {
  const trimmed = value.trim()
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed)

  if (!match) {
    return undefined
  }

  const year = Number(match[1])
  const month = Number(match[2]) - 1
  const day = Number(match[3])
  const localNoon = new Date(year, month, day, 12, 0, 0, 0)

  if (
    Number.isNaN(localNoon.getTime()) ||
    localNoon.getFullYear() !== year ||
    localNoon.getMonth() !== month ||
    localNoon.getDate() !== day
  ) {
    return undefined
  }

  return localNoon
}

export function formatDateOnlyInput(date: Date | null): string {
  if (!date) {
    return ""
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function startOfLocalDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0
  )
}

export function endOfLocalDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999
  )
}
