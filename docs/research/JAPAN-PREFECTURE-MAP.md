# Japan prefecture map asset

Prepared September 25, 2026 for the Japan basics article and the reusable prefecture finder.

## Source and reuse

- Boundary source: Japan Ministry of Land, Infrastructure, Transport and Tourism (MLIT), National Land Numerical Information, [administrative-area data](https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v3_1.html), 2019 edition (the source conversion script names `N03-190101_GML.zip`). MLIT describes the 2018-and-later edition as open data under its [site terms](https://nlftp.mlit.go.jp/ksj/other/agreement.html). The public UI attributes the adapted geometry to MLIT.
- Conversion source: [open-data-jp-prefectures-geojson](https://github.com/piuccio/open-data-jp-prefectures-geojson), which dissolves municipal features by prefecture. Its [MIT license](../../src/data/geography/PREFECTURE-MAP-LICENSE.txt) is retained with the derived paths.
- Input downloaded from `https://raw.githubusercontent.com/piuccio/open-data-jp-prefectures-geojson/master/output/prefectures.geojson` on September 25, 2026; SHA-256 `c12ec2656d13fe9c59237e742274fbc072e6b4a540de3cc41d432042aef7bace`. The 71 MB input is not committed.
- Output: `src/data/geography/prefecture-map-paths.ts`, about 160 KB before compression (47 KB gzipped). No map package or runtime network request is required.

## Transformation and limits

`node scripts/generate-prefecture-map.mjs <prefectures.geojson>` validates the input's 47 Japanese names against the canonical administrative registry, projects longitude and latitude to SVG coordinates, removes islands smaller than half a full-map pixel, simplifies paths to about 0.15 full-map pixels, and rounds coordinates to one decimal place. The finer tolerance keeps neighboring boundaries aligned at the closest zoom. The generator produces one path and a focus point from the largest polygon per prefecture, using the registry's two-digit code. The public map enlarges the main islands and places Okinawa in a labeled inset. Some tiny or distant islands cannot appear at this scale; the searchable list provides all 47 choices.

The map is an orientation aid, not a source for exact boundaries, distances, risk, or the office responsible for an address. The article retains the complete searchable prefecture list and eight qualified common-region groups. The map shares the list's ephemeral selected prefecture ID and never writes the saved local-guidance location.

## Accessibility and maintenance

Each prefecture has an English/Japanese accessible name, button semantics, an indicated pressed state, keyboard selection, and visible fill-based focus styling. The entire Okinawa inset is a button because individual islands would be too small to tap. Selection centers and zooms the map on the prefecture's largest polygon. Pointer drag and one-finger touch drag pan; wheel over the map frame and two-finger pinch zoom. When the map has focus, arrow keys pan, Page Up/Down zoom, Home restores the full map, and End refocuses the selection. A collapsed Map controls button reveals overlaid zoom, pan, focus, and reset buttons. White prefecture boundaries use a non-scaling SVG stroke so they remain about one screen pixel wide at every zoom level. The selected area uses a fill highlight without a contrasting outline. The map appears before the native select and search, which remain available for small shapes, islands, keyboard use, and screen readers. Check the map at mobile and desktop widths when the component changes.

## Possible ward layer

The [2026 MLIT N03 administrative-area dataset](https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-2026.html) includes municipality and designated-city ward boundaries and five-digit codes. It is a viable free source for a future ward map, but the full national download is large and the app intentionally removed its 171 designated-city administrative-ward records when city-level guidance became the coverage unit (`docs/GEOGRAPHIC-SCHEMA.md`). A selectable ward layer needs a current, simplified per-prefecture geometry asset, source-backed canonical ward records, and a clear rule for how a ward selection relates to city-level guidance. The [MLIT reuse terms](https://nlftp.mlit.go.jp/ksj/other/agreement_01.html) and boundary caveats must be checked for that derived asset. This prefecture map does not imply that it can identify the correct ward for an address.

Before refreshing geometry, review the current MLIT edition and its specific reuse conditions, regenerate from a pinned downloaded input, compare all 47 registry names, visually inspect mainland and distant islands, and repeat keyboard and selection checks. Boundary changes and the source edition should be recorded here; no map coordinate should be used for procedural advice.
