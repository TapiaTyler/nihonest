# N1 Stage-B activity cross-reference export

Implementer: Codex. Reviewer: Claude after availability reset. Date: 2026-09-29.
Base: `2f2eb0ac1554d9a0d03ce1ff7ee3ba51c73d6fcd` (annotated documents, pushed; review pending).
Status: activity catalog and overlays implemented; review/integration pending. Remaining N1 coverage
and Stage-C component payloads keep final acceptance open. Review exact checkpoints, not the branch head.

## Payload and fallback contracts

- Adds `activity-cross-references.en.json` and `activity-translations.ja.json`. Complete canonical activities
  preserve guided/handoff mode, questions/choices, rule layers/conditions, target links and URLs, source
  assertions and approval metadata. Existing Japanese artifacts retain registration order, generator/model,
  input revisions, availability, review state and dates. No canonical or Japanese edits/review promotion.
- Active current Japanese artifacts are selected with the existing canonical `extractActivityText` and
  source-revision helper. Missing/source-stale overlays leave English; current partial overlays use the
  existing portable `applyActivityText` per-path English fallback. No shared translation/localization edit.
- Reader-facing assertion statements can be translated. Assertion source IDs, editorial state, approval
  dates and approved/not-approved decisions remain canonical, as do search terms, conditions and links.
  Tests exercise all registered answer combinations before/after localization and preserve rule selection.
  Export does not enable an eligibility engine or create any new approved decision-support assertion.

## Portable acceptance and compatibility

- Acceptance reuses `validateActivityCrossReferences` against bundled article/status/journey/source IDs.
  Existing schemas validate rule question/choice conditions. The new payload wrapper additionally rejects
  duplicate question/rule IDs and duplicate choice IDs within a question, preventing ambiguous answers.
- Translation acceptance checks target/source revision and known own reader-text paths. Unknown paths,
  including condition/link/approval properties and inherited object keys, fail. Supplied text must be
  nonempty; omitted text remains English. Target URLs are preserved canonical values; this pass validates
  target identities and does not introduce URL rewriting or a native navigation adapter.
- Two mandatory files change format **6 to 7**. This reader rejects formats 1–6; older readers must reject
  version 7. Previous twenty-one payload checksums remain unchanged. Catalog version intentionally includes
  the new files. No deployed or installed native consumer is migrated or activated.

## Verification

- Focused bundle suites: **126 tests / eight files**. Added canonical/artifact registration and existing web
  overlay parity, all registered answer combinations, immutable research/approval/target metadata, partial
  fallback, stale/missing overlays, duplicate answer/rule IDs, invalid conditions and broken references.
- TypeScript, full lint, architecture (**704 production modules**) and whitespace passed using existing
  dependencies. Full four-worker suite: **798 tests / 166 files**, all passed.
- `npm run content:bundle` generated twenty-three files after output-path containment verification, including
  **8 activities / 8 current Japanese artifacts** (observations, not pinned acceptance counts). Independent
  disk verification passed. Hashing the first twenty-one file descriptors reproduced the previous
  checkpoint's catalog version, confirming those payload checksums remain unchanged.
- No clean install, production build/browser, SQL, translation audit, hosted call, email or schedule ran.
  No renderer/configuration edits, main merge or integration. Reviewed integration remains `e4fc1ff`;
  exact implementation checkpoints and consolidated documentation await Claude.

## Remaining scope

Broader native-required geography, full article provenance and remaining catalog relationship checks stay
pending. Component payloads/renderer wiring wait for Stage C. N1 remains incomplete.
