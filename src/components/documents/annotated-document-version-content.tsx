import Image from "next/image";
import { documentLifecycleLabels, documentReviewLabels, formatDocumentDate } from "@/components/documents/annotated-document-labels";
import type { ArticleAnnotatedDocument } from "@/lib/content/annotated-documents";

type DocumentVersion = ArticleAnnotatedDocument["versions"][number];
type JurisdictionVariant = ArticleAnnotatedDocument["jurisdictionVariants"][number];

export function AnnotatedDocumentVersionContent({
  family,
  version,
  jurisdictionVariant,
  jurisdiction,
  documentVersionKey,
  activeFieldId,
  onSelectField,
}: Readonly<{
  family: ArticleAnnotatedDocument;
  version: DocumentVersion;
  jurisdictionVariant: JurisdictionVariant | undefined;
  jurisdiction: string;
  documentVersionKey: string;
  activeFieldId: string | undefined;
  onSelectField: (fieldId: string, label: string) => void;
}>) {
  const fields = version.sections.flatMap(({ fields }) => fields);

  return (
    <>
      <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide">
        <span className={version.lifecycle === "current" ? "rounded-full bg-teal-100 px-3 py-1 text-teal-800" : "rounded-full bg-slate-200 px-3 py-1 text-slate-700"}>{documentLifecycleLabels[version.lifecycle]}</span>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800">{documentReviewLabels[version.reviewStatus]}</span>
        {jurisdictionVariant && <span className="rounded-full bg-white px-3 py-1 text-slate-600">{jurisdictionVariant.label}</span>}
        <span className="rounded-full bg-white px-3 py-1 text-slate-600">{version.label}</span>
        {version.validFrom && <span className="rounded-full bg-white px-3 py-1 text-slate-600">From {formatDocumentDate(version.validFrom)}</span>}
        {version.validThrough && <span className="rounded-full bg-white px-3 py-1 text-slate-600">Issued through {formatDocumentDate(version.validThrough)}</span>}
      </div>

      {version.lifecycle === "superseded" && (
        <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><strong>Archived version:</strong> Use this to understand a document issued in the stated period, not as a current application form.</p>
      )}
      <p className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold leading-6 text-rose-950">{version.notice}</p>

      {version.officialVisuals.length > 0 && (
        <section className="mt-6" aria-labelledby={`${documentVersionKey}-official-visuals-heading`}>
          <h4 id={`${documentVersionKey}-official-visuals-heading`} className="text-xl font-semibold text-slate-950">Official visual reference</h4>
          <p className="mt-2 text-sm leading-6 text-slate-600">The official image is shown separately from Nihonest’s semantic explanation. Numbered annotations below describe the document concepts without altering the source asset.</p>
          <div className="mt-4 grid gap-5">
            {version.officialVisuals.map((visual) => visual.source && visual.rightsSource ? (
              <figure key={visual.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <a href={visual.assetUrl} target="_blank" rel="noreferrer" className="block bg-slate-100 p-4 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-700">
                  <Image src={visual.assetUrl} width={visual.width} height={visual.height} alt={visual.alt} unoptimized className="mx-auto h-auto max-h-[34rem] w-auto max-w-full object-contain" />
                </a>
                <figcaption className="border-t border-slate-200 p-4 text-xs leading-5 text-slate-600">
                  {visual.caption} Source: <a href={visual.assetUrl} target="_blank" rel="noreferrer" className="font-medium text-teal-800 underline decoration-teal-300 underline-offset-2 hover:text-teal-600">{visual.source.organization} official image<span className="sr-only"> (opens in a new tab)</span></a>. {visual.presentation === "unmodified" ? "Displayed unmodified." : visual.modificationNote} Reuse basis: <a href={visual.rightsSource.url} target="_blank" rel="noreferrer" className="font-medium text-teal-800 underline decoration-teal-300 underline-offset-2 hover:text-teal-600">{visual.rightsSource.title}<span className="sr-only"> (opens in a new tab)</span></a>.
                </figcaption>
              </figure>
            ) : null)}
          </div>
        </section>
      )}

      <div className="mt-6 rounded-2xl border-2 border-slate-300 bg-white p-4 shadow-sm sm:p-6" role="group" aria-label={`Fictional concept map of ${family.title}, ${jurisdictionVariant?.label ?? jurisdiction}, ${version.label}`}>
        <div className="border-b-2 border-slate-200 pb-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-700">Fictional example · {version.officialVisuals.length > 0 ? "interactive explanation" : "official image unavailable"}</p>
          <p className="mt-2 font-semibold text-slate-950">{family.japaneseName} / {family.title}</p>
          <p className="mt-1 text-xs text-slate-500">Concept map — not an exact layout replica</p>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {version.sections.map((section) => (
            <section key={section.id} aria-labelledby={`${documentVersionKey}-${section.id}-heading`}>
              <h4 id={`${documentVersionKey}-${section.id}-heading`} className="text-sm font-semibold text-slate-700">{section.label}</h4>
              <div className="mt-3 grid gap-2">
                {section.fields.map((field) => (
                  <button key={field.id} type="button" aria-pressed={activeFieldId === field.id} aria-label={`Show explanation for ${field.label}`} aria-controls={`${documentVersionKey}-${field.id}-explanation`} onClick={() => onSelectField(field.id, field.label)} className={`group flex min-h-14 items-start gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${activeFieldId === field.id ? "border-teal-600 bg-teal-50" : "border-slate-200 bg-slate-50 hover:border-teal-400"}`}>
                    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-teal-800 text-xs font-bold text-white">{field.number}</span>
                    <span><span lang="ja" className="block text-xs font-semibold text-slate-500">{field.japaneseLabel}</span><span className="mt-1 block text-sm font-medium text-slate-950">{field.exampleValue}</span></span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <h4 className="mt-7 text-xl font-semibold text-slate-950">Field explanations</h4>
      <ol className="mt-4 space-y-3">
        {fields.map((field) => (
          <li key={field.id} id={`${documentVersionKey}-${field.id}-explanation`} tabIndex={-1} className={`rounded-2xl border p-4 outline-none ${activeFieldId === field.id ? "border-teal-500 bg-teal-50" : "border-slate-200 bg-white"}`}>
            <div className="flex gap-3">
              <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-teal-800 text-xs font-bold text-white">{field.number}</span>
              <div>
                <h5 className="font-semibold text-slate-950">{field.label} <span lang="ja" className="font-normal text-slate-500">· {field.japaneseLabel}</span></h5>
                <p className="mt-2 leading-7 text-slate-600">{field.explanation}</p>
                {field.caution && <p className="mt-2 text-sm font-medium leading-6 text-amber-900">Caution: {field.caution}</p>}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-7 border-t border-slate-200 pt-5">
        <h4 className="font-semibold text-slate-950">Verify the current official document</h4>
        <ul className="mt-3 space-y-2 text-sm">
          {version.sources.map((source) => (
            <li key={source.id}>
              <a href={source.url} target="_blank" rel="noreferrer" lang={source.language} className="font-medium text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">{source.title} — {source.organization}<span className="sr-only"> (opens in a new tab)</span></a>
              <span className="ml-2 text-slate-500">({source.language === "en" ? "English" : "Japanese"})</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-5 text-slate-500">Sources checked {formatDocumentDate(version.lastCheckedAt)}. Link checks do not replace substantive editorial review.</p>
      </div>
    </>
  );
}
