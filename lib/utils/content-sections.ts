export interface ContentSection {
  heading: string;
  body: string;
}

export function parseSections(content: string | null | undefined): ContentSection[] {
  if (!content) return [];
  try {
    const parsed = JSON.parse(content);
    if (
      Array.isArray(parsed) &&
      parsed.every(
        (s: unknown) =>
          typeof s === 'object' && s !== null && 'heading' in s && 'body' in s,
      )
    ) {
      return parsed as ContentSection[];
    }
  } catch {
    // Not JSON — treat as legacy plain text
  }
  // Fallback: wrap raw text as single section
  return [{ heading: 'Məzmun', body: content }];
}
