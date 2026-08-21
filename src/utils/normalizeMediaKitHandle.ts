export function normalizeMediaKitHandle(value: string) {
  return value.trim().replace(/^@+/, "").toLowerCase()
}
