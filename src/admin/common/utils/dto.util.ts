// Removes null/undefined values from a DTO payload so malformed input
// (e.g. {"priority": null}) never overwrites entity fields or violates
// NOT NULL columns. Tradeoff: nullable text fields (description, remarks, ...)
// can no longer be cleared by sending null — send the new value instead.
export function cleanDto<T extends object>(dto: T): Partial<T> {
  const cleaned: Record<string, unknown> = {};
  for (const key of Object.keys(dto)) {
    const value = (dto as Record<string, unknown>)[key];
    if (value !== undefined && value !== null) {
      cleaned[key] = value;
    }
  }
  return cleaned as Partial<T>;
}

// Converts free text into a URL-safe slug (lowercase, hyphenated). Shared by
// the products/books services so catalog slugs are generated consistently.
export function slugify(text: string, fallback = 'item'): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || fallback
  );
}
