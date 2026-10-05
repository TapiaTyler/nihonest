# N1 Stage-B municipality guidance and general-advice export

Implementer: Codex. Reviewer: Claude after availability reset. Date: 2026-09-29.
Base: `5d3263b9c5692ca1fae820f4607daf5e7bfc6404` (first catalog expansion, pushed; review pending).
Status: local guidance families implemented; review/integration pending. Other N1 catalog families,
Stage-C component payloads and final acceptance remain pending. Do not integrate the working branch head.

## Payloads and fallback

- Adds `local-guidance.en.json`, `supported-geographies.en.json`, `general-local-advice.en.json`,
  `local-guidance-translations.ja.json` and `general-local-advice-translations.ja.json`.
  Supplements/geographies preserve canonical registration order and complete records, including sources,
  municipality/article relationships, last-check dates and `needs-review` status. General-advice records
  use their article ID as `id` and carry `kind: "general-lookup-prompts"`: these are lookup prompts,
  not researched municipality instructions. No new research or editorial approval is introduced.
- Existing translation artifacts are exported complete, including generator/model, input revisions,
  availability, review state and dates. The existing active-artifact selector and canonical source-field
  revision functions select current Japanese overlays. No Japanese text, shared translation module,
  registration, prompt, canonical guidance or generated research document changes.
- Supplement overlays retain per-field English fallback: a current partial overlay is permitted, while
  an absent or source-stale artifact leaves English. General advice matches the web's complete-entry rule:
  the translated title and every step must be present; otherwise the whole overlay is omitted for English
  fallback. Tests compare emitted overlays with the existing read-only web selectors and exercise fixtures
  for missing targets, changed revisions, stale availability, missing title/steps and partial supplements.

## Consumer validation and compatibility

- Portable acceptance reuses `validateLocalGuidanceCollection` against bundled article/source IDs and the
  supported geography registry, checking parent hierarchy, selectable municipalities and duplicate
  article/geography pairs. General advice must target a bundled article. Translation target/source
  revisions are checked against the bundled English payloads, even when tampered files have matching checksums.
- Overlay keys must be own properties of the canonical translatable fields; unknown keys, including
  inherited object-property names, fail. Supplied fields must be nonempty. Partial supplement fields remain
  valid; general-advice title/step completeness is required at acceptance as well as export selection.
- Five additional mandatory files change format **2 to 3**. This reader rejects formats 1 and 2; older
  readers must reject version 3. The previous eleven payloads retain their bytes/checksums. The catalog
  version intentionally changes because its ordered file/checksum input includes the five new files.
  No deployed/native consumer is migrated or activated, and the verifier does not install a catalog.

## Verification

- Focused bundle suites: **53 tests / four files**. Negative controls cover missing source/article/geography
  references, invalid geography parents, unknown general-advice articles, unknown overlay keys, source-stale
  targets and differing partial/complete fallback behavior. Existing identity/checksum/schema cases remain.
- TypeScript, full lint, architecture (**700 production modules**) and whitespace passed with existing
  dependencies. Full four-worker suite: **725 tests / 162 files**, all passed.
- `npm run content:bundle` generated sixteen files after checking the output path stays in the workspace.
  Observed registrations: **784 supplements**, **159 supported geographies**, **7 general-advice entries**,
  **784 Japanese supplement artifacts** and **7 Japanese general-advice artifacts**. Counts are observations;
  acceptance compares canonical registrations. Separate disk acceptance passed, and hashing the previous
  eleven file descriptors reproduced the prior checkpoint's catalog version, proving their checksums unchanged.
- No clean install, production build, browser, SQL, translation audit, research fetch, hosted operation,
  email or schedule ran. No main merge or integration. Reviewed integration remains `e4fc1ff`.

## Remaining scope

Structured status guidance, localized discovery/journeys, annotated documents, activity cross-references,
broader native-required geography, full article provenance and wider catalog relationship checks remain.
The supported geography registry here serves local guidance; it does not claim complete administrative/map
coverage. Component payloads and renderer wiring wait for Stage C. These partial N1 checkpoints await Claude.
