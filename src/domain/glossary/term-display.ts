import type { JapaneseTerm } from "@/domain/glossary/glossary";

/**
 * How a Japanese term is named for the reader's interface language.
 *
 * - English: the term's English name.
 * - Japanese: the term itself is already in the reader's language, so there is no separate name. An English name
 *   would be an untranslated label.
 * - Any other language: the term's name translated into that language, from that locale's glossary term-name
 *   translations. Until those exist, the English name is shown and marked as English.
 *
 * Adding an interface language therefore needs term-name translations for it, not changes to the components.
 */
export type GlossaryTermText = Readonly<{ text: string; lang?: string; kind: "name" | "reading" }>;

type DisplayedTerm = Pick<JapaneseTerm, "japanese" | "englishName" | "kana" | "romaji">;

/** The term's name in the reader's language, or undefined for Japanese readers. Use where the reading is shown separately. */
export function glossaryTermName(term: DisplayedTerm, locale: string, localizedName?: string): GlossaryTermText | undefined {
  const language = new Intl.Locale(locale).language;
  if (language === "en") return { text: term.englishName, kind: "name" };
  if (language === "ja") return undefined;
  return localizedName ? { text: localizedName, lang: locale, kind: "name" } : { text: term.englishName, lang: "en", kind: "name" };
}

/**
 * The short text beside a term where nothing else explains it (term chips and lists): its name, or for Japanese
 * readers its kana reading, which helps with kanji. Nothing is shown when the reading only repeats the term.
 */
export function glossaryTermGloss(term: DisplayedTerm, locale: string, localizedName?: string): GlossaryTermText | undefined {
  if (new Intl.Locale(locale).language !== "ja") return glossaryTermName(term, locale, localizedName);
  return term.kana && term.kana !== term.japanese ? { text: term.kana, lang: "ja", kind: "reading" } : undefined;
}
