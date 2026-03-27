export function buildCursorQuery(cursor?: string, limit = 8): string {
  const params = new URLSearchParams()
  params.set("limit", String(limit))
  if (cursor) params.set("cursor", cursor)
  return `?${params.toString()}`
}
