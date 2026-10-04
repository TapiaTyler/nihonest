# Geographic discovery: prefecture finder

Discovery started 2026-09-23 for the Geography A/B/C track in `docs/ROADMAP.md`.
This document records engineering scope and evidence, not editorial approval
of local guidance or Japanese translations.

**Initial scope confirmed by the user: discovery findings and implementation
plan only.** The user subsequently authorized the schema and the next
engineering iteration. References below to proposed work describe the
original discovery plan; use the checkpoint notes for current status.

**Subsequent schema checkpoint (2026-09-23):** the user separately authorized
mapping all prefectures, Tokyo special wards, and designated-city wards by ID.
That registry is now implemented; see `docs/GEOGRAPHIC-SCHEMA.md` for the exact
261-record scope, code-based identity contract, compatibility aliases, and
sorting helpers.

**Finder engineering checkpoint (2026-09-23):** A1 and A2 are implemented. The
existing Japan-basics block now contains a searchable native-select finder,
with 47 bilingual prefectures, stable IDs, separate search/selection clear
actions, an announced result count, national links, and local supplement
coverage derived from the pilot registry. The eight region disclosures remain
below it. Browsing uses component state and does not read or write the saved
municipality. The browser acceptance check passed in Chrome at desktop and
375px mobile widths with real keyboard search and selection, clear actions,
zero-result preservation, link visibility, and unchanged saved municipality
(`e2e/prefecture-finder.spec.ts`, 2 tests). The user explicitly deferred
Japanese translation in this module for now; the Japanese article retains an
explicit English fallback notice. Finder engineering is complete within that
language scope. Translation can be resumed as a separate iteration.

The deferred A3 translation contract was
`src/components/content/prefecture-finder-messages.ts`; since N3 these messages are the `finder.` and `regionMap.`
entries of the interface message catalogs. Claude should author
Japanese values for `heading`, `intro`, `searchLabel`, `searchPlaceholder`,
`selectLabel`, `selectPlaceholder`, `clearSearch`, `clearSelection`,
`resultCount(count)`, `empty`, `selected`, `filteredSelection`,
`nationalHeading`, `localHeading`, `localPilot`, `localUnavailable`,
`reviewStatus`, and `checked`. The `fallbackNotice` should disappear once
Japanese controls and coverage details render. The UI shows these in the
Japan-basics article under “Browse all 47 prefectures”; `resultCount` has a
numeric variable, and `checked` precedes an ISO date. Place names remain
canonical data, and guide/supplement titles currently remain English; handle
those as a separate labeled localization decision rather than implying that
translating controls alone localizes all links. The finder uses ID-based
selection and must never write `nihonest:local-guidance-location:v1`.

**Geography B1 checkpoint (2026-09-23):** all twelve pilot supplements were
compared with their cited official pages at the claim level. Specific source
gaps and draft English corrections are recorded in
`docs/research/GEOGRAPHY-B1-SOURCE-REFRESH.md`. Supplement source-check dates
now record this manual inspection; all twelve remain `needs-review` and no
source-monitoring baseline or editorial approval was changed. Japanese local
guidance remains outside this iteration.

## Baseline at discovery

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

1. Use the administrative registry's code-based IDs (`jp-13000` for Tokyo),
   preserving `tokyo`, `aichi`, `shinjuku`, and `nagoya` as compatibility aliases.
   Official two-digit prefecture codes are separate fields; identity does not
   depend on translated labels or list positions. This supersedes the initial
   discovery suggestion to introduce additional English-slug identities.
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

## Proposed implementation sequence

| Slice | Deliverable | Boundary and completion evidence |
|---|---|---|
| A1 — identity and coverage | Implemented: coded prefecture registry, region membership, normalized search, and pilot coverage projection | Focused tests assert 47 unique IDs, one region each, and real Shinjuku/Nagoya supplement joins |
| A2 — accessible finder | Implemented: search, native selection, selected-prefecture summary, national links, and municipal coverage details in the existing geography block | English MDX and Japanese directive share the block; focused tests cover search, empty/hidden selection, clear actions, and unchanged saved location |
| A3 — Claude interface handoff | Deferred by user: dedicated English message contract exists; Japanese interface copy remains pending | English fallback is explicit in the Japanese article; resume only when requested |
| A4 — focused acceptance | Implemented: regression tests and Chrome desktop/mobile keyboard check | Focused Vitest and two Playwright tests pass; saved municipality remains unchanged |
| B1 — source refresh | Completed draft claim-level check of 12 pilot supplements against official sources; linked more precise pages and corrected source-dependent wording | Manual inspection dated September 23 in the B1 audit; all records stay `needs-review`, with human editorial approval and source-monitoring resolution separate |
| B2 — Claude local guidance | Revision-addressed Japanese supplement artifacts and localized panel/document selector interface | Current/missing/stale resolution works; IDs, source provenance, jurisdiction, and human-review status remain canonical |
| C — one location batch | Research selected municipality, implement bounded supplements, pair with Claude translation | Add to supported coverage only after actual content exists; never generate 47 empty local-guidance pages |

**Geography C1 checkpoint (2026-09-23):** the first Tokyo special-ward batch
covers Chiyoda (`jp-13101`), Chuo (`jp-13102`), and Minato (`jp-13103`) for
address registration only. Their official-source findings and next batch are
recorded in `docs/research/TOKYO-SPECIAL-WARDS-C1.md`. These additions remain
`needs-review`. Japanese localization remains deferred by the user.

**Geography C2 checkpoint (2026-09-23):** Bunkyo (`jp-13105`), Taito
(`jp-13106`), and Sumida (`jp-13107`) now have address-registration supplements
backed by current ward procedures. Counter differences and the Sumida FAQ
conflict are recorded in `docs/research/TOKYO-SPECIAL-WARDS-C2.md`. These
additions remain `needs-review`; Japanese localization remains deferred.

**Geography C3 checkpoint (2026-09-23):** Koto (`jp-13108`), Shinagawa
(`jp-13109`), and Meguro (`jp-13110`) have address-registration supplements
backed by current ward procedures. Their source and counter distinctions are
recorded in `docs/research/TOKYO-SPECIAL-WARDS-C3.md`. These additions remain
`needs-review`; Japanese localization remains deferred.

**Geography C4 checkpoint (2026-09-23):** Ota (`jp-13111`), Setagaya
(`jp-13112`), and Shibuya (`jp-13113`) have address-registration supplements
backed by current ward procedures. Overseas-arrival counter and hour restrictions
are recorded in `docs/research/TOKYO-SPECIAL-WARDS-C4.md`. These additions remain
`needs-review`; Japanese localization remains deferred.

**Geography C5 checkpoint (2026-09-23):** Nakano (`jp-13114`), Suginami
(`jp-13115`), and Toshima (`jp-13116`) have address-registration supplements
backed by current ward procedures. Group bookings and differences in overseas
processing hours are recorded in `docs/research/TOKYO-SPECIAL-WARDS-C5.md`.
These additions remain `needs-review`; Japanese localization remains deferred.

**Geography C6 checkpoint (2026-09-23):** Kita (`jp-13117`), Arakawa
(`jp-13118`), and Itabashi (`jp-13119`) have address-registration supplements
backed by ward procedures. Arakawa's overseas main-counter rule and Itabashi's
standard-hours restriction are recorded in
`docs/research/TOKYO-SPECIAL-WARDS-C6.md`. These additions remain
`needs-review`; Japanese localization remains deferred.

**Geography C7 checkpoint (2026-09-23):** Nerima (`jp-13120`), Adachi
(`jp-13121`), Katsushika (`jp-13122`), and Edogawa (`jp-13123`) complete
address-registration guidance for all 23 Tokyo special wards. Their official
source and scope distinctions are recorded in
`docs/research/TOKYO-SPECIAL-WARDS-C7.md`. These additions remain
`needs-review`; Japanese localization remains deferred. The next geographic
iteration is a coverage and source audit before choosing another bounded local
subject or municipality set.

The optional map is a separate decision after A2/A4, not a prerequisite or a
reason to delay the usable finder. Geography B source research may be prepared
in parallel with A, but B2 must consume a stable canonical revision.

### Proposed file ownership

- New `src/data/geography/prefectures.ts`: explicit, individually coded records
  and region labels. Do not generate stable codes from array order at runtime.
- New `src/domain/geography/prefecture.ts`: platform-independent record types
  and search logic; reuse `src/domain/search/normalize.ts` for Latin case,
  diacritics, and width handling. The domain must not import data or UI.
- New `src/lib/content/prefecture-finder.ts`: derive a compact municipality and
  supplement projection from the existing registries. Avoid importing the MDX
  article catalog into the browser just to label a few links. Validate selected
  national-guide IDs against the canonical catalog in tests.
- New `src/components/content/prefecture-finder.tsx`: client boundary for local
  interaction state. Keep `JapanPrefectureRegionGrid` compatible with its MDX
  and translated-Markdown callers, retaining the existing region disclosure
  content during the first slice.
- New dedicated finder-message module: Codex writes the canonical English keys
  and interpolation/context contract; Claude owns the Japanese portion and
  integrates it. Freeze that contract before handoff to avoid competing edits.
- Existing `src/components/content/japan-geography-reference.tsx`: replace its
  embedded name strings with the shared registry and compose the finder.
  Preserve `JapanPracticalBasics` and its existing translations unchanged.
- Focused tests alongside the new domain/component/helpers, with existing
  geography-block and translated-article tests retained as integration coverage.
- Leave `src/data/local-guidance/geographies.ts`, saved-location storage,
  municipal document identifiers, and the active translation catalogs unchanged
  during A. Do not expand the supported-local registry merely to list prefectures.

### Interaction and handoff details

Use an English-alphabetized native select with bilingual option labels and
search above it. Keep the eight common-region disclosures available as a
reference below the finder. A query filters choices; a selected place remains
identified if a later query excludes it, with separate clear-search and
clear-selection controls. The result-count announcement excludes any preserved
out-of-filter selection. Native options avoid an unnecessary custom combobox.

National links remain visible before and after selection. A local link includes
the municipality's canonical ID in a `local` URL parameter and opens the guide's
Local guidance panel. The article validates that ID against its available local
guidance, then selects the matching prefecture and municipality for that page.
Where the article has jurisdiction-specific document examples, they use the
same linked municipality. This URL selection does not change the reader's saved
local guidance location; using a selector explicitly continues to save it.
Selecting Tokyo must never infer residence in Shinjuku, nor Aichi in Nagoya.

Initial finder selection is empty and held in component state only. No account
schema, geolocation permission, or IP-based inference is needed. The validated
article URL parameter is for opening a specific local guide, not for persisting
the finder browse selection or writing a saved location.

Claude's handoff should enumerate the heading, search label and hint, selector
placeholder, result count, clear actions, empty state, selection heading,
national/local coverage explanations, source-date/review labels, and English
fallback notice. It should include screenshots or rendered context after A2,
canonical IDs and destinations, and any variable placeholders. Existing
prefecture/region labels and translation artifacts are reused unchanged.

### Risks and unresolved decisions

- **Coverage overstatement:** a prefecture can contain one supported municipal
  pilot without having prefectural or comprehensive municipal guidance.
- **Registry drift:** the 47-prefecture reference and researched-local registry
  have different responsibilities. Join using stable IDs and validate the join.
- **Translation scope drift:** bilingual names are not a localized finder or
  localized supplement. Report these three coverage measures separately.
- **Source age:** pilot dates are recorded evidence, not assurance that current
  office instructions are unchanged. Refresh before Geography B publication.
- **Concurrent editing:** agree a finder-message ownership handoff before
  Claude starts that file. Existing translation work proceeds independently.
- **Map:** no asset is selected; rights, boundaries, rendering approach, and
  maintenance remain unapproved. No map package or dataset is needed for A1–A4.
- **Expansion:** the next municipality is not selected. Choose it for demonstrated
  user need and source quality after the paired pilot has been refreshed; this
  discovery does not authorize a speculative nationwide local-content rollout.

## Later work

Geography B: recheck pilot sources, then let Claude localize the local interface
and supplement prose with stable IDs and revision-addressed artifacts.
Geography C: research one bounded location batch at a time and pair each ready
local-content batch with Claude's translations. Do not advertise unsupported
prefectures or municipalities as covered ahead of their researched content.
