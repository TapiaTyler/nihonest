"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { ArticleLocalGuidance, SelectableLocalGuidanceLocation } from "@/lib/content/local-guidance";
import { getGeneralLocalAdvice } from "@/data/local-guidance/general-advice";
import {
  getLocalGuidanceLocationSnapshot,
  subscribeToLocalGuidanceLocation,
  writeLocalGuidanceLocation,
} from "@/lib/storage/local-guidance-location";

const geographyTypeLabels = {
  "special-ward": "Tokyo special ward",
  "designated-city": "designated city",
  "administrative-ward": "designated-city ward",
  city: "city",
  town: "town",
  village: "village",
  prefecture: "prefecture",
  metropolis: "metropolis",
} as const;

export function LocalGuidancePanel({
  articleId,
  options,
  locations,
  linkedLocationId,
}: {
  articleId?: string;
  options: readonly ArticleLocalGuidance[];
  locations: readonly SelectableLocalGuidanceLocation[];
  linkedLocationId?: string;
}) {
  const savedId = useSyncExternalStore(
    subscribeToLocalGuidanceLocation,
    getLocalGuidanceLocationSnapshot,
    () => "",
  );
  const [linkedSelectionId, setLinkedSelectionId] = useState(
    linkedLocationId && locations.some(({ geography }) => geography.id === linkedLocationId) ? linkedLocationId : "",
  );
  useEffect(() => subscribeToLocalGuidanceLocation(() => setLinkedSelectionId("")), []);
  const selectedId = linkedSelectionId || savedId;
  const sortedLocations = [...locations].sort((left, right) => (
    left.parentName.localeCompare(right.parentName, "en")
    || left.geography.name.localeCompare(right.geography.name, "en")
  ));
  const selectedLocation = sortedLocations.find(({ geography }) => geography.id === selectedId);
  const selected = options.find(({ geography }) => geography.id === selectedId);
  const generalAdvice = getGeneralLocalAdvice(articleId ?? options[0]?.supplement.articleId ?? "");
  const [pendingPrefectureId, setPendingPrefectureId] = useState("");
  const prefectureOptions = sortedLocations.filter(({ geography }) => geography.type === "prefecture" || geography.type === "metropolis");
  const selectedPrefectureId = selectedLocation?.prefectureId ?? pendingPrefectureId;
  const municipalityOptions = sortedLocations.filter(({ geography, prefectureId }) => (
    prefectureId === selectedPrefectureId && geography.id !== selectedPrefectureId
  ));

  return (
    <section className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-7" aria-labelledby="local-guidance-heading">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Optional local context</p>
          <h2 id="local-guidance-heading" className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Local guidance</h2>
          <p className="mt-2 max-w-xl leading-7 text-slate-600">Choose a prefecture or listed municipality to see researched guidance where available, or general steps for finding the local procedure. The national guidance above remains available for everyone.</p>
        </div>
        <div className="grid gap-4 sm:min-w-96 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-800" htmlFor="local-guidance-prefecture">
            Prefecture
            <select
              id="local-guidance-prefecture"
              className="app-select mt-2 block min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 focus:border-teal-700 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700"
              value={selectedPrefectureId}
              onChange={(event) => {
                setPendingPrefectureId(event.target.value);
                setLinkedSelectionId("");
                writeLocalGuidanceLocation(event.target.value);
              }}
            >
              <option value="">Not selected</option>
              {prefectureOptions.map(({ geography }) => <option key={geography.id} value={geography.id}>{geography.name}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-800" htmlFor="local-guidance-location">
            Municipality
            <select
              id="local-guidance-location"
              className="app-select mt-2 block min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 focus:border-teal-700 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
              value={selectedLocation?.prefectureId === selectedPrefectureId && selectedId !== selectedPrefectureId ? selectedId : ""}
              disabled={!selectedPrefectureId}
              onChange={(event) => {
                setLinkedSelectionId("");
                writeLocalGuidanceLocation(event.target.value);
              }}
            >
              <option value="">Select municipality</option>
              {municipalityOptions.map(({ geography }) => <option key={geography.id} value={geography.id}>{geography.name}</option>)}
            </select>
          </label>
        </div>
      </div>

      {linkedSelectionId && (
        <p className="mt-5 text-sm leading-6 text-slate-700">
          Showing the municipality linked from the prefecture finder for this page only. Your saved local guidance location has not changed.
        </p>
      )}

      {!selectedId ? (
        <p className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm leading-6 text-slate-600">
          Select a prefecture or municipality to see what to check locally. Researched guidance currently covers a limited set of municipalities.
        </p>
      ) : !selected && selectedLocation && generalAdvice ? (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-white p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">General guidance · local research pending</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">{generalAdvice.title}</h3>
          <p className="mt-3 leading-7 text-slate-700">Research for {selectedLocation.geography.name} on this article has not been done yet. The steps below are general advice, not verified instructions for this location.</p>
          {selectedLocation.geography.type === "administrative-ward" && <p className="mt-2 leading-7 text-slate-700">This is a ward of a designated city. Check the city&apos;s official procedure and which ward office handles your address.</p>}
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-slate-700">{generalAdvice.steps.map((step) => <li key={step}>{step}</li>)}</ul>
        </div>
      ) : !selected ? (
        <p className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm leading-6 text-slate-600">No researched guidance is available for this selection on this article. Check the responsible official website for your address.</p>
      ) : (
        <div className="mt-6 rounded-2xl border border-teal-200 bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                {geographyTypeLabels[selected.geography.type]}{selected.parentName ? ` · ${selected.parentName}` : ""}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-950">{selected.supplement.title}</h3>
            </div>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">Editorial review</span>
          </div>
          <p className="mt-3 leading-7 text-slate-700">{selected.supplement.summary}</p>
          <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
            <div><dt className="font-semibold text-slate-950">Applies when</dt><dd className="mt-1 leading-6 text-slate-600">{selected.supplement.applicability}</dd></div>
            <div><dt className="font-semibold text-slate-950">Responsible body</dt><dd className="mt-1 leading-6 text-slate-600">{selected.supplement.responsibleBody}{selected.supplement.receivingOffice ? ` — ${selected.supplement.receivingOffice}` : ""}</dd></div>
          </dl>
          <div className="mt-5 space-y-4">
            {selected.supplement.actions.map((action) => (
              <div key={action.title}>
                <h4 className="font-semibold text-slate-950">{action.title}</h4>
                <p className="mt-1 leading-7 text-slate-600">{action.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-slate-200 pt-5">
            <p className="text-sm font-semibold text-slate-950">Current local sources</p>
            <ul className="mt-3 space-y-2 text-sm">
              {selected.sources.map((source) => (
                <li key={source.id}>
                  <a href={source.url} target="_blank" rel="noreferrer" lang={source.language} className="font-medium text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                    {source.organization}: {source.title}
                  </a>
                  <span className="ml-2 text-slate-500">({source.language === "en" ? "English" : "Japanese"})</span>
                </li>
              ))}
            </ul>
            {selected.supplement.sourceFormatNote && <p className="mt-3 text-sm leading-6 text-slate-600">{selected.supplement.sourceFormatNote}</p>}
            <p className="mt-3 text-xs text-slate-500">Source links checked {selected.supplement.lastCheckedAt}. Confirm live hours, forms, fees, and emergency instructions with the responsible body.</p>
          </div>
        </div>
      )}
    </section>
  );
}
