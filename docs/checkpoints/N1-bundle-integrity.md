# N1 Stage-B bundle integrity preparation

Implementer: Codex. Reviewer: Claude after availability reset. Date: 2026-09-29.
Base: `906103154ee8f0541f653c41422517735a71a099` (pending N4 extraction).
Status: integrity contract for the existing eight files implemented; review/integration pending.
Catalog expansion, translation coverage and component payloads remain pending. This is a bounded
preparation checkpoint, not completion of Stage-B catalog coverage or N1 acceptance.

## Contract and compatibility

- `src/domain/content-bundle/content-bundle-integrity.ts` declares the existing eight format-1 file
  contracts: English articles, current Japanese article translations, glossary, FAQ, sources, residence
  statuses, article groups and journeys. Catalog payload validation reuses the canonical domain schemas,
  including dates, relationships and review metadata already required by those schemas.
- The exporter validates records before serialization and verifies the complete result before returning.
  Schema defaults/transforms do not replace the canonical records. File names, kinds, ordering, JSON
  serialization, SHA-256 inputs and format version 1 remain unchanged.
- `verifyContentBundle(manifestInput, files, sha256)` is portable. Clients supply their platform's SHA-256
  over UTF-8 text and receive a validated manifest only when the whole candidate passes. Unsupported format
  versions or descriptors, missing/extra files, duplicate paths/IDs, malformed JSON, invalid records,
  checksum/count mismatches and catalog-version mismatches throw. It has no storage or activation effects;
  a future client must perform its own atomic installation after validation succeeds.
- The format-1 catalog version retains manifest file ordering and excludes `generatedAt`. The digest
  callback is trusted platform code. Checksums detect integrity failures; they do not authenticate a publisher.
  Supported file contracts are explicit: expansion needs a contract and a compatibility decision.
- No canonical or Japanese catalog, translation selector, renderer, CMS parser, private account state,
  configuration or dependency changed. Existing article translation currency/fallback behavior remains.

## Validation

- Focused content-bundle suites: **21 tests / two files**. Existing tests compare emitted catalog records
  with canonical registrations; added negative controls cover acceptance failures even when tampered
  records have newly matching checksums. Complete serialized output passes without rewriting bytes.
- TypeScript, full lint and architecture (**697 production modules**) passed.
- Full four-worker suite: **693 tests / 160 files**, all passed. Whitespace check passed.
- Existing installed dependencies were used. No clean install, production build, browser, SQL,
  translation audit, hosted operation or native SQLite installation was repeated for this Node/domain change.

## Remaining work and review

2026-09-29 follow-up: Codex's six-checkpoint review found that extra top-level `id` properties could
override canonical article/translation identities during duplicate checking. Identity now follows the
validated file kind (`metadata.id`, `articleId`, or catalog `id`). Four regression cases cover hidden
duplicates and valid records with unrelated duplicate fields. Focused suites: **25 tests / two files**;
TypeScript and targeted lint passed. This follow-up awaits Claude with the original checkpoint.

N1 still needs the expanded canonical/translated catalog inventory, current/missing/stale selection and
provenance/fallback fixtures, cross-catalog reference validation and Stage-C component payloads. Per-record
schemas validate reference shapes here; they do not establish that referenced targets exist. N2 shared
inline parsing and renderer wiring are separate checkpoints. No final N1/N2 acceptance is claimed.

Review this checkpoint against the exact base above. Its ancestors include four pending J1 checkpoints
and N4; do not integrate the working branch head before reviewing those independently. Reviewed integration
remains `e4fc1ff`; main and hosted activation remain unchanged.
