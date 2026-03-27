export function buildCursorQuery(
  cursor?: string,
  limit = 8,
  filters?: Record<string, string>,
): string {
  const params = new URLSearchParams();

  params.set("limit", String(limit));
  if (cursor) params.set("cursor", cursor);

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, value);
      }
    });
  }

  return `?${params.toString()}`;
}
