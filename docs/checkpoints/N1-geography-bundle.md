# N1 Stage-B administrative geography export

Implementer: Codex. Reviewer: Claude after availability reset. Date: 2026-09-30.
Base: `d443e9dcaf7aba4a9912569a52e7b5d8d21d05bd` (activity export, pushed; review pending).
Status: geography export implemented; review/integration pending. N1 final acceptance remains open.

## Contracts and compatibility

- Adds `administrative-geographies.en.json`, `geography-sources.en.json`, and `geography-aliases.en.json`.
  The base catalog descriptor uses locale `en`; canonical records retain their existing Japanese names,
  optional English/kana names, official codes/check digits, types, hierarchy and source IDs unchanged.
  English names are not invented where absent. Export covers the registered repository snapshot, not
  every Japanese municipality. No canonical geography or translation files change.
- Separate geography provenance preserves URLs, retrieval/update dates and snapshot record counts.
  These source records are distinct from the official guidance source catalog. No source fetch or new
  research approval is performed. Aliases preserve existing Tokyo/Aichi/Shinjuku/Nagoya saved IDs.
- Acceptance reuses the administrative registry's check-digit and hierarchy rules, and verifies source
  references/counts, alias target existence and collisions, and the identity/type/parent correspondence
  of every supported guidance location. Generic bundle checks reject duplicate record IDs.
- Three mandatory files change format **7 to 8**. This reader rejects formats 1–7; older readers must reject
  format 8. Prior twenty-three payload checksums are unchanged. Catalog version includes the new files.
  No deployed/native consumer migration, component payload, map geometry or renderer wiring is included.

## Verification

- Focused geography/integrity/catalog-translation/local-guidance suites: **105 tests / four files**.
  Canonical snapshot/provenance/alias parity and ancestor behavior passed. Rehashed corruption cases cover
  source references/counts, parent links, check digits, alias targets/collisions and supported hierarchy/type.
- TypeScript, full lint, architecture (**705 production modules**) and whitespace passed with existing
  dependencies. Full four-worker suite: **808 tests / 167 files**, all passed.
- `npm run content:bundle` produced **26 files**, including **194 geographies / 48 sources / four aliases**
  (observations, not pinned catalog counts), after output-path containment verification. Independent disk
  verification passed. Hashing the first twenty-three descriptors reproduced catalog version
  `f88dbd5f7b7f8acfb35517b8ade96920c4619c3b9eab3f8607e435c098e5b781`.
- No clean install, production build/browser, SQL, translation audit, hosted call, email or schedule ran.
  Main and activation are unchanged. Reviewed integration remains `e4fc1ff`; exact checkpoints and
  consolidated documentation await Claude. Do not integrate the unreviewed branch head.

## Remaining scope

Full article provenance and remaining catalog relationship checks stay pending. Component payloads and
renderer wiring wait for Stage C. N1 remains incomplete.
