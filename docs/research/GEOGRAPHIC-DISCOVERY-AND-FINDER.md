# Geographic discovery: prefecture finder

Discovery started 2026-09-23 for the Geography A/B/C track in `docs/ROADMAP.md`.
This document records engineering scope and evidence, not editorial approval
of local guidance or Japanese translations.

## Existing implementation

- `src/components/content/japan-geography-reference.tsx` supplies eight
  collapsible groups containing 47 English/Japanese prefecture names. Names
  are comma-separated strings, without stable individual prefecture identities.
- The English Japan-basics article embeds `JapanPrefectureRegionGrid`; the
  translated-Markdown renderer uses the same block through
  `:::japan-prefecture-regions`. Keep both entry points working.
- The supported-local-guidance registry contains Tokyo, Aichi, Shinjuku, and
  Nagoya. Only the two municipalities are selectable as saved local context.
  Twelve supplements form six subject pairs: address registration, national
  health insurance, household waste, resident tax, disaster preparation, and
  language/consultation. Their current shared state is `needs-review` with a
  source-check date of 2026-09-13. Discovery is not a fresh verification of
  those twelve sources.
- Local panels and municipal document selectors share the saved municipality
  through `nihonest:local-guidance-location:v1`. Browsing a prefecture must not
  write or clear that setting, affect eligibility, or change journey state.

## Geography A scope

1. Introduce a data registry of 47 individually identified prefectures. Keep
   existing `tokyo` and `aichi` IDs compatible with municipal parent IDs; use
   stable lowercase English IDs for the other prefectures. Store official
   two-digit prefecture codes separately rather than deriving identity from
   translated labels or list positions.
2. Move the existing bilingual names and common-region groupings into this
   registry without regenerating translations. Region membership is orientation
   metadata, not a governmental hierarchy. Preserve the caveat about different
   groupings, particularly Mie and Niigata.
3. Add case/width/diacritic-normalized English/Japanese search, a clear control,
   result count, empty state, and a native keyboard-accessible selection/list
   interaction. Show both names. Stable IDs survive display-language changes.
   Do not promise kana search until verified readings/aliases are supplied.
4. Keep browsing selection ephemeral and independent of saved location. Clearing
   search must not silently reset selection, nor should a hidden selected result
   leave users unable to identify or clear their selection.
5. Show useful national guide links for every prefecture. For Tokyo and Aichi,
   identify only the municipalities with existing supplements. Clearly state
   that a municipal pilot does not provide prefecture-wide coverage. For other
   prefectures, say no researched local supplements are available in Nihonest
   yet; do not imply public services do not exist there.
6. Derive coverage from actual supplement/geography relationships. Do not treat
   membership in the 47-prefecture reference as supported local coverage.
   Preserve source dates and editorial state in any displayed local evidence.
7. Ship the usable text/list interaction first. A map is optional and should
   share the same IDs and selection state rather than becoming a second registry.

## Sources and map decision

The [J-LIS code directory](https://www.j-lis.go.jp/spd/code-address/jititai-code.html)
is the official starting point for prefecture/municipality codes. Its
[code explanation](https://www.j-lis.go.jp/spd/code-address/cms_1750514.html)
describes the standardized local-government identifiers and maintenance.
The [prefecture table](https://www.j-lis.go.jp/spd/code-address/kenbetsu-inspection/cms_11914151.html)
lists codes 01–47 and Japanese names. That table is dated 2018-10-01:
use it for identity cross-checking, not for current municipality counts.
Sources accessed 2026-09-23.

GSI provides [blank-map views](https://maps.gsi.go.jp/help/intro/school/blankmap.html).
Its [reuse procedure navigator](https://service.gsi.go.jp/onestop/navi/nav1/)
distinguishes products and the applicable use routes. This discovery has not
selected or cleared a particular downloadable vector asset. Before embedding
a map, record the exact asset, version, terms, attribution, modifications,
maintenance process, and payload size. Verify keyboard parity, target sizes,
focus indication, contrast, screen-reader labels, and a usable no-map path.
Do not infer that every GSI map asset has identical reuse conditions.

Decision for the first engineering slice: no external map asset or map library.
The finder must be useful without one; asset selection remains a separate task.

## Parallel ownership and Japanese handoff

Codex owns the geographic data model, finder interactions, coverage projection,
English interface copy, and engineering tests. Claude owns new Japanese copy,
translation review, and integration under
`content/translations/CLAUDE-TRANSLATION-REPORT.md`; there is no Codex linguistic
review step. Do not touch Claude's glossary/status/article translation batches,
their scripts, or the shared localization coverage snapshot during this slice.

Reuse existing bilingual place/region names as canonical data. Put new finder
interface messages in a dedicated module with an explicit English fallback
until Claude integrates Japanese messages. Deliver the exact message keys and
screen context to Claude; do not silently present English as complete Japanese
coverage. Translation artifacts remain machine-translated until human review.
Geography B's local-supplement interface/prose remains a separate translation
track and must retain revision addressing and canonical-English fallback.

## Acceptance checks

- Exactly 47 unique stable IDs and official code values; every record has both
  existing names and exactly one orientation group.
- Tokyo and Aichi IDs join the existing municipal hierarchy without changing
  that hierarchy or broadening the saved-location selector.
- English, Japanese, mixed-width, and accented Latin queries match consistently;
  empty/unknown queries have a clear usable state.
- Search/select/clear is keyboard accessible, selection is identifiable, and
  result updates are announced without moving focus unexpectedly.
- Tokyo shows Shinjuku coverage, Aichi shows Nagoya, and an unsupported
  prefecture shows national guidance with an explicit local-coverage gap.
- Coverage records reference real supplements and guide destinations. Browsing
  and clearing the finder leave saved municipality and journey state untouched.
- Both MDX and translated-Markdown entry points remain usable. Existing
  Japanese artifacts are preserved; pending interface translation is explicit.
- Test the narrow data and component behavior, then check affected types/lint
  and architecture boundaries. Check mobile and keyboard behavior in-browser.

## Later work

Geography B: recheck pilot sources, then let Claude localize the local interface
and supplement prose with stable IDs and revision-addressed artifacts.
Geography C: research one bounded location batch at a time and pair each ready
local-content batch with Claude's translations. Do not advertise unsupported
prefectures or municipalities as covered ahead of their researched content.
