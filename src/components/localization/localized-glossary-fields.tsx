"use client";

import type { JapaneseTerm } from "@/domain/glossary/glossary";
import type { GlossarySearchTranslation } from "@/lib/search/glossary-search";
import { useContentLocale } from "./content-locale-provider";
import { useInterfaceMessages } from "./interface-text";

function activeTranslation(term: JapaneseTerm, translation?: GlossarySearchTranslation, locale = "en") {
  return translation?.contentId === term.id && translation.targetLocale === locale ? translation : undefined;
}

export function LocalizedGlossarySummary({ term, translation }: Readonly<{
  term: JapaneseTerm;
  translation?: GlossarySearchTranslation;
}>) {
  const { locale } = useContentLocale();
  const active = activeTranslation(term, translation, locale);
  return (
    <div lang={active ? "ja" : "en"}>
      <p className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">{term.englishName}</p>
      <p className="mt-4 text-lg leading-8 text-slate-600">{active?.shortDefinition ?? term.shortDefinition}</p>
    </div>
  );
}

export function LocalizedGlossaryExplanation({ term, translation }: Readonly<{
  term: JapaneseTerm;
  translation?: GlossarySearchTranslation;
}>) {
  const { locale } = useContentLocale();
  const { message } = useInterfaceMessages();
  const active = activeTranslation(term, translation, locale);
  return (
    <section lang={active ? "ja" : "en"} className="mt-8" aria-labelledby="meaning-heading">
      <h2 id="meaning-heading" className="text-2xl font-semibold tracking-tight text-slate-950">{message("glossary.whatItMeans")}</h2>
      <p className="mt-4 leading-8 text-slate-700">{active?.detailedExplanation ?? term.detailedExplanation}</p>
      <h2 className="mt-10 text-2xl font-semibold tracking-tight text-slate-950">{message("glossary.whereEncountered")}</h2>
      <p className="mt-4 leading-8 text-slate-700">{active?.commonContext ?? term.commonContext}</p>
    </section>
  );
}
