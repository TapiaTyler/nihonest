"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { searchPrefectures, type FinderPrefecture } from "@/domain/geography/prefecture";
import { fillInterfaceMessage, type InterfaceMessageGroup } from "@/domain/localization/interface-message-lookup";
import { groupMunicipalityOptions, tokyoAreas } from "@/domain/geography/tokyo-areas";
import { prefectureGeneralGuides, prefectureNationalGuides, type FinderCoverage, type FinderMunicipality } from "@/lib/content/prefecture-finder-guides";
import { usePreHydrationInput } from "@/components/navigation/use-pre-hydration-input";
import { PrefectureMap } from "./prefecture-map";

const controlClass = "mt-2 block min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-brand-accent focus:outline-2 focus:outline-offset-2 focus:outline-focus";
const linkClass = "font-medium text-brand-link underline decoration-brand-300 underline-offset-4 hover:text-brand-link-hover focus:outline-2 focus:outline-offset-2 focus:outline-focus";

export function PrefectureFinder({
  locale,
  messages,
  prefectures,
  municipalities,
  coverage,
  japaneseSupplementTitles = {},
}: Readonly<{
  locale: "en" | "ja";
  /** The `finder.` interface messages in `locale`, chosen on the server so the page renders without a catalog load. */
  messages: InterfaceMessageGroup<"finder.">;
  prefectures: readonly FinderPrefecture[];
  municipalities: readonly FinderMunicipality[];
  coverage: readonly FinderCoverage[];
  /** Current Japanese supplement titles by supplement ID; supplements without one keep their English title. */
  japaneseSupplementTitles?: Readonly<Record<string, string>>;
}>) {
  const japanese = locale === "ja";
  const prefectureLabel = (names: FinderPrefecture["names"]) => (japanese ? names.ja : `${names.en} · ${names.ja}`);
  const municipalityName = (municipality: FinderMunicipality) => (japanese ? municipality.japaneseName : municipality.name);
  const areaLabel = (label: string) => (japanese ? tokyoAreas.find(({ en }) => en === label)?.ja ?? label : label);
  const formatDate = (date: string) => new Intl.DateTimeFormat(japanese ? "ja-JP" : "en", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
  const searchId = useId();
  const selectId = useId();
  const municipalityId = useId();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [selectedMunicipalityId, setSelectedMunicipalityId] = useState("");
  const choosePrefecture = (id: string) => {
    setSelectedId(id);
    setSelectedMunicipalityId("");
  };
  // Input made before this lazily loaded component hydrated is applied once it can respond.
  const searchRef = usePreHydrationInput<HTMLInputElement>(setQuery);
  const prefectureRef = usePreHydrationInput<HTMLSelectElement>(choosePrefecture);
  // Japanese readers expect the official order by prefecture code (北海道 to 沖縄県), not English alphabetical order.
  const matches = locale === "ja"
    ? [...searchPrefectures(prefectures, query)].sort((left, right) => left.code.localeCompare(right.code))
    : searchPrefectures(prefectures, query);
  const selected = prefectures.find(({ id }) => id === selectedId);
  const selectedIsHidden = Boolean(selected && !matches.some(({ id }) => id === selectedId));
  const localCoverage = coverage.find(({ prefectureId }) => prefectureId === selectedId);
  const municipalityOptions = municipalities.filter(({ prefectureId }) => prefectureId === selectedId);
  const selectedMunicipality = municipalityOptions.find(({ id }) => id === selectedMunicipalityId);
  const guidanceLocationId = selectedMunicipality?.id ?? selectedId;
  // Researched supplements are shown only for the selected municipality or ward, never prefecture-wide.
  const municipalityCoverage = localCoverage?.municipalities.find(({ id }) => id === selectedMunicipality?.id);

  return (
    <section className="not-prose mt-8 border-t border-slate-200 pt-8" aria-labelledby={`${searchId}-heading`} lang={locale}>
      <h3 id={`${searchId}-heading`} className="text-xl font-semibold text-slate-950">{messages["finder.heading"]}</h3>

      <div className="mt-4">
        <PrefectureMap
          locale={locale}
          messages={messages}
          prefectures={prefectures}
          selectedId={selectedId}
          onSelect={choosePrefecture}
        />
        <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-700">{messages["finder.intro"]}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-slate-900" htmlFor={searchId}>{messages["finder.searchLabel"]}</label>
            <input ref={searchRef} id={searchId} type="search" value={query} placeholder={messages["finder.searchPlaceholder"]} onChange={(event) => setQuery(event.target.value)} className={controlClass} />
            {query && <button type="button" className="mt-2 min-h-11 text-sm font-medium text-brand-deep-soft underline focus:outline-2 focus:outline-offset-2 focus:outline-focus" onClick={() => setQuery("")}>{messages["finder.clearSearch"]}</button>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900" htmlFor={selectId}>{messages["finder.selectLabel"]}</label>
            <select ref={prefectureRef} id={selectId} className={`app-select ${controlClass}`} value={selectedId} onChange={(event) => choosePrefecture(event.target.value)}>
              <option value="">{messages["finder.selectPlaceholder"]}</option>
              {selectedIsHidden && selected && <option value={selected.id}>{prefectureLabel(selected.names)}</option>}
              {matches.map((prefecture) => <option key={prefecture.id} value={prefecture.id}>{prefectureLabel(prefecture.names)}</option>)}
            </select>
            {selected && <button type="button" className="mt-2 min-h-11 text-sm font-medium text-brand-deep-soft underline focus:outline-2 focus:outline-offset-2 focus:outline-focus" onClick={() => { setSelectedId(""); setSelectedMunicipalityId(""); }}>{messages["finder.clearSelection"]}</button>}
          </div>
          {matches.length === 0 && <p className="text-sm text-slate-700 sm:col-span-2" role="status" aria-live="polite">{messages["finder.empty"]}</p>}
        </div>
      </div>

      {selected && (
        <div className="mt-5 rounded-xl border border-brand-line bg-white p-4">
          <h4 className="text-lg font-semibold text-slate-950">{messages["finder.selected"]}{japanese ? "：" : ": "}{japanese ? selected.names.ja : <>{selected.names.en} <span lang="ja">{selected.names.ja}</span></>}</h4>
          {selectedIsHidden && <p className="mt-1 text-sm text-slate-600">{messages["finder.filteredSelection"]}</p>}
          {municipalityOptions.length > 0 && <>
            <label className="mt-4 block text-sm font-semibold text-slate-900" htmlFor={municipalityId}>{messages["finder.municipalityLabel"]}</label>
            <select id={municipalityId} className={`app-select ${controlClass}`} value={selectedMunicipalityId} onChange={(event) => setSelectedMunicipalityId(event.target.value)}>
              <option value="">{messages["finder.municipalityPlaceholder"]}</option>
              {groupMunicipalityOptions(municipalityOptions, ({ code }) => code).map(({ label, options }) => {
                const items = options.map((municipality) => <option key={municipality.id} value={municipality.id}>{municipalityName(municipality)}</option>);
                return label ? <optgroup key={label} label={areaLabel(label)}>{items}</optgroup> : items;
              })}
              {/* Any value that matches no municipality shows the prefecture-wide starting points. */}
              <option value="other">{messages["finder.otherMunicipality"]}</option>
            </select>
            <p className="mt-2 text-xs leading-5 text-slate-600">{messages["finder.municipalityScope"]}</p>
          </>}
          <h5 className="mt-4 font-semibold text-slate-900">{messages["finder.generalHeading"]}</h5>
          <p className="mt-1 text-sm leading-6 text-slate-700">{selectedMunicipality ? fillInterfaceMessage(messages["finder.municipalityNotice"], { name: municipalityName(selectedMunicipality) }) : messages["finder.generalNotice"]}</p>
          <ul className="mt-2 grid list-inside list-disc gap-1 text-sm sm:grid-cols-2">
            {prefectureGeneralGuides.map(({ articleId, messageId }) => (
              <li key={articleId}><Link className={linkClass} href={`/articles/${articleId}?local=${guidanceLocationId}#local-guidance-heading`}>{messages[messageId]}</Link></li>
            ))}
          </ul>
          {selectedMunicipality && (
            <>
              <h5 className="mt-4 font-semibold text-slate-900">{messages["finder.localHeading"]}</h5>
              {municipalityCoverage ? (
                <>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{fillInterfaceMessage(messages["finder.localPilot"], { name: municipalityName(selectedMunicipality) })}</p>
                  {selectedMunicipality.isDesignatedCity && <p className="mt-1 text-sm leading-6 text-slate-700">{fillInterfaceMessage(messages["finder.wardNote"], { city: municipalityName(selectedMunicipality) })}</p>}
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm leading-6">
                    {municipalityCoverage.supplements.map((supplement) => {
                      const japaneseTitle = japanese ? japaneseSupplementTitles[supplement.id] : undefined;
                      return (
                      <li key={supplement.id}>
                        <Link className={linkClass} href={`/articles/${supplement.articleId}?local=${selectedMunicipality.id}#local-guidance-heading`} lang={japanese && !japaneseTitle ? "en" : undefined}>{japaneseTitle ?? supplement.title}</Link>
                        <span className="text-slate-600"> · {messages["finder.reviewStatus"]} · {messages["finder.checked"]}{japanese ? "：" : ": "}{formatDate(supplement.lastCheckedAt)}</span>
                      </li>
                      );
                    })}
                  </ul>
                </>
              ) : <p className="mt-1 text-sm leading-6 text-slate-700">{fillInterfaceMessage(messages["finder.localUnavailable"], { name: municipalityName(selectedMunicipality) })}</p>}
            </>
          )}
        </div>
      )}

      <div className="mt-5">
        <h4 className="font-semibold text-slate-900">{messages["finder.nationalHeading"]}</h4>
        <ul className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
          {prefectureNationalGuides.map(({ articleId, messageId }) => <li key={articleId}><Link className={linkClass} href={`/articles/${articleId}`}>{messages[messageId]}</Link></li>)}
        </ul>
      </div>
    </section>
  );
}
