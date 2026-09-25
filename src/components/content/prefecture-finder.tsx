"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { searchPrefectures, type FinderPrefecture } from "@/domain/geography/prefecture";
import { groupMunicipalityOptions } from "@/domain/geography/tokyo-areas";
import type { FinderCoverage, FinderMunicipality } from "@/lib/content/prefecture-finder";
import { prefectureGeneralGuides, prefectureNationalGuides } from "@/lib/content/prefecture-finder";
import { prefectureFinderMessages as message } from "./prefecture-finder-messages";

const controlClass = "mt-2 block min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-teal-700 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700";
const linkClass = "font-medium text-teal-800 underline decoration-teal-300 underline-offset-4 hover:text-teal-600 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700";

export function PrefectureFinder({
  locale,
  prefectures,
  municipalities,
  coverage,
}: Readonly<{
  locale: "en" | "ja";
  prefectures: readonly FinderPrefecture[];
  municipalities: readonly FinderMunicipality[];
  coverage: readonly FinderCoverage[];
}>) {
  const searchId = useId();
  const selectId = useId();
  const municipalityId = useId();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [selectedMunicipalityId, setSelectedMunicipalityId] = useState("");
  const matches = searchPrefectures(prefectures, query);
  const selected = prefectures.find(({ id }) => id === selectedId);
  const selectedIsHidden = Boolean(selected && !matches.some(({ id }) => id === selectedId));
  const localCoverage = coverage.find(({ prefectureId }) => prefectureId === selectedId);
  const municipalityOptions = municipalities.filter(({ prefectureId }) => prefectureId === selectedId);
  const selectedMunicipality = municipalityOptions.find(({ id }) => id === selectedMunicipalityId);
  const guidanceLocationId = selectedMunicipality?.id ?? selectedId;
  // Researched supplements are shown only for the selected municipality or ward, never prefecture-wide.
  const municipalityCoverage = localCoverage?.municipalities.find(({ id }) => id === selectedMunicipality?.id);

  return (
    <section className="not-prose rounded-2xl border border-teal-200 bg-teal-50 p-5 sm:p-6" aria-labelledby={`${searchId}-heading`} lang="en">
      <h3 id={`${searchId}-heading`} className="text-xl font-semibold text-slate-950">{message.heading}</h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">{message.intro}</p>
      {locale === "ja" && <p className="mt-2 text-sm leading-6 text-slate-700">{message.fallbackNotice}</p>}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-slate-900" htmlFor={searchId}>{message.searchLabel}</label>
          <input id={searchId} type="search" value={query} placeholder={message.searchPlaceholder} onChange={(event) => setQuery(event.target.value)} className={controlClass} />
          {query && <button type="button" className="mt-2 min-h-11 text-sm font-medium text-teal-900 underline focus:outline-2 focus:outline-offset-2 focus:outline-teal-700" onClick={() => setQuery("")}>{message.clearSearch}</button>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-900" htmlFor={selectId}>{message.selectLabel}</label>
          <select id={selectId} className={controlClass} value={selectedId} onChange={(event) => { setSelectedId(event.target.value); setSelectedMunicipalityId(""); }}>
            <option value="">{message.selectPlaceholder}</option>
            {selectedIsHidden && selected && <option value={selected.id}>{selected.names.en} · {selected.names.ja}</option>}
            {matches.map((prefecture) => <option key={prefecture.id} value={prefecture.id}>{prefecture.names.en} · {prefecture.names.ja}</option>)}
          </select>
          {selected && <button type="button" className="mt-2 min-h-11 text-sm font-medium text-teal-900 underline focus:outline-2 focus:outline-offset-2 focus:outline-teal-700" onClick={() => { setSelectedId(""); setSelectedMunicipalityId(""); }}>{message.clearSelection}</button>}
        </div>
      </div>

      <p className="mt-3 text-sm text-slate-700" role="status" aria-live="polite">{message.resultCount(matches.length)}</p>
      {matches.length === 0 && <p className="mt-2 text-sm text-slate-700">{message.empty}</p>}

      {selected && (
        <div className="mt-5 rounded-xl border border-teal-200 bg-white p-4">
          <h4 className="text-lg font-semibold text-slate-950">{message.selected}: {selected.names.en} <span lang="ja">{selected.names.ja}</span></h4>
          {selectedIsHidden && <p className="mt-1 text-sm text-slate-600">{message.filteredSelection}</p>}
          {municipalityOptions.length > 0 && <>
            <label className="mt-4 block text-sm font-semibold text-slate-900" htmlFor={municipalityId}>{message.municipalityLabel}</label>
            <select id={municipalityId} className={controlClass} value={selectedMunicipalityId} onChange={(event) => setSelectedMunicipalityId(event.target.value)}>
              <option value="">{message.municipalityPlaceholder}</option>
              {groupMunicipalityOptions(municipalityOptions, ({ code }) => code).map(({ label, options }) => {
                const items = options.map((municipality) => <option key={municipality.id} value={municipality.id}>{municipality.name}</option>);
                return label ? <optgroup key={label} label={label}>{items}</optgroup> : items;
              })}
              {/* Any value that matches no municipality shows the prefecture-wide starting points. */}
              <option value="other">{message.otherMunicipality}</option>
            </select>
            <p className="mt-2 text-xs leading-5 text-slate-600">{message.municipalityScope}</p>
          </>}
          <h5 className="mt-4 font-semibold text-slate-900">{message.generalHeading}</h5>
          <p className="mt-1 text-sm leading-6 text-slate-700">{selectedMunicipality ? message.municipalityNotice(selectedMunicipality.name) : message.generalNotice}</p>
          <ul className="mt-2 grid list-inside list-disc gap-1 text-sm sm:grid-cols-2">
            {prefectureGeneralGuides.map(({ articleId, title }) => (
              <li key={articleId}><Link className={linkClass} href={`/articles/${articleId}?local=${guidanceLocationId}#local-guidance-heading`}>{title}</Link></li>
            ))}
          </ul>
          {selectedMunicipality && (
            <>
              <h5 className="mt-4 font-semibold text-slate-900">{message.localHeading}</h5>
              {municipalityCoverage ? (
                <>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{message.localPilot(selectedMunicipality.name)}</p>
                  {selectedMunicipality.isDesignatedCity && <p className="mt-1 text-sm leading-6 text-slate-700">{message.wardNote(selectedMunicipality.name)}</p>}
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm leading-6">
                    {municipalityCoverage.supplements.map((supplement) => (
                      <li key={supplement.id}>
                        <Link className={linkClass} href={`/articles/${supplement.articleId}?local=${selectedMunicipality.id}#local-guidance-heading`}>{supplement.title}</Link>
                        <span className="text-slate-600"> · {message.reviewStatus} · {message.checked}: {supplement.lastCheckedAt}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : <p className="mt-1 text-sm leading-6 text-slate-700">{message.localUnavailable(selectedMunicipality.name)}</p>}
            </>
          )}
        </div>
      )}

      <div className="mt-5">
        <h4 className="font-semibold text-slate-900">{message.nationalHeading}</h4>
        <ul className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
          {prefectureNationalGuides.map(({ articleId, title }) => <li key={articleId}><Link className={linkClass} href={`/articles/${articleId}`}>{title}</Link></li>)}
        </ul>
      </div>
    </section>
  );
}
