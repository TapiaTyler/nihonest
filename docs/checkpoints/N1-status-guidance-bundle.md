# N1 Stage-B structured residence-status guidance export

Implementer: Codex. Reviewer: Claude after availability reset. Date: 2026-09-29.
Base: `9638a9e3923f9b383b52a75b524d889d95f9cea6` (local guidance expansion, pushed; review pending).
Status: structured-guidance overlay export implemented; review/integration pending. Remaining N1 families
and Stage-C component payloads keep final acceptance open. Do not integrate the working branch head.

## Payload and revision contract

- English structured guidance already travels inside the complete canonical `residence-statuses.en.json`
  records. This checkpoint adds only `residence-status-guidance-translations.ja.json`, containing complete
  current Japanese overlay artifacts in their existing registration order, including provenance/review dates.
- These artifacts historically use `contentKind: "residence-status"`, just like summary translations.
  The dedicated file/schema contract distinguishes them. Revision inputs are `extractGuidanceText` reader-facing
  paths, hashed by the existing source-revision helper; summary revisions use different canonical fields.
  Active, current artifacts for statuses with structured guidance are selected; missing/unstructured/stale
  targets are omitted. No shared translation module, Japanese text, registration or prompt changed.
- Partial current overlays remain valid. Consumers use the existing portable `applyGuidanceText` contract
  for per-path English fallback. Tests establish that applying the overlay leaves source assertions, source
  IDs, research state, route kind, search terms and authorization mode canonical. Artifact review state/dates
  are preserved rather than promoted. Canonical assertion approval and effective dates remain unchanged.

## Acceptance and compatibility

- The portable verifier checks guidance target/source revisions and known reader-text paths. It rejects
  unsupported paths, including source-assertion metadata and inherited property names, as well as summary
  fields presented as guidance overlays. Supplied translated text must be nonempty; omitted text falls back.
- `validateResidenceStatusCollection` now validates bundled statuses against bundled source, article and
  glossary IDs. This covers structured periods/pathways/assertion sources and transition target statuses,
  as well as existing slug uniqueness and direct status references.
- The additional mandatory file changes format **3 to 4**. The reader rejects formats 1–3; older readers
  must reject version 4. The prior sixteen payloads retain their checksums. Catalog version changes because
  the new file enters the original ordered file/checksum hash. No installed/deployed consumer is migrated.

## Verification

- Focused bundle suites: **72 tests / five files**. Added registration/provenance parity, current/missing/
  stale/unstructured targets, partial English fallback, canonical metadata preservation, wrong artifact kind/
  locale/availability, summary/guidance confusion, unsupported paths and seven broken-reference cases.
- TypeScript, full lint, architecture (**701 production modules**) and whitespace passed using existing
  dependencies. Full four-worker suite: **744 tests / 163 files**, all passed.
- `npm run content:bundle` generated seventeen files after output-path containment verification, including
  **30** current structured-guidance artifacts (observed registration count, not an acceptance constant).
  Independent disk verification passed. Hashing the first sixteen file descriptors reproduced the previous
  checkpoint's catalog version, confirming those payload checksums remain unchanged.
- No clean install, production build/browser, SQL, translation audit, hosted call, email or schedule ran.
  No canonical content, renderer or configuration edits; no main merge or integration. Reviewed integration
  remains `e4fc1ff`; exact checkpoints and consolidated documentation await Claude.

## Remaining scope

Localized discovery/journeys, annotated documents, activity cross-references, broader native-required
geography, full article provenance and wider catalog relationship checks remain. Component payloads and
renderer wiring wait for Stage C. N1 remains incomplete.
