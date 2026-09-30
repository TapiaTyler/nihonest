# N1 reader rejection-path review

Reviewer for this working-branch self-review: Codex. Reciprocal reviewer: Claude after availability reset.
Date: 2026-09-30. Base: `f14bf04a6b8bc33c15f8a77e073691cc16f9cd60`.
Status: local review completed without a new defect; reciprocal review/integration and N1 acceptance open.

## Reviewed behavior

Reviewed the portable manifest/file contracts, payload registry and complete-candidate verifier together
with article provenance, geography, discovery and translation contracts and their negative fixtures.
No new runtime defect was found in this pass. No code, test, canonical content, translation catalog,
generated file, consumer or dependency changed.

- Manifest validation rejects unsupported versions, invalid dates/digests/counts, duplicate descriptors
  and invalid paths. The verifier requires exactly the registered files and checks each path/kind/locale
  combination. Catalog version retains descriptor ordering and excludes generation time by design.
- File checksums cover raw UTF-8 JSON text, before semantic validation. Counts and duplicate identities
  follow the validated file kind: article metadata ID, compact translation article ID, full artifact
  content ID, or catalog ID. Unrelated extra IDs cannot hide duplicate canonical identities.
- Recomputed hashes do not bypass schema, target, revision, provenance or relationship checks. Full
  article artifacts must correspond to compact translations and declared canonical source revisions.
  Other translation families validate their registered field/target contracts and fallback rules.
- Known article, source, glossary, status, discovery, activity, document and geography relationships
  validate against the candidate's catalogs. Geography source counts/aliases/hierarchy and document
  visual rights attribution have their separate cross-record checks.

Checksums still establish integrity, not publisher authenticity. Whole-MDX article revisions remain
producer declarations: the portable block model cannot reconstruct the original MDX. Platform digest
code is trusted. Native atomic installation, asset caching and navigation remain separate contracts;
this review does not establish those capabilities or a complete offline application.

## Evidence

- All bundle-focused suites: `npx vitest run` with the eleven files selected by
  `rg --files src/lib/content -g 'content-bundle*.test.ts'`, using four workers:
  **177 tests / 11 files passed**. Includes canonical parity and corruption fixtures with recomputed hashes.
- Independent local disk verification loaded the existing manifest and all payloads, checked directory
  inventory, each SHA-256/count and the ordered catalog digest, then ran the portable reader. Passed:
  **format 9 / 28 files**, catalog version
  `160b2acf9368dd4fce2855016fbfc496a8d69883b637c969b4895398585f86d2`.
- Additional read-only Node/tsx probes duplicated a canonical record in **each of the 28 payloads**,
  recomputed file/catalog hashes, and supplied unrelated extra IDs for article/translation kinds.
  Every candidate failed specifically at duplicate canonical identity checking.
- Eight additional malformed-manifest probes all failed: invalid date, uppercase digest, negative and
  fractional counts, wrong kind for a known path, duplicate path, parent traversal path and omitted file.
- Existing dependencies; no clean install or regeneration. Full-suite/types/lint/build/browser,
  editorial/translation audits, SQL and hosted checks were not repeated for this documentation-only review.

## Remaining gates

This is Codex self-review evidence, not Claude approval. Exact N1 checkpoints and consolidated documents
still need reciprocal review and designated integration. Stage-C component extraction/payloads and N2
renderer wiring remain gated; the coverage inventory's personalized-roadmap/native contracts remain open.
Reviewed integration remains `e4fc1ff`. No working-head integration, main merge or activation.
