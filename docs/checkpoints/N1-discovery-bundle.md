# N1 Stage-B localized article groups and journeys

Implementer: Codex. Reviewer: Claude after availability reset. Date: 2026-09-29.
Base: `14cf823d97c5185cf9d83cf7990959129fc72bc0` (structured-status overlays, pushed; review pending).
Status: localized discovery export implemented; review/integration pending. Other N1 families and
Stage-C component payloads remain pending. Review exact checkpoints rather than the working branch head.

## Export and revision rules

- Adds `article-group-translations.ja.json` and `journey-translations.ja.json`, containing complete existing
  artifacts in registration order, including generator/model, input revisions and review state/dates.
  English groups and journeys already travel in their complete canonical files. No Japanese or canonical edits.
- Uses the existing active-artifact selector plus source-revision inputs matching the translation catalog
  tests: group title/description; journey title/description/introduction and serialized route titles,
  phase titles/descriptions and conditional-step labels. The new portable payload module records these
  inputs without editing Claude's shared translation modules. Missing/stale targets omit overlays for English.
- Journey artifact fields keep their original serialized JSON arrays. New strict schemas validate route,
  phase and condition entries, duplicate IDs and nonempty presentation text. Arrays can be partial/empty;
  `parseBundledJourneyTranslation` adapts them to the existing portable presentation contract, leaving
  untranslated route/phase/condition fields in English through `localizeJourney`.

## Relationships and compatibility

- Bundle acceptance applies `validateDiscoveryModel` to bundled groups/journeys/articles: article/group
  relationships, route/phase/step IDs, route-choice shape and conditional route references must be valid.
- Translation acceptance checks target/source revisions and nested IDs against the canonical journey.
  Condition translations target only steps with an existing condition label. Strict array-entry schemas
  reject relationship properties such as `articleId`; translations cannot override canonical route/article
  links during object spreading. A translated phase description cannot introduce one absent in English.
- Tests compare the parsed current journey output with the existing web selector and exercise all registered
  journey route choices before/after localization. Canonical groups, IDs, route/article links, requiredness
  and route-selection behavior remain unchanged; no renderer or shared localization module was edited.
- Two mandatory files change format **4 to 5**. This reader rejects formats 1–4; older readers must reject
  version 5. Previous seventeen payload checksums remain unchanged. The catalog version intentionally
  incorporates the two new files. No deployed or installed native consumer is migrated or activated.

## Verification

- Focused bundle suites: **90 tests / six files**. Added artifact/canonical registration parity, web adapter
  parity, route-choice relationship preservation, stale/missing/partial fallback, malformed arrays,
  duplicate/unknown nested IDs, relationship injection, missing canonical descriptions and broken references.
- TypeScript, full lint, architecture (**702 production modules**) and whitespace passed using existing
  dependencies. Full four-worker suite: **762 tests / 164 files**, all passed.
- `npm run content:bundle` generated nineteen files after output-path containment verification, including
  **15 article-group** and **20 journey** translation artifacts (observations, not pinned acceptance counts).
  Independent disk verification passed. Hashing the first seventeen file descriptors reproduced the
  previous checkpoint's catalog version, confirming the existing payload checksums remain unchanged.
- No clean install, production build/browser, SQL, translation audit, hosted call, email or schedule ran.
  No canonical/Japanese/renderer/configuration edits; no main merge or integration. Reviewed integration
  remains `e4fc1ff`; exact implementation checkpoints and consolidated documentation await Claude.

## Remaining scope

Annotated documents, activity cross-references, broader native-required geography, full article provenance
and remaining catalog relationship checks stay pending. Component payloads/renderer wiring wait for Stage C.
N1 remains incomplete.
