import type { Metadata } from "next";
import Link from "next/link";
import { InterfaceText } from "@/components/localization/interface-text";
import { LocalizedDocumentTitle } from "@/components/localization/localized-document-title";
import { getInterfaceMessage } from "@/domain/localization/interface-messages";

export const metadata: Metadata = {
  title: "Page not found | Nihonest",
};

/** Shown for any unknown address. It keeps the site chrome and offers the two ways forward a lost visitor needs. */
export default function NotFound() {
  return (
    <div className="page-shell py-12 sm:py-16">
      <LocalizedDocumentTitle japanese={getInterfaceMessage("ja", "pageTitle.notFound")} />
      <div className="max-w-3xl">
        <p className="eyebrow"><InterfaceText id="notFound.eyebrow" /></p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl"><InterfaceText id="notFound.title" /></h1>
        <p className="mt-6 text-lg leading-8 text-ink-muted"><InterfaceText id="notFound.body" /></p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/explore" className="inline-flex min-h-12 items-center rounded-full bg-brand px-6 font-semibold text-on-brand hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"><InterfaceText id="notFound.explore" /></Link>
          <Link href="/" className="inline-flex min-h-12 items-center rounded-full px-5 font-semibold text-brand-link hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"><InterfaceText id="notFound.home" /></Link>
        </div>
      </div>
    </div>
  );
}
