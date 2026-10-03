# N1 Stage-B article provenance

Implementer: Codex. Reviewer: Claude after availability reset. Date: 2026-09-30.
Base: `b276cf485ad11be2f11c568071effc10fae668ea` (geography export, pushed; review pending).
Status: article provenance implemented; exact checkpoint and consolidated documentation await review.

## Contracts and fallback

- Adds `article-provenance.en.json`, with one canonical article ID and whole-MDX source revision per article,
  and `article-translation-artifacts.ja.json`, with complete active current Japanese artifacts in registration
  order. Artifact generator/model, terminology/prompt/source revisions, availability, dates, review state,
  title/description and original translated body are preserved. Canonical/translation sources are unchanged.
- Uses the existing active-artifact selector and normalized whole-source revision rule. Missing, inactive,
  other-locale or source-stale artifacts are excluded, leaving English fallback. Both artifact and compact
  portable translation exports use the same selection. Currency does not imply human review.
- Portable acceptance requires exactly one provenance record per canonical article and correspondence
  between artifacts and compact translations. Targets, source revisions, review states, titles, descriptions
  and parsed body blocks must agree. The artifact contract permits only nonempty title/description/body
  fields and preserves the existing review-timestamp requirements. Generic bundle checks reject duplicates.
- Source revisions are producer declarations, checked against the actual normalized MDX during generation
  and tests. The portable reader cannot reconstruct original MDX from blocks or independently prove those
  whole-source hashes. Checksums establish bundle integrity, not publisher authenticity; coordinated changes
  by an untrusted producer require a separate authenticity contract. No raw MDX execution is added to clients.
- Format **8 to 9** adds two mandatory files (28 total). This reader rejects formats 1–8; older readers must
  reject format 9. Prior twenty-six payload checksums are unchanged. Existing compact translations and English
  article representation remain byte-identical. No native/deployed consumer migration is performed.

## Verification

- Focused article/provenance/integrity/local-guidance/catalog-translation suites: **115 tests / five files**.
  Tests cover canonical and web artifact parity, whole-source/CRLF revision normalization, absent/stale/inactive
  and other-locale fallback, unchanged artifact evidence, valid/invalid review timestamps, and rehashed
  target/revision/text/body/review/coverage/protected-field corruption.
- TypeScript, full lint, architecture (**706 production modules**) and whitespace passed with existing
  dependencies. Full four-worker suite: **824 tests / 168 files**, all passed.
- `npm run content:bundle` produced 28 files after output-path containment verification, including **97 source
  revision records / 97 complete current artifacts** (observations, not pinned catalog counts). Independent
  disk verification passed. Hashing the first twenty-six descriptors reproduced previous catalog version
  `4f83c36fb5636c419fc5b79360593b9ea9ae544cdb712a8747e82f3ab29a535a`.
- No clean install, production build/browser, SQL, translation audit, hosted call, email or schedule ran.
  Main/activation unchanged; reviewed integration remains `e4fc1ff`. Do not integrate the unreviewed head.

## Remaining scope

Remaining catalog relationship checks are pending. Parser/component coverage, unsupported constructs,
component payloads and renderer wiring retain the N2/Stage-C gates. N1 final acceptance remains open.
