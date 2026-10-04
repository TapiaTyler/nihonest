# N1 format 10 component export — 2026-10-04

Codex-owned implementation on `codex/hosting-native-refactor`, based on `d1fef2f` (the adopted, validated
`0da60ef` tree). Claude confirmed exact adoption as `9ca257b` and approved the preceding documentation.
Review pending; do not integrate this checkpoint until Claude approves its exact commit.

## Compatibility and file inventory

Format 10 retains all 28 prior payloads and requires these ten additions together, for **38 mandatory files**:

| File | Content |
| --- | --- |
| article-components.en.json | Four strict English v2 sources wrapped by their component kind |
| article-component-translations.ja.json | Full active/current, complete Japanese artifacts; missing overlays mean whole-component English fallback |
| component-bindings.en.json | All eight registered directives: data, finder, region map, ordered composition and alias |
| component-provenance.en.json | Direct occurrences, host context, existing source IDs and resource references, kept distinct |
| residence-application-fees.en.json | Canonical numeric schedule validated with residenceApplicationFeeDataSchema |
| orientation-regions.en.json | Ordered eight groups and the three canonical bilingual Tokyo area labels |
| prefecture-map-resources.en.json | All 47 paths/focus tuples, recorded source/transform/limits and retained checksummed LF MIT license |
| finder-bindings.en.json | Existing catalog references, ordered national/general guide roles, message IDs and explicit behavior |
| interface-messages.en.json | Full reviewed English interface pack, retaining public IDs and values |
| interface-messages.ja.json | Full reviewed Japanese interface pack, machine-translated; no fabricated generation/currency metadata |

The dropped component-copy files are not exported. Version 9 candidates are rejected by the new verifier;
old version 9 readers reject version 10. This changes the producer/portable verification contract, not a
native catalog switch implementation. Consumers must keep their previous catalog after a rejected candidate.

## Selection, references and provenance

- Selection takes the first active Japanese article-component identity **before** testing revision and
  complete fields. Invalid/stale first candidates do not expose a later candidate the web would reject.
  Source hashing and the Claude-owned `areArticleComponentTranslationFieldsValid` rules are reused.
  Artifact fields and full generation/review metadata survive serialization unchanged; no catalog edits.
- Training/practical links resolve against article **slugs**. Fee copy uses the fourth component artifact;
  numeric fees are separately schema-validated before formatting. Empty Japanese artifact arrays are valid.
- Binding coverage equals the actual eight-directive registry. Strict composition order and alias target
  prevent cycles or unsupported substitution. Both language article blocks resolve through these bindings.
- Direct host occurrence lists are derived from canonical English blocks. Unused geography composition and
  alias have empty direct lists and explicit geography host context. Context source lists refer to existing
  article metadata; they do not claim that every source supports every component cell or grant human review.
- Map metadata records the existing 2019 MLIT/conversion input evidence and generator projection, island-area
  threshold, simplification and rounding. License text is normalized to LF, with its recorded SHA-256 required
  and recomputed. Source/input/license/legal terms were not externally revalidated; the 71 MB input is not
  needed. Geometry grammar/coverage/names are validated, not independently geospatially reconstructed.
- Interface packs use the previously reviewed exact-key and placeholder-subset contract. Finder guide links
  resolve to articles (general roles also resolve to advice). Resource references are mandatory.
- `projectBundledFinder` reconstructs the static payload from the verified catalogs: alias resolution,
  researched municipalities, names, ordering, designated-city flags, coverage, supplement titles and dates.
  Descriptor rules document ephemeral selection, Tokyo grouping and translation fallbacks. UI interactions
  and SVG rendering remain platform work; this does not implement a native finder UI.

Checksums establish integrity, not publisher authenticity. Semantically valid publisher content changes can
produce a different accepted catalog; canonical-output equality is established by producer/round-trip tests.

## Checkpoint evidence

Exact code/checkpoint commit: **`934db81f545f7cc0464ab8dbb695f8d6d6dd42fc`**.

Before commit: `npx vitest run content-bundle --maxWorkers=4` passed **240 tests / 15 files**;
`npx tsc --noEmit`, targeted ESLint, `npm run architecture:check` (**724 production modules**) and
`git diff --check` passed. The exact committed checkpoint then passed the full local release gate in the owned LF validation worktree:

`npm run release:check -- --target local`: **13/13 passed in one invocation**, **1,187 tests / 192 files**,
**724 production modules**, editorial/coverage/localization/article/glossary audits, production **416 static
entries**, post-build TypeScript, CMS exclusion and all **43 browser JS files**. Article initial JS remains
826.2 KB raw / 209.5 KB gzip (-9); no guidance/source registry in any browser file or map geometry in entries.
The clean detached validation checkout had zero CRLF files and locally copied existing dependencies.
Supabase/AWS/SES/email/public settings were removed, email delivery disabled, public origin
https://nihonest.invalid. No clean install or browser/Auth/SQL/hosted rerun. The tree ended clean.

`npm run content:bundle` generated the manifest and all 38 payloads; a separate disk-read verification passed.
A second generation with a different timestamp matched all disk bytes, checksums and catalog version.
Catalog version: `b045f69edfd1e4c2b0b5f5f8d81cf78c8aa3f2870544f2d73a3510bf59cfdc61`;
combined payload size **7,657,916 UTF-8 bytes** (manifest excluded). Four components, four full artifacts,
eight bindings, eight provenance records, one each of fees/regions/map/finder/en interface/ja interface.

This is exact branch-local release evidence. Integration is held pending Claude review; the combined
integration gate must still run after reviewed adoption. Later status commits change documentation only.

New acceptance checks cover the mandatory inventory/version, every canonical new owner, first-active
selection/fallback, untrimmed metadata, deterministic bytes/checksums/catalog version across timestamps,
and checksummed-invalid overlays, links, registration, provenance, guides, messages, geometry, license and fees.

Actual integrated web renderers read parsed exported data/artifacts through test-only module replacements.
All **four components × en/ja = eight static markup captures** are byte-identical before/after export.
An absent Japanese array renders the entire component in English with matching text/links; a one-character
Japanese caption mutation changes output, confirming that the replaced dependencies are exercised.
Numeric fee inputs are parsed before rendering, and online totals use the reviewed domain calculation.
This verifies export round-trip compatibility with the web renderers, not a separate native renderer.

The portable finder result equals `getPrefectureFinderData`: 47 prefectures, 112 researched municipalities,
784 supplements, including existing editorial/check dates. Unresearched `jp-01101` is not offered.

No new browser/hosted/Auth/SQL/provider acceptance, clean install, Japanese wording approval, main merge,
hosted activation, real email or scheduler. Final N1/N2/native acceptance and prior operational gates stay open.

## Review handoff

Claude should review the exact checkpoint against `d1fef2f`, particularly compatibility, full inventory,
first-active selection, provenance distinctions, map/license evidence, finder reconstruction, interface-pack
fallback contract and the four-component render round-trip. Integration remains held at `0da60ef` until review.
