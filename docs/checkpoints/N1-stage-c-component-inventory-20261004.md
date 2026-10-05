# N1 Stage-C component payload inventory — 2026-10-04

Audited exact working source `b0a3a864be9ddca465562dacf9d4c16092cae662`. This is a read-only coverage and
contract preparation checkpoint. Renderer extraction `f9681f9` awaits Claude review; reviewed integration
remains handoff `1a4ab65`, source `4372d4a`. No exporter, payload schema, renderer or catalog is changed here.

## Current delivered coverage

The in-memory producer still builds **format 9 / 28 mandatory files**. Component blocks contain only
`{ kind: "component", component: <registered kind> }`; they do not contain content or declare a data lookup.
No component payload, article-component artifact, fee schedule, region-group, map-asset or interface-message
file is registered in `contentBundlePayloadContracts`. Existing geography/local-guidance catalogs provide
many dependencies, but not the complete lookup needed to present these components.

There are eight registered kinds, even though only six appear in current articles. Each used kind occurs
once in English and once in Japanese; all **97 current translated articles** preserve the English component
sequence. The two unused registrations must still have explicit payload/composition coverage at acceptance.

| Registered kind | en / ja occurrences | Canonical data / existing dependencies | Remaining delivery |
| --- | --- | --- | --- |
| `residence-application-fees` | 1 / 1 | `src/data/residence-application-fees.ts`; fee article/source metadata | Validated schedules, period IDs, processing rule and localized labels/templates; component provenance binding |
| `tax-residence-scope` | 1 / 1 | English v2 `taxResidenceScopeComponent`; current article-component artifact | Export canonical component and complete current artifact, preserve parent provenance/links to sources |
| `training-route-comparison` | 1 / 1 | English v2 `trainingRouteComparisonComponent`; current artifact; seven canonical hrefs | Same export plus slug-target validation; translated cells cannot replace hrefs |
| `japan-prefecture-regions` | 0 / 0 | Wrapper composes finder followed by region map | Explicit composition referencing both delivered lookups, in web order |
| `japan-prefecture-finder` | 1 / 1 | Administrative geography, local guidance, general advice and their translations already bundled; server finder projection; N3 messages | Lookup/projection contract, guide links/labels, localized supplement-title fallback, N3 messages and references |
| `japan-prefecture-region-cards` | 0 / 0 | Web export is an alias of `JapanRegionMap` | Explicit alias to the region-map lookup; preserve current behavior despite the historical name |
| `japan-region-map` | 1 / 1 | `japanPrefectureRegions`; canonical prefectures; path asset; N3 `regionMap.` messages | Region memberships/labels, map resource/provenance/attribution and locale messages; native interaction stays separate |
| `japan-practical-basics` | 1 / 1 | English v2 `japanPracticalBasicsComponent`; current artifact; two canonical article targets | Canonical inline paragraphs plus complete current artifact; preserve label/body, target order and provenance |

The four host articles are `renewing-or-changing-your-status-of-residence`,
`tax-residence-and-taxable-income-in-japan`, `choosing-a-training-or-workforce-development-route-in-japan`
and `understanding-japan-geography-government-and-language`. All retain `needs-review`; each referenced
official source resolves in the existing bundle. Component records currently carry no separate source IDs
or review dates. A proposed binding should reference the existing host article/source metadata, not invent
component approval, treat reachability dates as substantive review, or copy an article update date as an
unrecorded component check date. Final provenance mapping needs review.

## Observed dependency inventory

Counts describe this repository snapshot, not schema limits:

- Three English v2 owners and three machine-translated article-component artifacts; 37 text fields.
- Seven fee bands, previous/current acceptance schedules, two processing charges, reduced-fee amount and
  payment-email domain. Amounts/dates are data; period labels, headings, paragraphs and formatting remain
  in `residence-application-fee-section.tsx`. Existing fee copy provenance/handoff was not covered by the
  three-component Japanese decision. Codex has not moved or edited that copy.
- Eight orientation regions partition all 47 prefecture IDs exactly once; they are common groups, not
  administrative parents. Preserve declared group order and current bilingual proper names.
- Finder projection: 47 prefectures, 112 researched municipalities, 47 coverage groups, 112 covered
  municipalities and 784 supplement summaries. Reuse catalog references where possible rather than exporting
  another full guidance copy. Preserve researched-only selection, designated-city behavior, legacy aliases,
  editorial status/check dates and the rule that browsing does not alter a saved location.
- Four national and seven general guide entries in `prefecture-finder-guides.ts`; their abbreviated bilingual
  labels remain outside N3's message catalog. All current `/articles/<articleId>` targets also resolve as
  slugs, but the native contract should retain article IDs and resolve through metadata, not assume every
  future ID equals its slug. Do not substitute article titles for the shorter labels without parity review.
- All 47 path codes resolve to canonical prefectures. The path array serializes to **159,199 UTF-8 bytes**.
  It is projected/simplified SVG-coordinate orientation geometry, not GeoJSON or authoritative boundaries.
  Attribution/input edition/hash/retrieval/transform limits live in `docs/research/JAPAN-PREFECTURE-MAP.md`;
  `PREFECTURE-MAP-LICENSE.txt` preserves the conversion project's license. Those local provenance records
  were read; external source/license pages and the original 71 MB input were not revalidated.
- N3 supplies 46 `finder.` messages (including map keys) and eight `regionMap.` messages per locale via server
  props. Interface catalogs have no bundle file yet. Japanese supplement titles can be resolved from the
  already delivered current local-guidance artifacts, retaining web English fallback.

## Translation validation dependency to coordinate with Claude

The web `selectArticleComponentTranslation` imports `src/lib/translation/source-revision.ts`, which imports
`server-only`. The Node bundle builder cannot directly reuse that selector in its ordinary execution mode,
and the portable verifier cannot import its Node hash dependency. This is a delivery dependency, not a
defect in the current server renderer.

The complete-field rule is private to the selector. The exporter and verifier must share it: exact keys,
nonblank visible text, exactly empty English-empty training suffixes, practical grammar/leading strong label/
body, no protected spans, and identical ordered practical hrefs. A generic current-artifact filter alone
does not enforce those rules. Duplicate identity handling must also agree with the web's first matching
active identity before revision/completeness checks; export must not silently choose a different candidate.

Proposed Claude-owned helper:

```ts
// src/domain/translation/article-component-translation-fields.ts
areArticleComponentTranslationFieldsValid(
  component: ArticleComponentSource,
  fields: Readonly<Record<string, string>>,
): boolean
```

Move the existing private validity logic unchanged into that pure helper and have the web selector delegate
to it. No React, Next, `server-only`, Node hashing or catalog imports belong in the helper. Codex can then
reuse it in payload acceptance/selection; build-time revisions use the existing hash core and portable
verification uses the existing injected digest rule. Claude owns this shared translation refactor and tests;
Codex will review the exact checkpoint before consuming it. No new helper is implemented by this inventory.

## Proposed implementation and review sequence

1. Receive Claude's exact `f9681f9` renderer parity review, integrate the approved checkpoint by hash and run
   the combined gate. Keep existing artifact revisions/metadata and untrimmed rendering semantics.
2. Review/integrate the pure field validator handoff. Define the three component payload contracts and
   article-component artifact-family contract, without changing the translation catalogs. Because existing
   catalog integrity identifies records by `id`, wrap canonical v2 data with `id = component.kind`; do not
   add `id` into its strict domain source object or replace its stable `kind` discriminator.
3. Coordinate fees and finder labels with Claude before moving Japanese. Request the fee renderer ownership
   and provenance decision (or a Claude-owned extraction), plus the eleven guide-label message keys/artifacts.
   Plain numeric fee schema preparation may be independent; no Japanese provenance is assumed.
4. Add reviewed fee, orientation-region, finder and map-resource contracts/lookup bindings. Preserve the two
   currently unused composition/alias kinds. Keep map controls/viewport/event handlers platform-specific;
   export data/resource metadata, not React/DOM/CSS components. Preserve H1 browser import boundaries.
5. Agree the final file set, then introduce the next format explicitly (proposed **10**). Format 9 requires
   exactly its 28 files and cannot accept appended payloads silently; old readers must reject the new format
   and retain their prior catalog. Update builder, strict per-file schemas, exact inventory, references,
   revision maps, complete-overlay checks and deterministic version/manifest tests together.
6. Final component acceptance derives from every `articleComponentBlocks` registration, covering even
   unused kinds and missing/current/stale/invalid/duplicate artifacts. Validate real article positions,
   references, whole-English fallback, provenance and preserved links. Repeated generation must keep files,
   checksums and catalog version identical across timestamps without modifying source/artifact files.

Candidate logical families are canonical component data, full component artifacts, fee schedules, region
memberships, finder bindings/messages and map resources. File names/counts and format 10 are proposals,
not implemented contracts or an assertion that native completeness is reached by exporting the first three.

## Verification and limits

Read-only inspection used `rg`, committed source/module reads and an in-memory
`node --import tsx --input-type=module` probe invoking `buildContentBundle` with a fixed timestamp. The
producer ran existing complete format-9 integrity checks. Additional assertions checked component order
for every current en/ja article, region partition parity with finder prefectures, map-code parity, eleven
guide slug targets and host-article source references. All passed. No generated output was written.

This documentation-only checkpoint adds no implementation tests; no full release/build/browser, live
database, hosted call, external-source refresh or clean install was repeated. Earlier `4372d4a` combined
and `f9681f9` extraction evidence retain their scope. Export wiring, coordinated Japanese work, full inline
consumer alignment and final N1/N2/native acceptance remain open. No main merge or service activation.
