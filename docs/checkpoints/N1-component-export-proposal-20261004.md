# N1 component export file set and provenance proposal — 2026-10-04

Audited source `fe54e32` (region/map preparation `dc97629`). Codex read-only preparation; Claude review
pending. All names, shapes and format changes below are proposals. No payload contract, exporter, catalog,
translation artifact, renderer or compatibility behavior is changed by this checkpoint.

## Concrete candidate file set

Retain the current 28 files and consider the following 12 additions in an explicitly reviewed format 10
(40 mandatory files if this exact proposal is accepted). Do not increment the format or append a partial
set before the unresolved representation/ownership decisions are settled. Each payload remains a JSON array
with strict per-record validation and declared kind/locale. Empty current-artifact arrays are allowed when
English fallback is required; missing mandatory files are not.

| Proposed file | Proposed identity / content | Required acceptance |
| --- | --- | --- |
| `article-components.en.json` | Catalog records `{ id: component.kind, component }` for the three English v2 owners | Exact canonical payloads; do not insert IDs into strict v2 sources; validate source fields, inline grammar and target links |
| `article-component-translations.ja.json` | Full existing active/current `article-component` artifacts, `contentId = kind` | Shared Claude-owned field validator; original generator/revisions/dates/review state; first matching active identity matches web selection |
| `component-bindings.en.json` | One catalog record per registered directive, `id = directive kind`; discriminated data/composition/alias bindings | Exact registration coverage, resolvable typed references, ordered composition, no cycles or silent unknown fallback |
| `component-provenance.en.json` | One catalog record per directive ID, with explicit host/article and payload/source bindings | Exact binding coverage, resolved references, no invented component review or source date; distinguish unused composition/alias evidence |
| `residence-application-fees.en.json` | One catalog wrapper with an agreed stable ID and the unchanged numeric fee record | Reviewed `c72bcd2` schema/arithmetic; dates are acceptance intervals, not review dates; all localized fee prose remains separately required |
| `component-copy.en.json` | Canonical fee-copy and role-specific finder-guide-label packs with agreed IDs/field mapping | Claude-approved ownership/source shape; four national + seven general labels stay distinct, targets are article IDs |
| `component-copy-translations.ja.json` | Full current artifacts for the preceding copy packs | Content kind/field mapping and provenance require Claude's decision; do not assert artifacts already exist or invent generation metadata |
| `orientation-regions.en.json` | One stable catalog wrapper for the ordered eight existing bilingual groups | Reviewed `dc97629` partition/name contract against all canonical prefectures; no invented IDs for individual groups |
| `prefecture-map-resources.en.json` | One agreed map-resource ID with all 47 ordered paths/focus tuples, source/transform/limits record and retained license text | Reviewed geometry contract; exact registry code/name coverage, checksummed license bytes and resource metadata; no uncommitted input asset dependency |
| `finder-bindings.en.json` | One stable finder descriptor referencing geography, aliases, guidance/advice, ordered guide roles and interface groups | Reproduce researched-only municipality/coverage projection and designated-city behavior; use existing catalogs, preserve editorial/check dates and supplement-title fallback |
| `interface-messages.en.json` | Catalog pack with a stable ID and exact canonical message IDs/values | Proposed full 764-key catalog; preserve IDs, placeholders, service strings and untrimmed text; no React/client lookup implementation in payload |
| `interface-messages.ja.json` | Catalog pack with the same logical ID and exact existing Japanese values plus reviewed provenance/currency binding | Representation/provenance require Claude approval; English fallback and placeholder-subset semantics agree with web; do not label plain strings human-reviewed |

Canonical `en` files may contain existing bilingual proper names, as the administrative geography payload
already does. The locale identifies canonical data ownership; it does not declare every nested string English.
The proposed Japanese interface file uses `kind: catalog` with an explicit `id`, not `catalog-translations`
with guessed `contentId`. Its final metadata contract remains a review gate. Copy/artifact naming may change
after Claude decides whether to extend an existing family; this table does not authorize translation edits.

## Registration and composition bindings

The registry, not current article occurrence counts, must drive acceptance:

| Directive | Required binding |
| --- | --- |
| `residence-application-fees` | Numeric schedule plus complete localized copy/formatting rules and provenance |
| `tax-residence-scope` | Canonical v2 table plus whole-component current-artifact overlay |
| `training-route-comparison` | Canonical v2 table plus complete overlay; hrefs stay canonical, suffix spacing stays byte-exact |
| `japan-practical-basics` | Canonical inline paragraphs plus complete overlay; label/body and ordered hrefs preserved |
| `japan-prefecture-finder` | Finder descriptor, existing referenced catalogs, role-specific labels, interface messages and map resource |
| `japan-region-map` | Ordered region groups, prefecture references, map resource and `regionMap.` messages |
| `japan-prefecture-regions` | Ordered composition: finder, then region map, matching the wrapper |
| `japan-prefecture-region-cards` | Alias of region map, matching the current export despite the historical name |

The final two directives currently have no article occurrence. Their bindings remain mandatory. Every en/ja
article component block must resolve through the same registry, and every composition/alias must terminate
at a supported binding. Interaction, styling, SVG elements, viewports and event handlers remain platform code.

## Provenance distinctions and unresolved decisions

1. The four actual host articles are all `needs-review`, with no `lastReviewedAt`. The fee/training/tax hosts
   have `updatedAt: 2026-09-19`; geography has `2026-09-14`. Those values are article updates, not component
   human checks. Bind host IDs and existing source IDs, then resolve their existing metadata instead of
   manufacturing component-level approval. A reused host's full source list is context, not a claim that each
   listed source supports each component cell. More precise per-component source subsets need owner review.
2. Do not give unused geography composition/alias registrations an invented article occurrence. They may
   reference the reviewed geography owner/context and their constituent provenance through explicit bindings.
   That is distinct from a declaration that they were rendered in that article.
3. The three article-component artifacts already have full generation/input/review metadata; preserve it
   unchanged. Their machine-translated state is separate from the host article's editorial status and from
   Claude's code/wording approval. Complete-field validation must use Claude's forthcoming pure helper;
   generic revision filtering is insufficient. First-active-identity selection precedes revision/completeness
   checks; stale/incomplete first candidates must not cause export to choose a later candidate the web rejects.
4. The interface catalogs contain plain strings. A read-only schema probe found **550 of 764 English keys**
   incompatible with the artifact field-ID rule (`navigation.closeMobile` is one example). This is a proposed
   export constraint, not a defect in current web lookup. Preserve public message IDs; either agree a separate
   pack schema/provenance model or have Claude define a reversible artifact-field mapping. Do not lowercase
   IDs, loosen shared translation rules, fabricate prompt/model/dates or wrap raw maps as full artifacts.
5. The fee copy and eleven abbreviated finder labels still require the retained Claude ownership/provenance
   decision. Replacing abbreviated labels with article titles would change behavior. Message-template rules
   must preserve locale word order and explicit number/yen formatting rather than exporting rendered JSX.
6. Map-resource provenance is distinct from article source/review metadata. Preserve the 2019 MLIT edition,
   documented upstream conversion project/input URL, retrieved date `2026-09-25`, input SHA-256
   `c12ec2656d13fe9c59237e742274fbc072e6b4a540de3cc41d432042aef7bace`, transformation limits and orientation
   caveat from `docs/research/JAPAN-PREFECTURE-MAP.md`. Include the conversion project's actual retained MIT
   license text/copyright, not merely a label or URL. The uncommitted 71 MB input is not an offline dependency.
   Local provenance is recorded evidence; external terms/input were not revalidated in this pass.

## Compatibility and acceptance work after review

- Format 9's verifier accepts exactly 28 supported files and a literal version 9. The read-only probe
  confirms it rejects a version-10 manifest. Implement the approved format, exact new inventory and producer/
  verifier schemas together. Old readers reject the new manifest; future consumers must retain their prior
  catalog on rejection and switch only after full verification. No native reader/activation behavior is
  implemented or newly tested here.
- Catalog identity is per file kind: `id`, `contentId`, `articleId` or `metadata.id`. Explicitly wrap data packs
  rather than relying on absent IDs. Artifact arrays preserve full metadata and remain unique by accepted
  identity. Region/member/path/guide order is semantic and must not be alphabetized for convenience.
- Verify checksums, record counts, exact file inventory, canonical source revisions, all cross-file links and
  full registration/overlay coverage before accepting a candidate. A checksummed invalid or incomplete
  payload still fails. Checksums establish integrity, not publisher authenticity.
- Add mutation acceptance for missing/extra files, wrong kind/locale, duplicate identity, stale/inactive/
  malformed/extra-field overlays, dangling targets, broken alias/composition, mismatched source bindings,
  omitted map/license information, and altered geometry. Assert whole-English fallback where appropriate,
  byte-exact en/ja render parity and H1 browser boundaries after combined integration.
- Build twice with different generated timestamps; files/checksums/catalog version must remain identical.
  Hash only recorded content and existing source revision rules; do not inject wall-clock provenance.

## Read-only evidence and limits

Commands: `rg`/targeted source reads, and PowerShell here-string probes piped to
`node --import tsx --input-type=module`. Probes invoked `buildContentBundle` twice with fixed distinct
timestamps, using its existing full format-9 integrity verification; inspected canonical host/component
bindings and catalog keys; tested a version-10 manifest against the existing verifier; and applied the
existing artifact field schema to the raw English interface map. No generated files were written.

Results: format 9 / 28 files remains deterministic. All eight registered kinds inspected; four hosts/six
used kinds retain their actual metadata. Interface catalogs each have 764 keys, no missing/extra Japanese
keys and no Japanese placeholder absent from its English template; 46 finder + eight region-map keys.
The retained license normalized to LF is 1,079 UTF-8 bytes, SHA-256
`95c2dc0528be198c89df162afd9680dfb8e7d82c8ca12deee6a5e2580dfb2db4` (a text extraction identity, not the
upstream input hash or a new legal approval). The formatter/retained-byte policy must be explicit at adoption.

This checkpoint changes documentation only. No new tests, full release/build/browser, SQL/hosted calls,
external-source/license verification or translation edits were performed. Renderer `f9681f9`, fee `c72bcd2`,
region/map `dc97629` and the coordinated translation/provenance decisions remain review gates. Consolidated
handoff stays held at the user's request; integration remains `1a4ab65` / `4372d4a`. No main merge or activation.
