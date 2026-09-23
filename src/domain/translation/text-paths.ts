/**
 * Path-keyed access to the reader-facing text inside structured content, so a translation can overlay
 * individual snippets while identifiers, enums, dates, links, and provenance stay canonical. Paths use
 * kebab-case segments and array indexes (e.g. `rules.0.verify.1`) so they are valid translation-artifact field IDs.
 */
export type TextPathConfig = Readonly<{
  /** Keys whose string values (or string-array items) are shown to readers. */
  translatableKeys: ReadonlySet<string>;
  /** Branches never translated (search aliases, provenance, links resolved elsewhere). */
  skippedKeys: ReadonlySet<string>;
}>;

const kebab = (key: string) => key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

function walk(
  config: TextPathConfig,
  value: unknown,
  path: readonly string[],
  translatable: boolean,
  visit: (path: string, text: string) => string | undefined,
): unknown {
  if (typeof value === "string") return translatable ? visit(path.join("."), value) ?? value : value;
  if (Array.isArray(value)) return value.map((item, index) => walk(config, item, [...path, String(index)], translatable, visit));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [
      key,
      config.skippedKeys.has(key) ? child : walk(config, child, [...path, kebab(key)], config.translatableKeys.has(key), visit),
    ]));
  }
  return value;
}

/** Every reader-facing English snippet keyed by its path. */
export function extractText(config: TextPathConfig, content: unknown): Record<string, string> {
  const texts: Record<string, string> = {};
  walk(config, content, [], false, (path, text) => {
    texts[path] = text;
    return undefined;
  });
  return texts;
}

/** A copy of the content with translated snippets applied; any snippet without a translation stays English. */
export function applyText<T>(config: TextPathConfig, content: T, translated: Readonly<Record<string, string>>): T {
  return walk(config, content, [], false, (path) => translated[path]) as T;
}
