import { documentLifecycleLabels } from "@/components/documents/annotated-document-labels";
import type { ArticleAnnotatedDocument } from "@/lib/content/annotated-documents";

type JurisdictionVariant = ArticleAnnotatedDocument["jurisdictionVariants"][number];
type DocumentVersion = ArticleAnnotatedDocument["versions"][number];

export function AnnotatedDocumentSelectors({
  familyId,
  sortedVariants,
  selectedVariant,
  availableVersions,
  selectedVersion,
  onSelectVariant,
  onSelectVersion,
}: Readonly<{
  familyId: string;
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

  if (sortedVariants.length === 0 && availableVersions.length <= 1) return null;
  return (
    <div className="grid min-w-64 gap-4">
      {sortedVariants.length > 0 && (
        <>
          <label className="text-sm font-semibold text-slate-800" htmlFor={`${familyId}-prefecture`}>
            Prefecture
            <select id={`${familyId}-prefecture`} className="app-select mt-2 block min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 focus:border-teal-700 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700" value={selectedVariant?.parentGeography.id ?? ""} onChange={(event) => onSelectVariant(sortedVariants.find(({ parentGeography }) => parentGeography.id === event.target.value))}>
              {prefectures.map(({ parentGeography }) => <option key={parentGeography.id} value={parentGeography.id}>{parentGeography.name}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-800" htmlFor={`${familyId}-jurisdiction`}>
            Municipality
            <select id={`${familyId}-jurisdiction`} className="app-select mt-2 block min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 focus:border-teal-700 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700" value={selectedVariant?.geographyId ?? ""} onChange={(event) => onSelectVariant(sortedVariants.find(({ geographyId }) => geographyId === event.target.value))}>
              {municipalityOptions.map((option) => <option key={option.id} value={option.geographyId}>{option.label}</option>)}
            </select>
          </label>
        </>
      )}
      {availableVersions.length > 1 && (
        <label className="text-sm font-semibold text-slate-800" htmlFor={`${familyId}-${selectionKey}-version`}>
          Document version
          <select id={`${familyId}-${selectionKey}-version`} className="app-select mt-2 block min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 focus:border-teal-700 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700" value={selectedVersion.id} onChange={(event) => onSelectVersion(availableVersions.find(({ id }) => id === event.target.value) ?? selectedVersion)}>
            {availableVersions.map((option) => <option key={option.id} value={option.id}>{option.label} — {documentLifecycleLabels[option.lifecycle]}</option>)}
          </select>
        </label>
      )}
    </div>
  );
}
