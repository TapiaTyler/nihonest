import { createHash } from "node:crypto";

/**
 * Hashes sorted canonical fields so editorial changes invalidate only affected artifacts.
 * Import through `source-revision.ts` in application code; tools outside Next.js (the local CMS) import this directly.
 */
export function createTranslationSourceRevision(fields: Readonly<Record<string, string>>): string {
  const canonicalFields = Object.fromEntries(
    Object.entries(fields)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => [key, value.replace(/\r\n?/g, "\n")]),
  );
  return createHash("sha256").update(JSON.stringify(canonicalFields), "utf8").digest("hex");
}
