import { formatDistanceToNow } from "date-fns"

export function formatShortDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

export function formatRelativeTime(value: Date) {
  return formatDistanceToNow(new Date(value), {
    addSuffix: true,
  })
}
