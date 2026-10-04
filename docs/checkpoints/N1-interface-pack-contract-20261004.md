# N1 standalone interface catalog-pack contract — 2026-10-04

Implementer: Codex. Base: `059cbd1` (adopted validated handoff `500c2db`, source `9b5d937`).
New checkpoint awaits Claude review; no exporter, manifest, current format 9, catalogs or shared artifact
schema changes. No production consumer is added.

## Agreed representation

Claude's decision at `0d385c9` permits a separate catalog-pack contract rather than TranslationArtifact:
kind `catalog`, ID `interface-messages`, locale and a mapping of exact public IDs to strings. Japanese
includes only reviewState `machine-translated`, without sourceRevision, generator, dates or a claim of
per-message currency. The English pack has no translation metadata.

`src/domain/content-bundle/interface-message-pack.ts` implements strict English/Japanese schemas, a locale
union and a paired acceptance schema. The runtime module imports only Zod. IDs preserve camelCase and
values remain untrimmed; blank keys/values and empty catalogs fail. Pair validation requires the same key
set, including detection of same-count substitutions, and Japanese placeholders must be a subset of the
corresponding English set. The regex matches the existing web substitution grammar (`{\w+}`), including
case sensitivity and repeated placeholders. Japanese may reorder or omit supplied placeholders.

The pair schema checks the caller-supplied English inventory; it does not independently bind that inventory
to canonical catalogs. Future exporter acceptance must supply the entire canonical catalogs, with manifest
identity/checksums and mandatory-file coverage. Runtime fallback for an unavailable Japanese catalog remains
the consumer's existing responsibility; no new lookup or translation selector is introduced here.

## Verification

- Ten new contract tests plus eight existing interface lookup/group tests: **18 passed / two files**.
  Current canonical catalogs, **775 keys each**, parse without changing any message key, value or order.
- Tests cover identity/locales, metadata rejection, machine-translated-only Japanese, blank/empty packs,
  missing/extra/substituted keys, placeholder reorder/repetition/omission, unsupplied and case-mismatched
  placeholders, and unknown metadata. Literal brace text outside the web placeholder grammar is preserved.
- `npx tsc --noEmit`, targeted ESLint, architecture **720 production modules** and whitespace passed.
  During preparation the test initially compared entire pack property order rather than message order;
  it was corrected to compare pack structure and exact ordered message serialization. Test case arrays
  also needed explicit Record types to satisfy TypeScript. Final checks passed.
- No full release/build/browser/Auth/SQL rerun for this standalone preparation. The earlier full combined
  evidence belongs to source `9b5d937`, excluding this new module. No dependency install or catalog refresh.

Format 10 remains gated on Claude's reviewed fourth fee component/artifact and renderer-parity checkpoint.
Approved direction stays ten new files / 38 total. This schema is preparation only and remains outside
integration until reviewed. No main merge, hosted activation, real email or scheduling.
