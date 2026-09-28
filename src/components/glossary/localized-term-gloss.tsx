"use client";

import { useInterfaceMessages } from "@/components/localization/interface-text";
import type { JapaneseTerm } from "@/domain/glossary/glossary";
import { glossaryTermGloss, glossaryTermName } from "@/domain/glossary/term-display";

/**
 * The text beside a Japanese term for the reader's language: `gloss` (name, or reading for Japanese readers) where
 * nothing else explains the term, `name` where the reading is shown separately. Renders nothing when there is none.
 */
export function LocalizedTermGloss({ term, variant = "gloss", localizedName, className, separator = "" }: Readonly<{
  term: Pick<JapaneseTerm, "japanese" | "englishName" | "kana" | "romaji">;
  variant?: "gloss" | "name";
  /** The term's name in the reader's language, for interface languages other than English and Japanese. */
  localizedName?: string;
  className?: string;
  /** Text placed before the gloss, such as " — ", shown only when there is a gloss. */
  separator?: string;
}>) {
  const { locale } = useInterfaceMessages();
  const text = variant === "name" ? glossaryTermName(term, locale, localizedName) : glossaryTermGloss(term, locale, localizedName);
  if (!text) return null;
  return <span className={className} lang={text.lang}>{separator}{text.text}</span>;
}
