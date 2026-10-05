# N2 Stage-B tax and training table contracts

Implementer: Codex. Reviewer: Claude after availability reset. Date: 2026-09-30.
Base: `802c61889ee91ec7ab1487b4fb713341d7f72e5e` (inline hardening, pushed; review pending).
Status: two portable component data contracts implemented; review/integration pending. Content extraction,
renderer wiring and N1 component payloads remain Stage C. No production consumer or exported data file added.

## Contracts

- New `src/domain/article/article-component-tables.ts` defines schema-version-1 content contracts for
  `tax-residence-scope` and `training-route-comparison`, with strict per-kind objects, bilingual captions,
  two bilingual column headers, stable row IDs/order and nonempty bilingual cell text. Duplicate row IDs
  and unknown properties fail. Validation never trims or rewrites wording, punctuation or leading spaces.
- Tax rows retain the existing two-cell classification/scope tuples. Training rows retain the existing
  activity/route/suffix tuples plus a shared article href. The suffix is required but may be empty;
  dropping it would lose transition and covered-field wording. No empty placeholder is invented for tax rows.
- `validateArticleComponentTable(input, articleSlugs)` checks training hrefs against caller-supplied canonical
  article slugs. It deliberately does not assume article IDs equal slugs. Only exact `/articles/<slug>`
  destinations fit this row contract; other navigation types require an explicit future contract change.
- The module imports only Zod, not React, Next, filesystem, browser, translation catalogs, CMS or database
  APIs. Accessible table/caption/row-header/column-header semantics remain renderer responsibilities.
- Complete bilingual data is required by these contracts, matching the current inline component owners.
  This does not generate Japanese copy, assign artifact provenance, approve translations or replace the
  existing canonical-content/translation workflow. Extraction and Japanese parity checks remain later gates.

## Read-only fixture and verification

- Test-only TypeScript syntax-tree inspection reads literal rows and caption/header branches directly from
  the two existing component files. It accepts only literal strings/arrays/objects, executes no JSX or
  component module, and writes no content file. If owners move/change the literals, the fixture must be
  updated to the new canonical owner. This is a bounded checkpoint fixture, not a production extraction tool.
- Actual three tax rows and seven training rows validate unchanged, including bilingual captions/headers,
  suffixes, targets and registration order. Counts are observations, not pinned acceptance requirements.
- Negative cases cover missing locales/headers/suffixes, empty text, invalid/duplicate row IDs, extra fields,
  invalid hrefs and unknown target slugs. A distinct ID/slug fixture proves hrefs resolve by slug.
- Focused component/inline/corpus suites: **56 tests / three files**. TypeScript, full lint, architecture
  (**708 production modules**) and whitespace passed with existing dependencies. Full four-worker suite:
  **905 tests / 172 files**, all passed.
- No generation, production build/browser, clean install, SQL, translation audit, hosted call, email or
  schedule ran. Format remains 9 / 28 files; no bundle contract/payload or renderer changed. Existing CMS
  tests run in the full suite; CMS serialization is unchanged. Reviewed integration remains `e4fc1ff`.

## Remaining scope

Practical-basics rich text still needs its Stage-B contract. Fee/geography/finder/map payloads, canonical
copy extraction, renderer consumption, export alignment and Japanese final checks retain the Stage-C
handoff. N1/N2 final acceptance remains open. Exact checkpoints and consolidated docs await Claude; do not
integrate the unreviewed branch head. Main/activation unchanged.
