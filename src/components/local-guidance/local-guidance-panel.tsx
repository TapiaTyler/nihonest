"use client";

import { useSyncExternalStore } from "react";
import type { ArticleLocalGuidance } from "@/lib/content/local-guidance";
import {
  getLocalGuidanceLocationSnapshot,
  subscribeToLocalGuidanceLocation,
  writeLocalGuidanceLocation,
} from "@/lib/storage/local-guidance-location";

const geographyTypeLabels = {
  "special-ward": "Tokyo special ward",
  "designated-city": "designated city",
  prefecture: "prefecture",
  metropolis: "metropolis",
} as const;

export function LocalGuidancePanel({ options }: { options: readonly ArticleLocalGuidance[] }) {
  const selectedId = useSyncExternalStore(
    subscribeToLocalGuidanceLocation,
    getLocalGuidanceLocationSnapshot,
    () => "",
  );
  const selected = options.find(({ geography }) => geography.id === selectedId);

  return (
    <section className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-7" aria-labelledby="local-guidance-heading">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Optional local context</p>
          <h2 id="local-guidance-heading" className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Local guidance</h2>
          <p className="mt-2 max-w-xl leading-7 text-slate-600">Choose a pilot location to add its current office route and official sources. The national guidance above remains available for everyone.</p>
        </div>
        <label className="min-w-56 text-sm font-semibold text-slate-800" htmlFor="local-guidance-location">
          Your location
          <select
            id="local-guidance-location"
            className="app-select mt-2 block min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 focus:border-teal-700 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700"
            value={selectedId}
            onChange={(event) => writeLocalGuidanceLocation(event.target.value)}
          >
            <option value="">Not selected</option>
            {options.map(({ geography }) => <option key={geography.id} value={geography.id}>{geography.name}</option>)}
          </select>
        </label>
      </div>

      {!selected ? (
        <p className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm leading-6 text-slate-600">
          The pilot currently supports Shinjuku City and Nagoya City. Leave this unselected if neither applies.
        </p>
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
