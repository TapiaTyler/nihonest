"use client";

import { useState } from "react";
import { prefectureMapPaths } from "@/data/geography/prefecture-map-paths";
import type { JapanPrefectureRegion } from "@/data/geography/regions";
import type { InterfaceMessageGroup } from "@/domain/localization/interface-message-lookup";

const regionColors = [
  "#5b8fb9", "#8a70b5", "#d17b89", "#c18c4c",
  "#62a182", "#6583be", "#b67aaf", "#ba855d",
] as const;
const mainMapView = "145 10 510 515";
const okinawaMapView = "125 510 80 81";

type Locale = "en" | "ja";

/** Client view of the region map. The server passes the region payload so the geography registry stays out of browser code. */
export function JapanRegionMapView({ regions, messages, locale = "en" }: Readonly<{
  regions: readonly JapanPrefectureRegion[];
  /** The `regionMap.` interface messages in `locale`, chosen on the server. */
  messages: InterfaceMessageGroup<"regionMap.">;
  locale?: Locale;
}>) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showOkinawa, setShowOkinawa] = useState(false);
  const selectedRegion = selectedIndex === null ? null : regions[selectedIndex];

  return (
    <div className="not-prose mt-6 rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <p className="text-sm leading-6 text-ink-body" aria-live="polite">{showOkinawa ? messages["regionMap.okinawaScope"] : messages["regionMap.select"]}</p>
      <div className="mt-4 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_10rem]">
        <div className="relative mx-auto w-full">
          <svg viewBox={showOkinawa ? okinawaMapView : mainMapView} role="group" aria-label={showOkinawa ? messages["regionMap.okinawaMap"] : messages["regionMap.map"]} className="block h-auto w-full">
            {regions.map((region, index) => showOkinawa && index !== 7 ? null : (
              <g
                key={region.name.en}
                role="button"
                tabIndex={0}
                aria-label={region.name[locale]}
                aria-pressed={selectedIndex === index}
                onClick={() => setSelectedIndex(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedIndex(index);
                  }
                }}
                className="cursor-pointer focus:outline-none focus-visible:brightness-75"
                opacity={selectedIndex === null || selectedIndex === index ? 1 : 0.45}
              >
                {prefectureMapPaths.filter(({ code }) => (showOkinawa ? code === "47" : code !== "47") && region.prefectureIds.some((id) => id === `jp-${code}000`)).map(({ code, d }) => (
                  <path key={code} d={d} fillRule="evenodd" style={{ fill: regionColors[index], stroke: "var(--map-stroke)" }} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
                ))}
              </g>
            ))}
          </svg>
          <button
            type="button"
            onClick={() => {
              setShowOkinawa((current) => !current);
              if (!showOkinawa) setSelectedIndex(7);
            }}
            className="absolute bottom-2 left-2 min-h-11 rounded-lg border border-line-strong bg-surface px-3 text-sm font-medium text-brand-deep-soft shadow-sm hover:border-brand-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            {showOkinawa ? messages["regionMap.fullMap"] : messages["regionMap.viewOkinawa"]}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1" aria-label={messages["regionMap.map"]}>
          {regions.map((region, index) => (
            <button
              key={region.name.en}
              type="button"
              aria-pressed={selectedIndex === index}
              onClick={() => {
                setSelectedIndex(index);
                if (index !== 7) setShowOkinawa(false);
              }}
              className={`flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${selectedIndex === index ? "border-brand-accent bg-brand-soft text-brand-deep" : "border-line text-ink-firm hover:border-brand-500"}`}
            >
              <span className="size-4 shrink-0 rounded-sm border border-line-edge/30" style={{ backgroundColor: regionColors[index] }} aria-hidden="true" />
              {region.name[locale]}
            </button>
          ))}
        </div>
      </div>
      {selectedRegion && (
        <p className="mt-4 leading-7 text-ink-body" role="status" aria-live="polite">
          {messages["regionMap.region"]}<strong className="text-ink">{selectedRegion.name[locale]}</strong>
          <span>{messages["regionMap.prefectures"]}{selectedRegion.prefectures[locale]}</span>
        </p>
      )}
    </div>
  );
}
