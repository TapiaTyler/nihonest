"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { documentLifecycleLabels } from "@/components/documents/annotated-document-labels";
import { DisclosureChevron } from "@/components/navigation/disclosure-chevron";
import { AnnotatedDocumentQuickNavigation } from "@/components/documents/annotated-document-quick-navigation";
import { AnnotatedDocumentSelectors } from "@/components/documents/annotated-document-selectors";
import { AnnotatedDocumentVersionContent } from "@/components/documents/annotated-document-version-content";
import type { ArticleAnnotatedDocument } from "@/lib/content/annotated-documents";
import {
  getLocalGuidanceLocationSnapshot,
  subscribeToLocalGuidanceLocation,
  writeLocalGuidanceLocation,
} from "@/lib/storage/local-guidance-location";

/** Owns jurisdiction, version, callout, announcement, and cross-panel location state for one family. */
function DocumentFamilyViewer({ family, linkedLocationId }: Readonly<{ family: ArticleAnnotatedDocument; linkedLocationId?: string }>) {
  const savedLocationId = useSyncExternalStore(
    subscribeToLocalGuidanceLocation,
    getLocalGuidanceLocationSnapshot,
    () => "",
  );
  const sortedVariants = [...family.jurisdictionVariants].sort((left, right) => (
    left.parentGeography.name.localeCompare(right.parentGeography.name, "en")
    || left.geography.name.localeCompare(right.geography.name, "en")
  ));
  const [linkedSelectionId, setLinkedSelectionId] = useState(
    linkedLocationId && sortedVariants.some(({ geographyId }) => geographyId === linkedLocationId) ? linkedLocationId : "",
  );
  useEffect(() => subscribeToLocalGuidanceLocation(() => setLinkedSelectionId("")), []);
  const selectedLocationId = linkedSelectionId || savedLocationId;
  const defaultVariant = sortedVariants[0];
  const jurisdictionVariant = sortedVariants.find(({ geographyId }) => geographyId === selectedLocationId) ?? defaultVariant;
  const availableVersions = jurisdictionVariant?.versions ?? family.versions;
  const defaultVersion = availableVersions.find(({ lifecycle }) => lifecycle === "current") ?? availableVersions[0];
  const [versionId, setVersionId] = useState(defaultVersion.id);
  const [activeFieldId, setActiveFieldId] = useState<string>();
  const [announcement, setAnnouncement] = useState("");
  const version = availableVersions.find(({ id }) => id === versionId) ?? defaultVersion;
  const selectionKey = jurisdictionVariant?.id ?? "general";
  const issuer = jurisdictionVariant?.issuer ?? family.issuer;
  const jurisdiction = jurisdictionVariant?.jurisdiction ?? family.jurisdiction;
  const documentVersionKey = jurisdictionVariant ? `${family.id}-${selectionKey}-${version.id}` : `${family.id}-${version.id}`;

  function selectJurisdiction(nextVariant: (typeof sortedVariants)[number] | undefined) {
    if (!nextVariant) return;
    const nextVersion = nextVariant.versions.find(({ lifecycle }) => lifecycle === "current") ?? nextVariant.versions[0];
    setLinkedSelectionId("");
    writeLocalGuidanceLocation(nextVariant.geographyId);
    setVersionId(nextVersion.id);
    setActiveFieldId(undefined);
    setAnnouncement(`${nextVariant.label}, ${nextVersion.label}, selected. Local guidance on this page was updated.`);
  }

  function selectVersion(nextVersion: typeof version) {
    setVersionId(nextVersion.id);
    setActiveFieldId(undefined);
    setAnnouncement(`${nextVersion.label}, ${documentLifecycleLabels[nextVersion.lifecycle]}, selected.`);
  }

  function selectField(fieldId: string, label: string) {
    setActiveFieldId(fieldId);
    setAnnouncement(`${label} explanation selected.`);
    requestAnimationFrame(() => document.getElementById(`${documentVersionKey}-${fieldId}-explanation`)?.focus());
  }

  return (
    <details id={`document-${family.id}`} open className="group scroll-mt-24 rounded-3xl border border-slate-200 bg-slate-50">
      <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-4 rounded-3xl bg-white p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 [&::-webkit-details-marker]:hidden sm:p-7">
        <span>
          <span className="block text-xs font-semibold uppercase tracking-wide text-teal-700">Annotated document</span>
          <span role="heading" aria-level={3} className="mt-2 block text-2xl font-semibold tracking-tight text-slate-950">{family.title}</span>
          <span lang="ja" className="mt-1 block font-medium text-slate-600">{family.japaneseName}</span>
        </span>
        <DisclosureChevron />
      </summary>

      <div className="border-t border-slate-200 p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="leading-7 text-slate-600">{family.description}</p>
            <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              <div><dt className="inline font-semibold text-slate-800">Issuer: </dt><dd className="inline text-slate-600">{issuer}</dd></div>
              <div><dt className="inline font-semibold text-slate-800">Jurisdiction: </dt><dd className="inline text-slate-600">{jurisdiction}</dd></div>
            </dl>
          </div>
          <AnnotatedDocumentSelectors
            familyId={family.id}
            sortedVariants={sortedVariants}
            selectedVariant={jurisdictionVariant}
            availableVersions={availableVersions}
            selectedVersion={version}
            onSelectVariant={selectJurisdiction}
            onSelectVersion={selectVersion}
          />
        </div>
        <AnnotatedDocumentVersionContent
          family={family}
          version={version}
          jurisdictionVariant={jurisdictionVariant}
          jurisdiction={jurisdiction}
          documentVersionKey={documentVersionKey}
          activeFieldId={activeFieldId}
          onSelectField={selectField}
        />
        <p className="sr-only" aria-live="polite">{announcement}</p>
      </div>
    </details>
  );
}

export function AnnotatedDocumentViewer({ families, linkedLocationId }: Readonly<{ families: readonly ArticleAnnotatedDocument[]; linkedLocationId?: string }>) {
  if (families.length === 0) return null;
  return (
    <section className="mt-12" aria-labelledby="document-examples-heading">
      <h2 id="document-examples-heading" className="text-2xl font-semibold tracking-tight text-slate-950">Understand the documents</h2>
      <p className="mt-3 leading-7 text-slate-600">These accessible concept maps explain important fields without reproducing a usable identity or immigration document.</p>
      <AnnotatedDocumentQuickNavigation families={families} />
      <div className="mt-6 space-y-8">{families.map((family) => <DocumentFamilyViewer key={family.id} family={family} linkedLocationId={linkedLocationId} />)}</div>
    </section>
  );
}
