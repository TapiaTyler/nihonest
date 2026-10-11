"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useInterfaceMessages } from "@/components/localization/interface-text";

/**
 * Fallback for an unexpected failure while rendering a page. It keeps the site header and footer, says plainly
 * that the fault is not the visitor's, and offers a retry (which re-fetches the page) and a way home.
 */
export default function ErrorPage({ error, retry }: Readonly<{ error: Error & { digest?: string }; retry: () => void }>) {
  const { message } = useInterfaceMessages();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="page-shell py-12 sm:py-16">
      <div className="max-w-3xl">
        <p className="eyebrow">{message("error.eyebrow")}</p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{message("error.title")}</h1>
        <p className="mt-6 text-lg leading-8 text-ink-muted">{message("error.body")}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => retry()} className="inline-flex min-h-12 items-center rounded-full bg-brand px-6 font-semibold text-on-brand hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus">{message("error.retry")}</button>
          <Link href="/" className="inline-flex min-h-12 items-center rounded-full px-5 font-semibold text-brand-link hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">{message("error.home")}</Link>
        </div>
      </div>
    </div>
  );
}
