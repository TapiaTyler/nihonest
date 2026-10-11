"use client";

import { LocalizedSourceName } from "@/components/content/localized-source-name";
import { useEffect, useState, useSyncExternalStore } from "react";
import { usePreHydrationInput } from "@/components/navigation/use-pre-hydration-input";
import type { ArticleLocalGuidance, SelectableLocalGuidanceLocation } from "@/lib/content/local-guidance";
import type { LocalGuidanceJapaneseFields } from "@/lib/content/local-guidance-translations";
import { getGeneralLocalAdvice } from "@/data/local-guidance/general-advice";
import type { InterfaceMessageId } from "@/domain/localization/interface-message-catalogs/english";
import { groupMunicipalityOptions, tokyoAreas } from "@/domain/geography/tokyo-areas";
import { translationSourceFields } from "@/domain/translation/translation-source-fields";
import { useInterfaceMessages } from "@/components/localization/interface-text";
import {
  getLocalGuidanceLocationSnapshot,
  subscribeToLocalGuidanceLocation,
  writeLocalGuidanceLocation,
} from "@/lib/storage/local-guidance-location";

const geographyTypeLabels = {
  "special-ward": "localGuidance.typeSpecialWard",
  "designated-city": "localGuidance.typeDesignatedCity",
  "administrative-ward": "localGuidance.typeAdministrativeWard",
  city: "localGuidance.typeCity",
  town: "localGuidance.typeTown",
  village: "localGuidance.typeVillage",
  prefecture: "localGuidance.typePrefecture",
  metropolis: "localGuidance.typeMetropolis",
} as const satisfies Record<string, InterfaceMessageId>;

/** Municipality option for the rest of a prefecture: the prefecture-wide general guidance. */
const otherOption = "other";

export function LocalGuidancePanel({
  articleId,
  options,
  japaneseFields = {},
  japaneseGeneralAdvice,
  locations,
  linkedLocationId,
}: {
  articleId?: string;
  options: readonly ArticleLocalGuidance[];
  /** Current Japanese text by supplement ID; each missing field falls back to English. */
  japaneseFields?: Readonly<Record<string, LocalGuidanceJapaneseFields>>;
  /** Current Japanese general advice for this article, shown for unresearched locations; English when absent. */
  japaneseGeneralAdvice?: Readonly<{ title: string; steps: readonly string[] }>;
  locations: readonly SelectableLocalGuidanceLocation[];
  linkedLocationId?: string;
}) {
  const { locale, message, format } = useInterfaceMessages();
  const japanese = locale === "ja";
  const placeName = (english: string, japaneseName: string | undefined) => (japanese && japaneseName ? japaneseName : english);
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
  // Prefectures are listed by English name; municipalities by official code, which keeps Tokyo's special wards
  // before its cities, towns, and villages.
  const sortedLocations = [...locations].sort((left, right) => (
    left.parentName.localeCompare(right.parentName, "en")
    || left.geography.code.localeCompare(right.geography.code, "en")
  ));
  const selectedLocation = sortedLocations.find(({ geography }) => geography.id === selectedId);
  const selected = options.find(({ geography }) => geography.id === selectedId);
  // Designated cities run these procedures city-wide, but each ward office can differ in the details.
  const wardNote = selectedLocation?.geography.type === "designated-city"
    ? format("localGuidance.wardNote", { name: placeName(selectedLocation.geography.name, selectedLocation.geography.japaneseName) })
    : undefined;
  const generalAdvice = getGeneralLocalAdvice(articleId ?? options[0]?.supplement.articleId ?? "");
  const generalTranslated = japanese && Boolean(japaneseGeneralAdvice);
  const generalTitle = generalTranslated ? japaneseGeneralAdvice!.title : generalAdvice?.title;
  const generalSteps = generalTranslated ? japaneseGeneralAdvice!.steps : generalAdvice?.steps ?? [];
  const generalLang = japanese && !generalTranslated ? "en" : undefined;
  const [pendingPrefectureId, setPendingPrefectureId] = useState("");
  // "Other" is stored as the prefecture itself; this remembers that it was chosen, not just the prefecture.
  const [otherPrefectureId, setOtherPrefectureId] = useState("");
  // English lists prefectures alphabetically; Japanese uses the conventional official-code order (北海道 to 沖縄).
  const prefectureOptions = sortedLocations.filter(({ geography }) => geography.type === "prefecture" || geography.type === "metropolis")
    .sort((left, right) => (japanese ? left.geography.code.localeCompare(right.geography.code, "en") : 0));
  const selectedPrefectureId = selectedLocation?.prefectureId ?? pendingPrefectureId;
  // Only municipalities with researched guidance are listed; "Other" gives the general guidance for the rest.
  const municipalityOptions = sortedLocations.filter(({ geography, prefectureId, listed }) => (
    listed && prefectureId === selectedPrefectureId && geography.id !== selectedPrefectureId
  ));
  // Prefectures with no researched municipality get a disabled selector and a note instead of a list of one.
  const prefectureWideOnly = Boolean(selectedPrefectureId) && municipalityOptions.length === 0;
  const selectedInPrefecture = selectedLocation?.prefectureId === selectedPrefectureId;
  const municipalityValue = !selectedInPrefecture ? ""
    : municipalityOptions.some(({ geography }) => geography.id === selectedId) ? selectedId
      // A saved municipality that is no longer listed keeps its general guidance, shown as "Other".
      : selectedId !== selectedPrefectureId || otherPrefectureId === selectedPrefectureId ? otherOption
        : "";
  // Japanese text for the selected supplement, field by field; a field without Japanese is shown in English.
  const translated = selected && japanese ? japaneseFields[selected.supplement.id] : undefined;
  const text = (key: string, english: string) => {
    const value = translated?.[key];
    return value ? value : <span lang={japanese ? "en" : undefined}>{english}</span>;
  };
  const partlyEnglish = Boolean(translated && selected) && Object.keys(translationSourceFields["local-guidance-supplement"](selected!.supplement))
    .some((key) => !translated?.[key]);
  const areaLabel = (label: string) => (japanese ? tokyoAreas.find(({ en }) => en === label)?.ja ?? label : label);
  const checkedDate = selected && japanese
    ? new Intl.DateTimeFormat("ja-JP", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${selected.supplement.lastCheckedAt}T00:00:00Z`))
    : selected?.supplement.lastCheckedAt ?? "";

  const choosePrefecture = (value: string) => {
    setPendingPrefectureId(value);
    setOtherPrefectureId("");
    setLinkedSelectionId("");
    writeLocalGuidanceLocation(value);
  };
  const chooseMunicipality = (value: string) => {
    const other = value === otherOption;
    setLinkedSelectionId("");
    setOtherPrefectureId(other ? selectedPrefectureId : "");
    writeLocalGuidanceLocation(other ? selectedPrefectureId : value);
  };
  // A choice made before hydration is applied once the panel can respond; untouched fields keep the saved location.
  const prefectureRef = usePreHydrationInput<HTMLSelectElement>(choosePrefecture);
  const municipalityRef = usePreHydrationInput<HTMLSelectElement>(chooseMunicipality);

  return (
    <section className="mt-12" aria-labelledby="local-guidance-heading">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">{message("localGuidance.eyebrow")}</p>
          <h2 id="local-guidance-heading" className="mt-2 text-2xl font-semibold tracking-tight text-ink">{message("localGuidance.heading")}</h2>
          <p className="mt-2 max-w-xl leading-7 text-ink-muted">{message("localGuidance.intro")}</p>
        </div>
        <div className="grid gap-4 sm:min-w-96 sm:grid-cols-2">
          <label className="text-sm font-semibold text-ink-firm" htmlFor="local-guidance-prefecture">
            {message("localGuidance.prefecture")}
            <select
              id="local-guidance-prefecture"
              className="app-select mt-2 block min-h-11 w-full rounded-xl border border-line-strong bg-surface px-3 text-sm font-normal text-ink-strong focus:border-brand-accent focus:outline-2 focus:outline-offset-2 focus:outline-focus"
              value={selectedPrefectureId}
              ref={prefectureRef}
              onChange={(event) => choosePrefecture(event.target.value)}
            >
              <option value="">{message("localGuidance.notSelected")}</option>
              {prefectureOptions.map(({ geography }) => <option key={geography.id} value={geography.id}>{placeName(geography.name, geography.japaneseName)}</option>)}
            </select>
          </label>
          <div>
            <label className="text-sm font-semibold text-ink-firm" htmlFor="local-guidance-location">
              {message("localGuidance.municipality")}
              <select
                id="local-guidance-location"
                className="app-select mt-2 block min-h-11 w-full rounded-xl border border-line-strong bg-surface px-3 text-sm font-normal text-ink-strong focus:border-brand-accent focus:outline-2 focus:outline-offset-2 focus:outline-focus disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-subtle"
                value={prefectureWideOnly ? "" : municipalityValue}
                disabled={!selectedPrefectureId || prefectureWideOnly}
                aria-describedby={selectedPrefectureId ? "local-guidance-municipality-note" : undefined}
                ref={municipalityRef}
                onChange={(event) => chooseMunicipality(event.target.value)}
              >
                <option value="">{message(prefectureWideOnly ? "localGuidance.prefectureWideOnly" : "localGuidance.selectMunicipality")}</option>
                {groupMunicipalityOptions(municipalityOptions, ({ geography }) => geography.code).map(({ label, options }) => {
                  const items = options.map(({ geography }) => <option key={geography.id} value={geography.id}>{placeName(geography.name, geography.japaneseName)}</option>);
                  return label ? <optgroup key={label} label={areaLabel(label)}>{items}</optgroup> : items;
                })}
                {!prefectureWideOnly && <option value={otherOption}>{message("localGuidance.other")}</option>}
              </select>
            </label>
            {selectedPrefectureId && (
              <p id="local-guidance-municipality-note" className="mt-2 text-xs leading-5 text-ink-muted">
                {message(prefectureWideOnly ? "localGuidance.noteNoMunicipality" : "localGuidance.noteListed")}
              </p>
            )}
          </div>
        </div>
      </div>

      {linkedSelectionId && (
        <p className="mt-5 text-sm leading-6 text-ink-body">{message("localGuidance.linkedNote")}</p>
      )}

      {!selectedId ? (
        <p className="mt-6 rounded-2xl border border-dashed border-line-strong bg-surface p-4 text-sm leading-6 text-ink-muted">{message("localGuidance.selectPrompt")}</p>
      ) : !selected && selectedLocation && generalAdvice ? (
        <div className="mt-6 rounded-2xl border border-caution-line bg-surface p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-caution-text">{message("localGuidance.generalEyebrow")}</p>
          <h3 className="mt-2 text-xl font-semibold text-ink" lang={generalLang}>{generalTitle}</h3>
          <p className="mt-3 leading-7 text-ink-body">{format("localGuidance.generalIntro", { name: placeName(selectedLocation.geography.name, selectedLocation.geography.japaneseName) })}</p>
          {wardNote && <p className="mt-2 leading-7 text-ink-body">{wardNote}</p>}
          {japanese && <p className="mt-2 text-sm leading-6 text-ink-muted">{message(generalTranslated ? "localGuidance.machineTranslated" : "localGuidance.generalEnglishOnly")}</p>}
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-ink-body" lang={generalLang}>{generalSteps.map((step) => <li key={step}>{step}</li>)}</ul>
        </div>
      ) : !selected ? (
        <p className="mt-6 rounded-2xl border border-dashed border-line-strong bg-surface p-4 text-sm leading-6 text-ink-muted">{message("localGuidance.noResearch")}</p>
      ) : (
        <div className="mt-6 rounded-2xl border border-brand-line bg-surface p-5 sm:p-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
                {message(geographyTypeLabels[selected.geography.type])}{selected.parentName ? ` · ${placeName(selected.parentName, selected.parentJapaneseName)}` : ""}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-ink">{text("title", selected.supplement.title)}</h3>
              {wardNote && <p className="mt-1 text-sm leading-6 text-ink-muted">{wardNote}</p>}
            </div>
            <span className="justify-self-end whitespace-nowrap rounded-full bg-caution-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-caution-text">{message("article.statusEditorial")}</span>
          </div>
          {translated && (
            <p className="mt-3 rounded-xl bg-surface-subtle px-3 py-2 text-sm leading-6 text-ink-muted">
              {message("localGuidance.machineTranslated")}{partlyEnglish ? ` ${message("localGuidance.englishFallback")}` : ""}
            </p>
          )}
          <p className="mt-3 leading-7 text-ink-body">{text("summary", selected.supplement.summary)}</p>
          <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
            <div><dt className="font-semibold text-ink">{message("localGuidance.appliesWhen")}</dt><dd className="mt-1 leading-6 text-ink-muted">{text("applicability", selected.supplement.applicability)}</dd></div>
            <div><dt className="font-semibold text-ink">{message("localGuidance.responsibleBody")}</dt><dd className="mt-1 leading-6 text-ink-muted">{text("responsible-body", selected.supplement.responsibleBody)}{selected.supplement.receivingOffice ? <> — {text("receiving-office", selected.supplement.receivingOffice)}</> : null}</dd></div>
          </dl>
          <div className="mt-5 space-y-4">
            {selected.supplement.actions.map((action, index) => (
              <div key={action.title}>
                <h4 className="font-semibold text-ink">{text(`actions.${index}.title`, action.title)}</h4>
                <p className="mt-1 leading-7 text-ink-muted">{text(`actions.${index}.description`, action.description)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-line pt-5">
            <p className="text-sm font-semibold text-ink">{message("localGuidance.sources")}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {selected.sources.map((source) => (
                <li key={source.id}>
                  <a href={source.url} target="_blank" rel="noreferrer" className="font-medium text-brand-link underline decoration-brand-300 underline-offset-4 hover:text-brand-link-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
                    <LocalizedSourceName source={source} order="organization-first" />
                  </a>
                  <span className="ml-2 text-ink-subtle">({message(source.language === "en" ? "localGuidance.sourceEnglish" : "localGuidance.sourceJapanese")})</span>
                </li>
              ))}
            </ul>
            {selected.supplement.sourceFormatNote && <p className="mt-3 text-sm leading-6 text-ink-muted">{text("source-format-note", selected.supplement.sourceFormatNote)}</p>}
            <p className="mt-3 text-xs text-ink-subtle">{format("localGuidance.checked", { date: checkedDate })}</p>
          </div>
        </div>
      )}
    </section>
  );
}
