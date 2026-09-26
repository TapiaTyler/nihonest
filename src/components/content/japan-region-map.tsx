"use client";

import { useState } from "react";
import { prefectureMapPaths } from "@/data/geography/prefecture-map-paths";
import { japanPrefectureRegions } from "@/data/geography/regions";

const regionColors = [
  "#5b8fb9", "#8a70b5", "#d17b89", "#c18c4c",
  "#62a182", "#6583be", "#b67aaf", "#ba855d",
] as const;
const mainMapView = "145 10 510 515";
const okinawaMapView = "125 510 80 81";

type Locale = "en" | "ja";
const labels = {
  map: "Map of Japan's regions",
  select: "Select a region on the map or in the legend to see its prefectures.",
  okinawaScope: "Close view of Okinawa Island and nearby islands. Okinawa Prefecture also extends farther southwest.",
  region: "Region",
  prefectures: "Prefectures",
  viewOkinawa: "View Okinawa",
  fullMap: "Full Japan map",
};

export function JapanRegionMap({ locale = "en" }: Readonly<{ locale?: Locale }>) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showOkinawa, setShowOkinawa] = useState(false);
  const selectedRegion = selectedIndex === null ? null : japanPrefectureRegions[selectedIndex];

  return (
    <div className="not-prose mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <p className="text-sm leading-6 text-slate-700" aria-live="polite">{showOkinawa ? labels.okinawaScope : labels.select}</p>
      <div className="mt-4 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_10rem]">
        <div className="relative mx-auto w-full">
          <svg viewBox={showOkinawa ? okinawaMapView : mainMapView} role="group" aria-label={showOkinawa ? "Map of Okinawa" : labels.map} className="block h-auto w-full">
            {japanPrefectureRegions.map((region, index) => showOkinawa && index !== 7 ? null : (
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
                  <path key={code} d={d} fill={regionColors[index]} fillRule="evenodd" stroke="#ffffff" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
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
            className="absolute bottom-2 left-2 min-h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-teal-900 shadow-sm hover:border-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            {showOkinawa ? labels.fullMap : labels.viewOkinawa}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1" aria-label={labels.map}>
          {japanPrefectureRegions.map((region, index) => (
            <button
              key={region.name.en}
              type="button"
              aria-pressed={selectedIndex === index}
              onClick={() => {
                setSelectedIndex(index);
                if (index !== 7) setShowOkinawa(false);
              }}
              className={`flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${selectedIndex === index ? "border-teal-700 bg-teal-50 text-teal-950" : "border-slate-200 text-slate-800 hover:border-teal-500"}`}
            >
              <span className="size-4 shrink-0 rounded-sm border border-slate-500/30" style={{ backgroundColor: regionColors[index] }} aria-hidden="true" />
              {region.name[locale]}
            </button>
          ))}
        </div>
      </div>
      {selectedRegion && (
        <p className="mt-4 leading-7 text-slate-700" role="status" aria-live="polite">
          {labels.region}: <strong className="text-slate-950">{selectedRegion.name[locale]}</strong>
          <span> · {labels.prefectures}: {selectedRegion.prefectures[locale]}</span>
        </p>
      )}
    </div>
  );
}
