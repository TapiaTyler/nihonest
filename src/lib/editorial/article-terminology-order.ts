const termIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function uniqueInOrder(ids: readonly string[]) {
  return ids.filter((id, index) => ids.indexOf(id) === index);
}

/** Reads the explicit terminology list from an article's exported MDX metadata. */
export function getDeclaredArticleTermIds(source: string): readonly string[] {
  const metadataMatch = source.match(/termIds\s*:\s*\[([^\]]*)\]/);
  if (!metadataMatch?.[1]) throw new Error("Article metadata must declare termIds.");

  const ids = [...metadataMatch[1].matchAll(/"([a-z0-9-]+)"/g)]
    .map((match) => match[1])
    .filter((id): id is string => Boolean(id));
  if (ids.some((id) => !termIdPattern.test(id))) throw new Error("Article termIds must use stable IDs.");
  return ids;
}

/** Returns glossary IDs in the order their links first appear after the metadata declaration. */
export function getInlineArticleTermIds(source: string): readonly string[] {
  const metadataMatch = source.match(/termIds\s*:\s*\[[^\]]*\]/);
  if (!metadataMatch) throw new Error("Article metadata must declare termIds.");

  const body = source.slice((metadataMatch.index ?? 0) + metadataMatch[0].length);
  return uniqueInOrder(
    [...body.matchAll(/\/glossary\/([a-z0-9-]+)/g)]
      .map((match) => match[1])
      .filter((id): id is string => Boolean(id)),
  );
}
