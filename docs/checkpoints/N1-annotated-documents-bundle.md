# N1 Stage-B annotated-document export

Implementer: Codex. Reviewer: Claude after availability reset. Date: 2026-09-29.
Base: `7db7fb308df6b783d2464d4fe97dbd4b5bce0645` (localized discovery, pushed; review pending).
Status: annotated-document catalog and overlays implemented; review/integration pending. Other N1 families
and Stage-C component payloads remain pending. Review exact checkpoints rather than the branch head.

## Payload and fallback contracts

- Adds `annotated-documents.en.json` and `annotated-document-translations.ja.json`. English families remain
  complete canonical records in registration order: direct/jurisdiction versions, dates, lifecycle/review
  status, fictional-example notices, field numbers, official visual URLs/dimensions and source/rights IDs.
  Existing Japanese artifacts retain generator/model, input revisions, availability, review state and dates.
- The existing canonical `translationSourceFields["annotated-document"]` and source-revision helper select
  active current Japanese artifacts. All canonical text paths must be present, matching the viewer's existing
  whole-family fallback rule. Missing, stale or incomplete overlays are omitted for English rather than
  exporting a partial Japanese family. No translation generation, canonical/Japanese edits or review promotion.
- Visuals remain URL/attribution metadata. No image is downloaded, bundled as an offline asset or presented
  as newly rights-reviewed. Offline asset caching and viewer/component wiring are outside this checkpoint.

## Portable acceptance and compatibility

- Acceptance reuses `validateAnnotatedDocumentCollection` against bundled articles, glossary terms,
  source records and selectable geographies. Version groups need exactly one current version; IDs/field
  numbers and family/variant relationships must remain valid. Official visual source/rights IDs must exist
  and be listed in their containing version's source IDs.
- The new payload schema additionally rejects duplicate section/visual IDs within a version and backwards
  validity dates, preventing ambiguous stable text paths. Canonical family schemas remain unchanged.
- Translation acceptance checks target/source revision, complete canonical text coverage and known own
  field keys. Unsupported paths, including lifecycle/review metadata, cannot enter the text overlay.
- Two mandatory files change format **5 to 6**. This reader rejects formats 1–5; older readers must reject
  version 6. Previous nineteen payload checksums remain unchanged. The catalog version intentionally
  includes the two new files. No deployed or installed native consumer is migrated or activated.

## Verification

- Focused bundle suites: **107 tests / seven files**. Added canonical/provenance registration parity,
  existing viewer overlay parity, stale/missing/incomplete fallback, duplicate path identities, validity
  ordering, unknown paths, source/rights/geography/article/glossary references and current-version rules.
- TypeScript, full lint, architecture (**703 production modules**) and whitespace passed using existing
  dependencies. Full four-worker suite: **779 tests / 165 files**, all passed.
- `npm run content:bundle` generated twenty-one files after output-path containment verification, including
  **6 document families / 6 current Japanese artifacts** (observations, not pinned acceptance counts).
  Independent disk verification passed. Hashing the first nineteen file descriptors reproduced the
  previous checkpoint's catalog version, confirming those payload checksums remain unchanged.
- No clean install, production build/browser, SQL, translation audit, asset download, hosted call,
  email or schedule ran. No renderer/shared translation/configuration edits, main merge or integration.
  Reviewed integration remains `e4fc1ff`; exact checkpoints and consolidated documentation await Claude.

## Remaining scope

Activity cross-references, broader native-required geography, full article provenance and remaining catalog
relationship checks stay pending. Component payloads/renderer wiring wait for Stage C. N1 remains incomplete.
