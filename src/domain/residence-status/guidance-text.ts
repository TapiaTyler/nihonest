import type { StructuredResidenceStatusGuidance } from "./residence-status";

/**
 * Path-keyed access to the reader-facing text inside structured residence-status guidance, so a translation
 * can overlay individual snippets while identifiers, enums, dates, source records, and search terms stay
 * canonical. Paths use kebab-case segments and array indexes (e.g. `qualification-pathways.0.all-of.1.summary`)
 * so they are valid translation-artifact field IDs.
 */

/** Keys whose string values (or string-array items) are shown to readers. */
const translatableKeys = new Set([
  "routeKindLabel", "label", "duration", "note", "summary", "outsideActivityNote",
  "included", "boundaries", "exceptions", "organizationConditions", "evidenceCategories",
]);
/** Branches that are never translated: search aliases and source provenance. */
const skippedKeys = new Set(["searchTerms", "sourceAssertions"]);

const kebab = (key: string) => key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

function walk(value: unknown, path: string[], translatable: boolean, visit: (path: string, text: string) => string | undefined): unknown {
  if (typeof value === "string") return translatable ? visit(path.join("."), value) ?? value : value;
  if (Array.isArray(value)) return value.map((item, index) => walk(item, [...path, String(index)], translatable, visit));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [
      key,
      skippedKeys.has(key) ? child : walk(child, [...path, kebab(key)], translatableKeys.has(key), visit),
    ]));
  }
  return value;
}

/** Every reader-facing English snippet keyed by its path. */
export function extractGuidanceText(guidance: StructuredResidenceStatusGuidance): Record<string, string> {
  const texts: Record<string, string> = {};
  walk(guidance, [], false, (path, text) => {
    texts[path] = text;
    return undefined;
  });
  return texts;
}

/** A copy of the guidance with translated snippets applied; any snippet without a translation stays English. */
export function applyGuidanceText(
  guidance: StructuredResidenceStatusGuidance,
  translated: Readonly<Record<string, string>>,
): StructuredResidenceStatusGuidance {
  return walk(guidance, [], false, (path) => translated[path]) as StructuredResidenceStatusGuidance;
}
