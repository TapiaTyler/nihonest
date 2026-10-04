# N2 component renderer extraction — 2026-10-04

Exact parent: `ded19b40adae0e84cc988d9df3dd13505e3669be` (`ded19b4`). Claude-approved English v2 data `a74926b` and artifact interface
`5b58f06` are integrated; reviewed N3 `997f0ab` is included so the geography wrapper retains its new
server-selected message props. This checkpoint awaits Claude's exact parent-versus-extraction en/ja
static markup review. It is not part of the reviewed integration branch yet.

## Changes and invariants

- Tax and training renderers read caption, headers and cells from canonical English data, selecting Japanese
  only through `selectArticleComponentTranslation` on the server. Missing/stale/incomplete selection gives
  the entire English component and English `lang`, preserving accessible table structure and styling.
- Every training href comes directly from the English row data in unchanged display order. Japanese fields
  change cell text only. Empty suffixes, leading punctuation and whitespace are passed through unchanged.
- Practical basics reads canonical paragraph IDs/inline strings and the same whole-component selector.
  Its bounded inline renderer retains strong/emphasis/code/link/text structure and the existing Next Link
  class. Protected spans throw explicitly; no raw HTML is accepted. English fallback in a Japanese context
  is marked `lang="en"`; current en/ja output gains no attributes. Stable paragraph keys are not emitted.
- Removed the hardcoded bilingual literals from all three renderers. No translation catalog, artifact,
  prompt, shared translation module, canonical wording, revision or human-review status was changed.
- Replaced temporary JSX literal-inspection contract fixtures with canonical-data validation and comparison
  against Claude's unchanged English fixture/source-field maps. Schema/slug validation cases remain.

## Verification

Before editing renderers at exact parent `ded19b4`, a new renderer test captured six complete static
markup snapshots (three components × en/ja). Snapshots were not regenerated after extraction. All six
match byte for byte. Additional tests check all seven training hrefs in both locales, complete English
fallback for both tables, English practical paragraph/link markup on fallback and its language tag.
These are Codex's checks; Claude's independent parity review is still required.

Focused contracts/artifact/render suites: **48 tests / four files**, all passed. Targeted ESLint,
TypeScript and whitespace passed. Full public-only `npm run release:check -- --target local` with
Supabase/email/AWS/public settings cleared, delivery false and origin `https://nihonest.invalid`:
**13/13 passed**, **1,037 tests / 182 files**, architecture **716 modules**, production **416 entries**,
all lint/types/audits, CMS exclusion and all **43 browser JS files** passed. Article initial JS remains
822.8 KB raw / 208.0 KB gzip (-9), unchanged from reviewed N3 integration. Localization audit remains
article-only. Existing installed dependencies were reused.

No interactive browser, real Auth/SQL, clean-install/CI or hosted checks were repeated. Broader article
inline consumer alignment, N1 component payload/artifact export and final N1/N2/native acceptance remain
open. Next after review: integrate this checkpoint by exact hash, run combined gates, then proceed to the
N1 component payload/family work under the reviewed display/data contract. No main merge or activation.
