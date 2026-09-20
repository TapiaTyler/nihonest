import { normalizeSearchText } from "@/domain/search/normalize";

export { normalizeSearchText } from "@/domain/search/normalize";

const naturalQuestionWords = new Set([
  "a", "an", "and", "can", "could", "do", "does", "for", "how", "i", "in", "is", "it", "my", "of", "on", "or", "please", "should", "the", "this", "to", "what", "where", "with", "would",
]);

const searchTokenAliases: Readonly<Record<string, string>> = {
  freelancer: "freelance",
  freelancers: "freelance",
  freelancing: "freelance",
};

/** Keeps substantive terms strict while preventing natural-question grammar from vetoing a useful result. */
export function searchQueryTokens(value: string): readonly string[] {
  const tokens = normalizeSearchText(value).split(" ").filter(Boolean);
  if (tokens.length <= 1) return tokens.map((token) => searchTokenAliases[token] ?? token);
  return tokens
    .filter((token) => !naturalQuestionWords.has(token))
    .map((token) => searchTokenAliases[token] ?? token);
}

export function normalizeSearchVocabulary(value: string): string {
  return normalizeSearchText(value)
    .split(" ")
    .map((token) => searchTokenAliases[token] ?? token)
    .join(" ");
}
