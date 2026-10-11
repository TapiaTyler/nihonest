"use client";

import { useInterfaceMessages } from "@/components/localization/interface-text";
import type { ArticleAnnotatedDocument } from "@/lib/content/annotated-documents";

export function AnnotatedDocumentQuickNavigation({ families }: Readonly<{
  families: readonly ArticleAnnotatedDocument[];
}>) {
  const { locale, message } = useInterfaceMessages();
  return (
    <nav className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4" aria-label={message("documents.jumpLabel")}>
      <p className="text-sm font-semibold text-slate-950">{message("documents.jumpHeading")}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {families.map((family) => (
          <a
            key={family.id}
            href={`#document-${family.id}`}
            onClick={() => {
              const target = document.getElementById(`document-${family.id}`) as HTMLDetailsElement | null;
              if (target) target.open = true;
            }}
            className="inline-flex min-h-11 items-center rounded-full border border-brand-300 bg-white px-4 text-sm font-semibold text-brand-link hover:border-brand-600 hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            {locale === "ja" ? <span lang="ja">{family.japaneseName}</span> : family.title}
          </a>
        ))}
      </div>
    </nav>
  );
}
