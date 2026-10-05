# N1 finder projection and fallback binding audit — 2026-10-04

Audited source `6ae03cc`. Codex read-only preparation; review pending. This refines the proposed
`finder-bindings.en.json` dependency in the component export proposal; no finder, catalog, translation,
payload schema, renderer or exporter is changed.

## Projection reproducible from existing bundle files

An in-memory probe reconstructed the entire `getPrefectureFinderData()` result from the existing format-9
administrative geography, geography alias, supported geography and local-guidance payloads. It used the
existing pure registry, sorting and English-name helpers. Deep equality passed for every record/field/order,
not only counts: **47 prefectures, 112 municipalities, 47 coverage groups, 112 covered municipalities and
784 supplement summaries**. All four national and seven general guide article IDs resolve in bundled articles.
No second full municipality/guidance catalog is needed just to supply finder data.

| Projection | Current derivation to preserve |
| --- | --- |
| Prefectures | Only canonical prefecture/metropolis records; `{ id, code, names: { en, ja } }`; English locale collator with numeric/base sensitivity and code tiebreaker |
| Research set | Resolve every supplement's geography ID through canonical IDs/legacy aliases; existence of research determines offered municipality, not a human-approval state |
| Municipalities | Canonical non-prefecture records in the research set, preserving registry code order; canonical ID/code/parent, derived English name, official Japanese name, prefecture ID and designated-city flag |
| Coverage | Iterate selectable supported geographies; resolve canonical record and its prefecture parent; summaries match the original supported geography ID, retaining supported display name and supplement ID/title/article ID/check date/status |
| Coverage order | Groups follow first encounter in supported geography registration; municipalities inside each group sort by canonical ID; supplement order follows canonical supplement registration |

All current coverage groups happen to be in prefecture-code order, and all current covered municipality names
match the municipality-option names. Those are observations, not permission to replace the derivation with
alphabetical sorting or merge the two display-name roles. There are **20 designated cities**. Every current
listed municipality has seven supplements, but the contract must allow later partial research; neither seven
nor today's municipality count establishes a permanent coverage minimum.

## Locale, selection and link contract

- Search uses the existing pure `searchPrefectures`: normalized English/Japanese prefecture names and code;
  NFKC/NFD, Latin combining-mark removal, English case folding, punctuation-to-space and all-term matching.
  Do not silently add municipality/kana/legacy-alias search or substitute another sorting rule.
- English preserves the supplied prefecture order; Japanese sorts matched prefectures by official code.
  A selected prefecture hidden by the current query remains selected, remains available in the select and
  displays the filtered-selection notice. Query changes do not implicitly choose a new location.
- Selecting/changing a prefecture clears the selected municipality; clearing selection clears both.
  Municipality choices are researched-only and scoped to the selected prefecture. An unmatched value such
  as `other` selects the prefecture-level starting points. No aggregate prefecture-wide supplement list is shown.
- General guide links include `local=<selected canonical municipality ID or prefecture ID>` and
  `#local-guidance-heading`. Supplement links use the selected canonical municipality ID, the supplement's
  article target and the same anchor. National links have no local query/anchor. Native links should resolve
  article IDs through bundled metadata rather than assume that IDs always equal slugs.
- An offered municipality with coverage shows only that municipality's summaries; a designated city also
  shows its ward-office caveat. Without coverage, the selected municipality gets an explicit unavailable
  message. Without a municipality, the finder shows general prefecture starting points. Today all canonical
  offered municipalities have coverage; existing synthetic UI tests exercise unavailable coverage separately.
- Finder selection and map browsing use component-local state. They do not read/write the saved local
  guidance selection; existing interaction tests retain a previously saved value while browsing. An article
  destination has its own linked-location validation and saved-context behavior; do not equate following a
  finder link with persisting a saved location.
- Supplement check dates format in UTC using `en`/`ja-JP`. They remain research dates under `needs-review`,
  not substantive approval or automatic date-based eligibility. Preserve raw dates and status in data.

## Japanese supplement-title fallback

Source inspection establishes the server rule: construct a map by supplement artifact `contentId` (last
registration wins), require active availability and the current source revision, then include a truthy `title`.
The finder uses the supplied title only in Japanese; a missing title renders the canonical English title
with `lang="en"`. It retains title bytes rather than trimming or applying an article-component whole-overlay
rule to the supplement title. The title map is built/cached at module scope for the static catalog lifecycle.

A portable read-only probe applied that inspected rule using the existing source fields/hash core and
compared it with titles in the actual bundled local-guidance artifacts. Exact field equality passed:
**784 current Japanese titles, zero current English fallbacks, zero duplicate artifact content IDs and zero
whitespace-only titles**. This records today's data, not permission to remove fallback. Existing UI tests
provide a partial title map and verify the English-language fallback link.

Duplicate selection is a future acceptance distinction: this supplement selector uses a last-registration
map, while the three article-component selector uses the first matching active identity. Do not generalize
one selector's ordering to the other family. Current supplement identities are unique; bundle integrity
rejects duplicate accepted IDs. Future fixture/producer work must keep explicit family semantics, and any
change to the Claude-owned selector requires coordination. No selector change is proposed here.

Direct standalone import of the Next server selector was attempted and failed because `server-only` is not
a standalone installed module in this execution environment. The successful probe used the portable hash
core and inspected rules, rather than mocking/removing that boundary. It does not claim direct runtime
execution of the selector or its cache. The existing Japanese component tests ran under the configured web
test environment unchanged.

## Additional Tokyo grouping dependency

`src/domain/geography/tokyo-areas.ts` contains three stable grouping IDs and existing bilingual labels:
`special-wards`, `tama`, `islands`. They are outside the 46 `finder.` and eight `regionMap.` message keys.
The component uses English group labels for grouping and looks up their Japanese counterparts for display.

The existing pure helper groups consecutive code-ordered options: special wards use `131xx`, other Tokyo
codes below `13360` use Tama, and `13360` onward uses islands; `13000` and non-Tokyo codes have no area.
It does not offer otherwise-unresearched locations. Current finder options produce special-wards and Tama
groups; the island group has no current offered municipality, but remains a supported group dependency.
Do not prune its label or invent island research because it is absent from today's projection.

The proposed finder descriptor needs these grouping rules/labels or an explicit shared pure-domain contract,
in addition to its eleven abbreviated guide labels. Claude must decide provenance/catalog treatment of the
three Japanese labels before extraction; Codex leaves the existing bilingual module unchanged. The candidate
file set need not gain another file if a reviewed finder descriptor carries or references the group data.

## Evidence, review and limits

Commands used `rg`/targeted reads and in-memory PowerShell here-string probes piped to
`node --import tsx --input-type=module`. The projection probe invoked `buildContentBundle`, recreated its
finder dependencies from returned JSON, deep-compared the full result, checked guide targets/order/grouping
and counted current coverage. The title probe used the current artifact registration plus portable source
revision core and deep-compared titles with actual generated bundle artifacts. No generated output was written.

Existing tests ran unchanged:

```text
npx vitest run src/lib/content/prefecture-finder.test.ts src/components/content/prefecture-finder.test.tsx src/components/content/japanese-article-components.test.tsx src/domain/geography/tokyo-areas.test.ts src/domain/geography/prefecture.test.ts src/lib/content/local-guidance-translations.test.ts
```

Result: **16 tests / five files passed**. The final requested path does not exist and Vitest did not select
it; no standalone local-guidance-selector test is claimed. No new implementation tests or production changes
were added. Full release/build/browser, TypeScript/lint, SQL/hosted checks and external geography/translation
source verification were not repeated for this documentation-only audit.

Add this record and the Tokyo-label decision to the held consolidated queue. Renderer parity `f9681f9`,
fee `c72bcd2`, orientation `dc97629`, translation helper and export/provenance decisions still await review.
Reviewed integration remains `1a4ab65` / source `4372d4a`. No main merge, hosted activation or scheduling.
