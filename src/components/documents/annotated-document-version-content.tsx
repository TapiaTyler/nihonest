import Image from "next/image";
import { documentLifecycleMessageIds, documentReviewMessageIds, formatDocumentDate, type DocumentText } from "@/components/documents/annotated-document-labels";
import { useInterfaceMessages } from "@/components/localization/interface-text";
import { LocalizedSourceName, sourceNameParts } from "@/components/content/localized-source-name";
import type { ArticleAnnotatedDocument } from "@/lib/content/annotated-documents";

type DocumentVersion = ArticleAnnotatedDocument["versions"][number];
type JurisdictionVariant = ArticleAnnotatedDocument["jurisdictionVariants"][number];

export function AnnotatedDocumentVersionContent({
  family,
  content,
  version,
  jurisdictionVariant,
  jurisdiction,
  documentVersionKey,
  activeFieldId,
  onSelectField,
}: Readonly<{
  family: ArticleAnnotatedDocument;
  content: DocumentText;
  version: DocumentVersion;
  jurisdictionVariant: JurisdictionVariant | undefined;
  jurisdiction: string;
  documentVersionKey: string;
  activeFieldId: string | undefined;
  onSelectField: (fieldId: string, label: string) => void;
}>) {
  const { locale, message, format } = useInterfaceMessages();
  const fields = version.sections.flatMap((section) => section.fields.map((field) => ({ field, section })));
  const versionPath = content.versionPath(version, jurisdictionVariant);
  const text = (path: string, english: string) => content.text(`${versionPath}.${path}`, english);
  const fieldText = (sectionId: string, field: DocumentVersion["sections"][number]["fields"][number]) => {
    const path = `sections.${sectionId}.fields.${field.id}`;
    return {
      label: text(`${path}.label`, field.label),
      exampleValue: text(`${path}.example-value`, field.exampleValue),
      explanation: text(`${path}.explanation`, field.explanation),
      caution: field.caution ? text(`${path}.caution`, field.caution) : undefined,
    };
  };
  const versionLabel = text("label", version.label);
  const variantLabel = jurisdictionVariant ? content.text(`variants.${jurisdictionVariant.id}.label`, jurisdictionVariant.label) : undefined;
  const date = (value: string) => formatDocumentDate(value, locale);
  const sourceLanguage = (language: string) => message(language === "en" ? "sources.language.english" : "sources.language.japanese");

  return (
    <>
      <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide">
        <span className={version.lifecycle === "current" ? "rounded-full bg-brand-softer px-3 py-1 text-brand-link" : "rounded-full bg-slate-200 px-3 py-1 text-slate-700"}>{message(documentLifecycleMessageIds[version.lifecycle])}</span>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800">{message(documentReviewMessageIds[version.reviewStatus])}</span>
        {variantLabel && <span lang={content.lang} className="rounded-full bg-white px-3 py-1 text-slate-600">{variantLabel}</span>}
        <span lang={content.lang} className="rounded-full bg-white px-3 py-1 text-slate-600">{versionLabel}</span>
        {version.validFrom && <span className="rounded-full bg-white px-3 py-1 text-slate-600">{format("documents.validFrom", { date: date(version.validFrom) })}</span>}
        {version.validThrough && <span className="rounded-full bg-white px-3 py-1 text-slate-600">{format("documents.validThrough", { date: date(version.validThrough) })}</span>}
      </div>

      {version.lifecycle === "superseded" && (
        <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><strong>{message("documents.archivedLabel")}</strong> {message("documents.archivedNote")}</p>
      )}
      <p lang={content.lang} className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold leading-6 text-rose-950">{text("notice", version.notice)}</p>

      {version.officialVisuals.length > 0 && (
        <section className="mt-6" aria-labelledby={`${documentVersionKey}-official-visuals-heading`}>
          <h4 id={`${documentVersionKey}-official-visuals-heading`} className="text-xl font-semibold text-slate-950">{message("documents.officialVisuals")}</h4>
          <p className="mt-2 text-sm leading-6 text-slate-600">{message("documents.officialVisualsIntro")}</p>
          <div className="mt-4 grid gap-5">
            {version.officialVisuals.map((visual) => visual.source && visual.rightsSource ? (
              <figure key={visual.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <a href={visual.assetUrl} target="_blank" rel="noreferrer" className="block bg-slate-100 p-4 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus">
                  {/* A definite width (natural size, capped by the frame and a 34rem height) plus the aspect ratio lets the browser reserve the space before the lazy image loads. */}
                  <Image src={visual.assetUrl} width={visual.width} height={visual.height} alt={text(`visuals.${visual.id}.alt`, visual.alt)} unoptimized className="mx-auto block h-auto"
                    style={{ aspectRatio: `${visual.width} / ${visual.height}`, width: `min(100%, ${visual.width}px, calc(34rem * ${visual.width} / ${visual.height}))` }} />
                </a>
                <figcaption className="border-t border-slate-200 p-4 text-xs leading-5 text-slate-600">
                  <span lang={content.lang}>{text(`visuals.${visual.id}.caption`, visual.caption)}</span> {message("documents.visualSource")} <a href={visual.assetUrl} target="_blank" rel="noreferrer" className="font-medium text-brand-link underline decoration-brand-300 underline-offset-2 hover:text-brand-link-hover">{format("documents.officialImage", { organization: sourceNameParts(visual.source, locale).organization.text })}<span className="sr-only">{message("sources.openNewTab")}</span></a>{locale === "ja" ? "。" : "."} {visual.presentation === "unmodified" ? message("documents.displayedUnmodified") : <span lang={content.lang}>{text(`visuals.${visual.id}.modification-note`, visual.modificationNote ?? "")}</span>} {message("documents.reuseBasis")} <a href={visual.rightsSource.url} target="_blank" rel="noreferrer" className="font-medium text-brand-link underline decoration-brand-300 underline-offset-2 hover:text-brand-link-hover"><LocalizedSourceName source={visual.rightsSource} part="title" /><span className="sr-only">{message("sources.openNewTab")}</span></a>{locale === "ja" ? "。" : "."}
                </figcaption>
              </figure>
            ) : null)}
          </div>
        </section>
      )}

      <div className="mt-6 rounded-2xl border-2 border-slate-300 bg-white p-4 shadow-sm sm:p-6" role="group" aria-label={format("documents.conceptMapLabel", { title: locale === "ja" ? family.japaneseName : family.title, jurisdiction: variantLabel ?? jurisdiction, version: versionLabel })}>
        <div className="border-b-2 border-slate-200 pb-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-700">{message(version.officialVisuals.length > 0 ? "documents.fictionalInteractive" : "documents.fictionalNoImage")}</p>
          <p className="mt-2 font-semibold text-slate-950"><span lang="ja">{family.japaneseName}</span>{locale === "ja" ? null : <> / {family.title}</>}</p>
          <p className="mt-1 text-xs text-slate-500">{message("documents.notReplica")}</p>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {version.sections.map((section) => (
            <section key={section.id} aria-labelledby={`${documentVersionKey}-${section.id}-heading`}>
              <h4 id={`${documentVersionKey}-${section.id}-heading`} className="text-sm font-semibold text-slate-700" lang={content.lang}>{text(`sections.${section.id}.label`, section.label)}</h4>
              <div className="mt-3 grid gap-2">
                {section.fields.map((field) => {
                  const localized = fieldText(section.id, field);
                  return (
                  <button key={field.id} type="button" aria-pressed={activeFieldId === field.id} aria-label={format("documents.showExplanation", { label: localized.label })} aria-controls={`${documentVersionKey}-${field.id}-explanation`} onClick={() => onSelectField(field.id, localized.label)} className={`group flex min-h-14 items-start gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${activeFieldId === field.id ? "border-brand-600 bg-brand-soft" : "border-slate-200 bg-slate-50 hover:border-brand-400"}`}>
                    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">{field.number}</span>
                    <span><span lang="ja" className="block text-xs font-semibold text-slate-500">{field.japaneseLabel}</span><span lang={content.lang} className="mt-1 block text-sm font-medium text-slate-950">{localized.exampleValue}</span></span>
                  </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      <h4 className="mt-7 text-xl font-semibold text-slate-950">{message("documents.fieldExplanations")}</h4>
      <ol className="mt-4 space-y-3">
        {fields.map(({ field, section }) => {
          const localized = fieldText(section.id, field);
          return (
          <li key={field.id} id={`${documentVersionKey}-${field.id}-explanation`} tabIndex={-1} className={`rounded-2xl border p-4 outline-none ${activeFieldId === field.id ? "border-brand-500 bg-brand-soft" : "border-slate-200 bg-white"}`}>
            <div className="flex gap-3">
              <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">{field.number}</span>
              <div>
                <h5 className="font-semibold text-slate-950"><span lang={content.lang}>{localized.label}</span>{localized.label !== field.japaneseLabel && <span lang="ja" className="font-normal text-slate-500"> · {field.japaneseLabel}</span>}</h5>
                <p lang={content.lang} className="mt-2 leading-7 text-slate-600">{localized.explanation}</p>
                {localized.caution && <p className="mt-2 text-sm font-medium leading-6 text-amber-900">{message("documents.caution")} <span lang={content.lang}>{localized.caution}</span></p>}
              </div>
            </div>
          </li>
          );
        })}
      </ol>

      <div className="mt-7 border-t border-slate-200 pt-5">
        <h4 className="font-semibold text-slate-950">{message("documents.verifyHeading")}</h4>
        <ul className="mt-3 space-y-2 text-sm">
          {version.sources.map((source) => (
            <li key={source.id}>
              <a href={source.url} target="_blank" rel="noreferrer" className="font-medium text-brand-link underline decoration-brand-300 underline-offset-4 hover:text-brand-link-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"><LocalizedSourceName source={source} /><span className="sr-only">{message("sources.openNewTab")}</span></a>
              <span className="ml-2 text-slate-500">{locale === "ja" ? `（${sourceLanguage(source.language)}）` : `(${sourceLanguage(source.language)})`}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-5 text-slate-500">{format("documents.sourcesChecked", { date: date(version.lastCheckedAt) })}</p>
      </div>
    </>
  );
}
