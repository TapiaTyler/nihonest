import type { ActivityCrossReference } from "@/domain/activity-cross-reference/activity-cross-reference";
import { normalizeSearchText } from "./normalize";

const questionWords = new Set([
  "a", "an", "and", "can", "could", "do", "does", "for", "how", "i", "in", "is", "it", "japan", "my", "of", "on", "or", "the", "this", "to", "visa", "want", "what", "where", "with", "work", "would",
]);

function meaningfulTokens(value: string) {
  return normalizeSearchText(value).split(" ").filter((token) => token.length > 1 && !questionWords.has(token));
}

/** Maps ordinary questions to curated activities; it retrieves a path and never infers a legal result. */
export function searchActivityCrossReferences(
  activities: readonly ActivityCrossReference[],
  query: string,
  limit = 2,
): readonly ActivityCrossReference[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];
  const queryTokens = meaningfulTokens(query);
  if (queryTokens.length === 0) return [];

  return activities
    .flatMap((activity) => {
      // Only editor-curated names and aliases participate; descriptive copy must not create accidental legal-looking matches.
      const values = [activity.label, activity.shortLabel, ...activity.searchTerms].map(normalizeSearchText);
      const phraseScore = Math.max(...values.map((value) => (
        normalizedQuery.includes(value) || value.includes(normalizedQuery) ? 100 + Math.min(value.length, 40) : 0
      )));
      const candidateTokens = new Set(values.flatMap(meaningfulTokens));
      const overlap = queryTokens.filter((token) => candidateTokens.has(token)).length;
      const tokenScore = overlap > 0 ? overlap * 20 - Math.max(0, queryTokens.length - overlap) * 2 : 0;
      const score = Math.max(phraseScore, tokenScore);
      return score > 0 ? [{ activity, score }] : [];
    })
    .sort((left, right) => right.score - left.score || left.activity.label.localeCompare(right.activity.label))
    .slice(0, limit)
    .map(({ activity }) => activity);
}
