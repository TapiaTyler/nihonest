import type { Metadata } from "next";
import { FaqExplorer } from "@/components/faq/faq-explorer";
import { InterfaceText } from "@/components/localization/interface-text";
import { getAllFaqEntries } from "@/lib/content/faqs";
import { getFaqSearchTranslations } from "@/lib/content/translations";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Nihonest",
  description: "Search practical questions about moving to and living in Japan, then follow links to Nihonest's canonical guidance.",
};

export default function FaqPage() {
  return (
    <div className="page-shell py-16 sm:py-24">
      <header className="max-w-3xl">
        <p className="eyebrow"><InterfaceText id="faq.pageEyebrow" /></p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl"><InterfaceText id="faq.pageTitle" /></h1>
        <p className="mt-6 text-lg leading-8 text-slate-600"><InterfaceText id="faq.pageDescription" /></p>
      </header>
      <FaqExplorer entries={getAllFaqEntries()} translations={getFaqSearchTranslations()} />
    </div>
  );
}
