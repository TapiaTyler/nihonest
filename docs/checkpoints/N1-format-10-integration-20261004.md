# N1 format 10 reviewed integration — 2026-10-04

Codex integration owner. Tested exact combined source:
**`883cdffea10261ca026b2980c8887f91523a3860`** on `codex/hosting-native-integration`.
The subsequent documentation-only handoff records this validation and awaits Claude's documentation review.

## Review receipt and exact inputs

Claude approved implementation **`934db81f545f7cc0464ab8dbb695f8d6d6dd42fc`** against `d1fef2f`.
Independent checks in a fresh detached checkout with copied dependencies included the full Vitest suite:
**1,187 tests / 192 files**. Claude checked all four exported artifacts against their originals, retained
metadata/untrimmed fields, both interface catalogs, machine-translated Japanese state, canonical fee data/copy,
Japanese fee-template reproduction and all eleven guide message bindings. The code review approved
first-active selection, source revision/shared field validation, schema-bound numeric fees, exact registry,
unused-directive context distinctions, map/license validation and version 9 rejection. Claude did not rerun
release/build/browser-bundle checks; the earlier branch-local 13/13 was attributed to Codex.

Claude approved evidence/status **`e9354e0c77ba2c28bef7f379d40f438bafbfacaa`** for its stated scope, requesting
that interface-pack wording distinguish code review of the contract from human review of Japanese values.

From exact prior integration `0da60ef`, conflict-free:

- Cherry-pick implementation `934db81` as **`c9bcf50`**.
- Cherry-pick approved evidence/status `e9354e0` as **`cdff1a2`**.
- Apply the requested documentation wording fix as **`883cdff`**. English/Japanese pack contracts are
  code-reviewed; Japanese values remain machine-translated. No translation values or schemas changed.

The tested tree differs from reviewed worker head `e9354e0` only in that checkpoint table wording.
No unrelated source or another contributor's uncommitted work was included.

## Combined validation

Owned detached LF validation checkout `stage-c-validation-9b5d937` was clean before switching to exact
`883cdff`. Zero CRLF files, existing locally copied dependencies, no clean install. Supabase/AWS/SES/email/
public settings were removed; email delivery false and public origin https://nihonest.invalid.

`npm run release:check -- --target local`: **13/13 passed in one invocation**:

- **1,187 tests / 192 files**, lint, post-build TypeScript, architecture **724 production modules**.
- Editorial/coverage/localization/article/glossary checks and production **416 static entries**.
- CMS exclusion; all **43 browser JS files** checked. No guidance/source registry in any browser file or
  map geometry in route entries. Article initial JS unchanged: **826.2 KB raw / 209.5 KB gzip (-9)**.

Two separately timestamped builds on exact combined source passed verification and produced identical
38-file payload bytes and catalog version:
`b045f69edfd1e4c2b0b5f5f8d81cf78c8aa3f2870544f2d73a3510bf59cfdc61`.
The prior exact implementation's disk export had also been independently verified; that disk export was
not regenerated in this combined pass. The full suite reran the eight component en/ja markup round-trips,
fallback/mutation control and finder projection acceptance. Validation checkout ended clean; whitespace passed.

No new browser interaction, hosted/CI/Auth/SQL/provider acceptance, external license/source revalidation,
human Japanese wording approval, real email or scheduler. Checksums are integrity, not publisher authenticity.

## Handoff and remaining gates

Format 10 implementation is code-reviewed and combined validation passed. The final documentation-only
integration handoff must be adopted by both working branches before dependent work. Codex will share the
exact pushed integration hash; Claude should merge that hash rather than a moving branch head.

Native rendering/UI, download/atomic catalog activation, broader MDX/block grammar acceptance and prior
hosted/operator gates remain open. N5 metadata-boundary preparation is read-only: preserve the canonical
registration order and avoid a second hand-maintained inventory. No main merge or service activation.
