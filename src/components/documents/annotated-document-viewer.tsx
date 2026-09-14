"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import type { ArticleAnnotatedDocument } from "@/lib/content/annotated-documents";
import {
  getLocalGuidanceLocationSnapshot,
  subscribeToLocalGuidanceLocation,
  writeLocalGuidanceLocation,
} from "@/lib/storage/local-guidance-location";

const lifecycleLabels = {
  current: "Current",
  superseded: "Archived",
  future: "Future",
} as const;

const reviewLabels = {
  "needs-review": "Editorial review",
  verified: "Verified",
  stale: "Stale",
} as const;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

function DocumentFamilyViewer({ family }: { family: ArticleAnnotatedDocument }) {
  const selectedLocationId = useSyncExternalStore(
    subscribeToLocalGuidanceLocation,
    getLocalGuidanceLocationSnapshot,
    () => "",
  );
  const sortedVariants = [...family.jurisdictionVariants].sort((left, right) => (
    left.parentGeography.name.localeCompare(right.parentGeography.name, "en")
    || left.geography.name.localeCompare(right.geography.name, "en")
  ));
  const defaultVariant = sortedVariants[0];
  const jurisdictionVariant = sortedVariants.find(({ geographyId }) => geographyId === selectedLocationId) ?? defaultVariant;
  const prefectures = sortedVariants.filter((variant, index, variants) => (
    variants.findIndex(({ parentGeography }) => parentGeography.id === variant.parentGeography.id) === index
  ));
  const municipalityOptions = sortedVariants.filter(({ parentGeography }) => parentGeography.id === jurisdictionVariant?.parentGeography.id);
  const availableVersions = jurisdictionVariant?.versions ?? family.versions;
  const defaultVersion = availableVersions.find(({ lifecycle }) => lifecycle === "current") ?? availableVersions[0];
  const [versionId, setVersionId] = useState(defaultVersion.id);
  const [activeFieldId, setActiveFieldId] = useState<string>();
  const [announcement, setAnnouncement] = useState("");
  const version = availableVersions.find(({ id }) => id === versionId) ?? defaultVersion;
  const fields = version.sections.flatMap(({ fields }) => fields);
  const selectionKey = jurisdictionVariant?.id ?? "general";
  const issuer = jurisdictionVariant?.issuer ?? family.issuer;
  const jurisdiction = jurisdictionVariant?.jurisdiction ?? family.jurisdiction;
  const documentVersionKey = jurisdictionVariant ? `${family.id}-${selectionKey}-${version.id}` : `${family.id}-${version.id}`;

  function selectJurisdiction(nextVariant: (typeof sortedVariants)[number] | undefined) {
    if (!nextVariant) return;
    const nextVersion = nextVariant.versions.find(({ lifecycle }) => lifecycle === "current") ?? nextVariant.versions[0];
    writeLocalGuidanceLocation(nextVariant.geographyId);
    setVersionId(nextVersion.id);
    setActiveFieldId(undefined);
    setAnnouncement(`${nextVariant.label}, ${nextVersion.label}, selected. Local guidance on this page was updated.`);
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
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Annotated document</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{family.title}</h3>
          <p lang="ja" className="mt-1 font-medium text-slate-600">{family.japaneseName}</p>
        </span>
        <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5 shrink-0 text-slate-500 transition-transform group-open:rotate-180"><path d="m5 7.5 5 5 5-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>
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
          {(family.jurisdictionVariants.length > 0 || availableVersions.length > 1) && <div className="grid min-w-64 gap-4">
            {family.jurisdictionVariants.length > 0 && (
              <>
                <label className="text-sm font-semibold text-slate-800" htmlFor={`${family.id}-prefecture`}>
                  Prefecture
                  <select
                    id={`${family.id}-prefecture`}
                    className="app-select mt-2 block min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 focus:border-teal-700 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700"
                    value={jurisdictionVariant?.parentGeography.id ?? ""}
                    onChange={(event) => selectJurisdiction(sortedVariants.find(({ parentGeography }) => parentGeography.id === event.target.value))}
                  >
                    {prefectures.map(({ parentGeography }) => <option key={parentGeography.id} value={parentGeography.id}>{parentGeography.name}</option>)}
                  </select>
                </label>
                <label className="text-sm font-semibold text-slate-800" htmlFor={`${family.id}-jurisdiction`}>
                  Municipality
                  <select
                    id={`${family.id}-jurisdiction`}
                    className="app-select mt-2 block min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 focus:border-teal-700 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700"
                    value={jurisdictionVariant?.geographyId ?? ""}
                    onChange={(event) => selectJurisdiction(sortedVariants.find(({ geographyId }) => geographyId === event.target.value))}
                  >
                    {municipalityOptions.map((option) => <option key={option.id} value={option.geographyId}>{option.label}</option>)}
                  </select>
                </label>
              </>
            )}
            {availableVersions.length > 1 && (
              <label className="text-sm font-semibold text-slate-800" htmlFor={`${family.id}-${selectionKey}-version`}>
                Document version
                <select
                  id={`${family.id}-${selectionKey}-version`}
                  className="app-select mt-2 block min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 focus:border-teal-700 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700"
                  value={version.id}
                  onChange={(event) => {
                    const next = availableVersions.find(({ id }) => id === event.target.value) ?? defaultVersion;
                    setVersionId(next.id);
                    setActiveFieldId(undefined);
                    setAnnouncement(`${next.label}, ${lifecycleLabels[next.lifecycle]}, selected.`);
                  }}
                >
                  {availableVersions.map((option) => <option key={option.id} value={option.id}>{option.label} — {lifecycleLabels[option.lifecycle]}</option>)}
                </select>
              </label>
            )}
          </div>}
        </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide">
        <span className={version.lifecycle === "current" ? "rounded-full bg-teal-100 px-3 py-1 text-teal-800" : "rounded-full bg-slate-200 px-3 py-1 text-slate-700"}>{lifecycleLabels[version.lifecycle]}</span>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800">{reviewLabels[version.reviewStatus]}</span>
        {jurisdictionVariant && <span className="rounded-full bg-white px-3 py-1 text-slate-600">{jurisdictionVariant.label}</span>}
        <span className="rounded-full bg-white px-3 py-1 text-slate-600">{version.label}</span>
        {version.validFrom && <span className="rounded-full bg-white px-3 py-1 text-slate-600">From {formatDate(version.validFrom)}</span>}
        {version.validThrough && <span className="rounded-full bg-white px-3 py-1 text-slate-600">Issued through {formatDate(version.validThrough)}</span>}
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
                  <Image
                    src={visual.assetUrl}
                    width={visual.width}
                    height={visual.height}
                    alt={visual.alt}
                    unoptimized
                    className="mx-auto h-auto max-h-[34rem] w-auto max-w-full object-contain"
                  />
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
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-700">
            Fictional example · {version.officialVisuals.length > 0 ? "interactive explanation" : "official image unavailable"}
          </p>
          <p className="mt-2 font-semibold text-slate-950">{family.japaneseName} / {family.title}</p>
          <p className="mt-1 text-xs text-slate-500">Concept map — not an exact layout replica</p>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {version.sections.map((section) => (
            <section key={section.id} aria-labelledby={`${documentVersionKey}-${section.id}-heading`}>
              <h4 id={`${documentVersionKey}-${section.id}-heading`} className="text-sm font-semibold text-slate-700">{section.label}</h4>
              <div className="mt-3 grid gap-2">
                {section.fields.map((field) => (
                  <button
                    key={field.id}
                    type="button"
                    aria-pressed={activeFieldId === field.id}
                    aria-label={`Show explanation for ${field.label}`}
                    aria-controls={`${documentVersionKey}-${field.id}-explanation`}
                    onClick={() => selectField(field.id, field.label)}
                    className={`group flex min-h-14 items-start gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${activeFieldId === field.id ? "border-teal-600 bg-teal-50" : "border-slate-200 bg-slate-50 hover:border-teal-400"}`}
                  >
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
          <li
            key={field.id}
            id={`${documentVersionKey}-${field.id}-explanation`}
            tabIndex={-1}
            className={`rounded-2xl border p-4 outline-none ${activeFieldId === field.id ? "border-teal-500 bg-teal-50" : "border-slate-200 bg-white"}`}
          >
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
        <p className="mt-3 text-xs leading-5 text-slate-500">Sources checked {formatDate(version.lastCheckedAt)}. Link checks do not replace substantive editorial review.</p>
      </div>
      <p className="sr-only" aria-live="polite">{announcement}</p>
      </div>
    </details>
  );
}

export function AnnotatedDocumentViewer({ families }: { families: readonly ArticleAnnotatedDocument[] }) {
  if (families.length === 0) return null;
  return (
    <section className="mt-12" aria-labelledby="document-examples-heading">
      <h2 id="document-examples-heading" className="text-2xl font-semibold tracking-tight text-slate-950">Understand the documents</h2>
      <p className="mt-3 leading-7 text-slate-600">These accessible concept maps explain important fields without reproducing a usable identity or immigration document.</p>
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
      <div className="mt-6 space-y-8">{families.map((family) => <DocumentFamilyViewer key={family.id} family={family} />)}</div>
    </section>
  );
}
