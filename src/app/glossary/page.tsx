import type { Metadata } from "next";
import { GlossaryExplorer } from "@/components/glossary/glossary-explorer";
import { getAllGlossaryTerms } from "@/lib/content/glossary";

export const metadata: Metadata = {
  title: "Japanese Glossary | Nihonest",
  description: "Search practical Japanese terms used in immigration, municipal, health, pension, and daily-life procedures.",
};

export default function GlossaryPage() {
  return (
    <div className="page-shell py-16 sm:py-24">
      <header className="max-w-3xl">
        <p className="eyebrow">Japanese glossary</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Recognize the words behind the procedure.
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          Search the Japanese, reading, romaji, or English meaning of terms you are likely to encounter while moving to and living in Japan.
        </p>
      </header>

      <aside className="mt-8 max-w-3xl rounded-2xl border border-teal-200 bg-teal-50 p-5 text-sm leading-6 text-teal-950">
        This is a practical administrative glossary, not a general dictionary. Term pages explain where a word appears and connect it to the relevant guide and official sources.
      </aside>

      <GlossaryExplorer terms={getAllGlossaryTerms()} />
    </div>
  );
}
