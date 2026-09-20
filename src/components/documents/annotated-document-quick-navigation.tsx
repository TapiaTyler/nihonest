import type { ArticleAnnotatedDocument } from "@/lib/content/annotated-documents";

export function AnnotatedDocumentQuickNavigation({ families }: Readonly<{
  families: readonly ArticleAnnotatedDocument[];
}>) {
  return (
    <nav className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4" aria-label="Jump to an annotated document">
      <p className="text-sm font-semibold text-slate-950">Jump to a document</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {families.map((family) => (
          <a
            key={family.id}
            href={`#document-${family.id}`}
            onClick={() => {
              const target = document.getElementById(`document-${family.id}`) as HTMLDetailsElement | null;
              if (target) target.open = true;
            }}
            className="inline-flex min-h-11 items-center rounded-full border border-teal-300 bg-white px-4 text-sm font-semibold text-teal-800 hover:border-teal-600 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            {family.title}
          </a>
        ))}
      </div>
    </nav>
  );
}
