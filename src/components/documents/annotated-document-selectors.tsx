import { documentLifecycleMessageIds, type DocumentText } from "@/components/documents/annotated-document-labels";
import { useInterfaceMessages } from "@/components/localization/interface-text";
import type { ArticleAnnotatedDocument } from "@/lib/content/annotated-documents";

type JurisdictionVariant = ArticleAnnotatedDocument["jurisdictionVariants"][number];
type DocumentVersion = ArticleAnnotatedDocument["versions"][number];

export function AnnotatedDocumentSelectors({
  familyId,
  content,
  sortedVariants,
  selectedVariant,
  availableVersions,
  selectedVersion,
  onSelectVariant,
  onSelectVersion,
}: Readonly<{
  familyId: string;
  content: DocumentText;
  sortedVariants: readonly JurisdictionVariant[];
  selectedVariant: JurisdictionVariant | undefined;
  availableVersions: readonly DocumentVersion[];
  selectedVersion: DocumentVersion;
  onSelectVariant: (variant: JurisdictionVariant | undefined) => void;
  onSelectVersion: (version: DocumentVersion) => void;
}>) {
  const prefectures = sortedVariants.filter((variant, index, variants) => (
    variants.findIndex(({ parentGeography }) => parentGeography.id === variant.parentGeography.id) === index
  ));
  const municipalityOptions = sortedVariants.filter(({ parentGeography }) => parentGeography.id === selectedVariant?.parentGeography.id);
  const selectionKey = selectedVariant?.id ?? "general";
  const { locale, message } = useInterfaceMessages();
  const placeName = (place: { name: string; japaneseName?: string }) => (locale === "ja" && place.japaneseName ? place.japaneseName : place.name);

  if (sortedVariants.length === 0 && availableVersions.length <= 1) return null;
  return (
    <div className="grid min-w-64 gap-4">
      {sortedVariants.length > 0 && (
        <>
          <label className="text-sm font-semibold text-ink-firm" htmlFor={`${familyId}-prefecture`}>
            {message("documents.prefecture")}
            <select id={`${familyId}-prefecture`} className="app-select mt-2 block min-h-11 w-full rounded-xl border border-line-strong bg-surface px-3 text-sm font-normal text-ink-strong focus:border-brand-accent focus:outline-2 focus:outline-offset-2 focus:outline-focus" value={selectedVariant?.parentGeography.id ?? ""} onChange={(event) => onSelectVariant(sortedVariants.find(({ parentGeography }) => parentGeography.id === event.target.value))}>
              {prefectures.map(({ parentGeography }) => <option key={parentGeography.id} value={parentGeography.id}>{placeName(parentGeography)}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold text-ink-firm" htmlFor={`${familyId}-jurisdiction`}>
            {message("documents.municipality")}
            <select id={`${familyId}-jurisdiction`} className="app-select mt-2 block min-h-11 w-full rounded-xl border border-line-strong bg-surface px-3 text-sm font-normal text-ink-strong focus:border-brand-accent focus:outline-2 focus:outline-offset-2 focus:outline-focus" value={selectedVariant?.geographyId ?? ""} onChange={(event) => onSelectVariant(sortedVariants.find(({ geographyId }) => geographyId === event.target.value))}>
              {municipalityOptions.map((option) => <option key={option.id} value={option.geographyId}>{content.japanese ? content.text(`variants.${option.id}.label`, option.label) : locale === "ja" ? placeName(option.geography) : option.label}</option>)}
            </select>
          </label>
        </>
      )}
      {availableVersions.length > 1 && (
        <label className="text-sm font-semibold text-ink-firm" htmlFor={`${familyId}-${selectionKey}-version`}>
          {message("documents.version")}
          <select id={`${familyId}-${selectionKey}-version`} className="app-select mt-2 block min-h-11 w-full rounded-xl border border-line-strong bg-surface px-3 text-sm font-normal text-ink-strong focus:border-brand-accent focus:outline-2 focus:outline-offset-2 focus:outline-focus" value={selectedVersion.id} onChange={(event) => onSelectVersion(availableVersions.find(({ id }) => id === event.target.value) ?? selectedVersion)}>
            {availableVersions.map((option) => <option key={option.id} value={option.id}>{content.text(`${content.versionPath(option, selectedVariant)}.label`, option.label)} — {message(documentLifecycleMessageIds[option.lifecycle])}</option>)}
          </select>
        </label>
      )}
    </div>
  );
}
