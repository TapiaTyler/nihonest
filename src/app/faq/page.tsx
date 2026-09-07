import type { Metadata } from "next";
import { FaqExplorer } from "@/components/faq/faq-explorer";
import { getAllFaqEntries } from "@/lib/content/faqs";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Nihonest",
  description: "Search practical questions about moving to and living in Japan, then follow links to Nihonest's canonical guidance.",
};

export default function FaqPage() {
  return (
    <div className="page-shell py-16 sm:py-24">
      <header className="max-w-3xl">
        <p className="eyebrow">Frequently asked questions</p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Start with the question you already have.</h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">These draft questions translate everyday wording into direct paths to articles, journeys, terms, and residence-status records. Linked sourced guidance—not the short FAQ summary—contains the substantive answer.</p>
      </header>
      <FaqExplorer entries={getAllFaqEntries()} />
    </div>
  );
}
