import { z } from "zod";

const protectedTermSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  value: z.string().min(1),
  replacement: z.string().min(1).optional(),
  kind: z.enum(["japanese", "kana", "romaji", "official-name", "acronym"]),
});

export type ProtectedTerm = z.infer<typeof protectedTermSchema>;
type ProtectedOccurrence = Readonly<{ placeholder: string; value: string }>;
export type ProtectedText = Readonly<{ text: string; occurrences: readonly ProtectedOccurrence[] }>;

function escapeRegularExpression(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Replaces each occurrence independently so deletion or duplication by a translation generator is detectable. */
export function protectTranslationText(text: string, termsInput: readonly ProtectedTerm[]): ProtectedText {
  if (text.includes("[[NH-PROTECTED-")) throw new Error("Source text contains a reserved translation placeholder.");
  const terms = z.array(protectedTermSchema).parse(termsInput);
  const uniqueTerms = [...new Map(terms.map((term) => [term.value, term])).values()]
    .sort((left, right) => right.value.length - left.value.length);
  const occurrences: ProtectedOccurrence[] = [];
  const protectedText = uniqueTerms.length === 0
    ? text
    : text.replace(new RegExp(uniqueTerms.map(({ value }) => escapeRegularExpression(value)).join("|"), "gu"), (value) => {
      const placeholder = `[[NH-PROTECTED-${occurrences.length}]]`;
      const term = uniqueTerms.find((candidate) => candidate.value === value);
      occurrences.push({ placeholder, value: term?.replacement ?? value });
      return placeholder;
    });
  return { text: protectedText, occurrences };
}

export function restoreTranslationText(text: string, occurrences: readonly ProtectedOccurrence[]): string {
  let restored = text;
  for (const occurrence of occurrences) {
    const matches = restored.split(occurrence.placeholder).length - 1;
    if (matches !== 1) throw new Error("A translation generator changed protected terminology placeholders.");
    restored = restored.replace(occurrence.placeholder, occurrence.value);
  }
  if (/\[\[NH-PROTECTED-\d+\]\]/u.test(restored)) {
    throw new Error("A translation generator returned an unknown protected terminology placeholder.");
  }
  return restored;
}
