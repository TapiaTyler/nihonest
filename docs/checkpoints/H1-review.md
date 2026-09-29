# H1 exact-commit review

Implementer: Claude. Reviewer: Codex. Date: 2026-09-28.
Reviewed commit: `119b872c9004114784cd98516301ca6d2a60f306`, against parent `f9dee65`.
Current status: approved after exact marker-fix rereview at `1d46b0d`; integrated and combined-validated
as recorded below. Earlier findings and pending statuses remain historical review records.

## Finding

**P2 — Catalog checks omit asynchronous browser chunks.** In `scripts/check-client-bundles.ts:84`,
`allChunks` is derived only from route `entryJSFiles`. The guidance/source tests at lines 90–103 therefore
exclude the asynchronous chunks introduced by H1, although the success message claims no browser chunk
contains those catalogs. The isolated build has 39 emitted JavaScript chunks; the checker scans only 24.

A generated-output probe appended one actual guidance marker and all 1,607 canonical source URLs to the
unscanned asynchronous map chunk. The checker returned exit 0 and its success message. The same markers
in a scanned entry chunk returned exit 1 with both catalog violations. Original bytes were restored in a
`finally` block after each case, and the restored checker passed. No tracked source or Claude worktree
was modified. This proves a catalog import added to a lazy component could evade the intended gate.

Requested change: inventory every emitted browser JavaScript chunk for guidance/source catalog checks;
keep map-geometry restrictions scoped to route entry chunks so the intended async map remains allowed.
Keep initial route size accounting distinct from async payloads, and add a regression fixture proving an
async catalog leak fails while clean async map geometry passes. Preserve the original-build negative control.

## Implementation assessment

No other actionable findings in the exact committed diff. The catalog-free constants module removes the
finder's runtime catalog import. The Japanese component renderer assembles only used blocks on the server;
the client body receives component nodes rather than importing the catalog-owning components. Both finders
share the memoized payload, and missing component nodes fail explicitly. The client-side dynamic imports
match the installed Next.js lazy-loading guide and retain server rendering. Canonical content, translations,
revision checks, draft labels, and existing locale fallback logic are unchanged.

For Stage C, preserve these handoff contracts: `prefecture-finder-guides.ts` supplies lightweight constants
and payload types; `getPrefectureFinderData()` returns a shared `PrefectureFinderData`; geography server
wrappers assemble payloads for `JapanRegionMapView({ regions, locale })` and lazy finder components;
finder/grid wrappers accept `japaneseSupplementTitles`. `LocalizedArticleBody` and `TranslatedArticleBody`
accept `components?: TranslatedArticleComponents` supplied by `renderJapaneseArticleComponents(markdown)`.
The former supplement-title context is removed. N2/N3 still wait for the Stage C file handoff.

## Commands and results

- Exact review: `git show`, `git diff 119b872^ 119b872`, consumer searches, and `git diff --check`.
  Tests/builds used the existing isolated detached worktree at the full reviewed hash, with zero tracked
  CRLF/mixed files and a clean tracked tree. Node 24.21.0, Next.js 16.3.4, copied existing dependencies;
  this was not a clean installation.
- `vitest run --maxWorkers=4`: **563 tests across 150 files passed**. `eslint .`, `tsc --noEmit`,
  architecture (682 modules), and mechanical article localization (97 current articles, zero findings) passed.
- Public-only fixture build through the existing verification wrapper: normal Turbopack `next build`
  generated 415 pages with Supabase/email/AWS settings removed; `check-cms-build-exclusion.ts` passed.
  Article, status, and journey detail routes remain dynamic, consistent with pending H2.
- `check-client-bundles.ts --json` passed on the original and restored build. Independent inventory of all
  39 emitted JS chunks found zero guidance prose and zero source URLs. Map geometry was in one async chunk.
  Reported post-change initial route JS matched Claude's figures: article 801.4/203.8/170.4 KB,
  home approximately 752/189/157 KB, explore 803.7/202.4/168.7 KB, FAQ 779.3/197.1/164.1 KB
  (raw / gzip level 9 / Brotli quality 11, summed per chunk).
- Claude supplied the before/after baseline, served-HTML measurements, and manual English/Japanese finder,
  map, supplement-title, and local deep-link checks. Codex did not independently repeat the baseline build,
  served-HTML comparison, or manual browser session. Playwright and clean installation remain unrun here;
  the checker fix requires rereview before H1 integration.

No main merge, real email, hosted activation, or translation approval occurred. H1's application changes
are not integrated by this review record. J1 hardening approval/integration is a separate checkpoint.

## Rereview of `efc2837` — 2026-09-28

Reviewed exact `efc2837fc202c015e973572e26bacb7dbb81c228` against parent `397eb87`, including the H1
ancestor `119b872`. The parent merges the approved integration handoff `861ee5f`; H2 remains excluded.

The async inventory finding is resolved: every emitted `.js` under `.next/static` is scanned, missing entry
files fail, catalog rules cover entry/async files, map geometry is restricted only in entries, and initial
route size accounting remains separate. The seven new boundary fixtures pass, including async catalog
leaks, intended async map geometry, and the three-violation pre-H1 control.

**P2 — Extracted marker regex excludes the letter `n` rather than newline.** At
`src/lib/build/client-bundle-boundary.ts:32`, the new character class uses two backslashes followed by `n`.
The two backslashes match a literal backslash, leaving `n` as an excluded ordinary character. The original
regex used the separate backslash and newline escapes. Extraction reduces catalog guidance markers from
**640 to 113**, leaving 527 formerly detectable summaries unprotected. A fixture chunk containing the full
canonical summary beginning "Sapporo takes moving-in notifications within 14 days" returns no violations
with the extracted marker set, despite being detectable using the original set.

Requested change: preserve the original exclusion of quotes, backtick, literal backslash, and actual newline;
keep ordinary `n` characters. Add direct marker tests for these characters and a marker-coverage regression
against the canonical summaries, so the helper extraction cannot silently discard most guidance markers.
Retain all async inventory and rule fixtures from this fix.

Commands: exact `git show`/`git diff`, the read-only catalog-marker probe, and focused Vitest (seven tests,
one file passed), run in the clean isolated LF checkout at the full fix hash. No tracked sources or Claude
worktree were modified. Wider tests/build and another artifact injection are deferred until this new blocking
marker regression is fixed; the original H1 build/full-suite results above remain recorded without attributing
them to the newer source. H1 is not approved or integrated yet.

## Rereview of `1d46b0d` and integration — 2026-09-28

Codex reviewed exact `1d46b0d14e3ee75f68e5a435ae70209047373ab5`, whose parent is `efc2837`.
Only the marker helper and its tests change. The original exclusions (quotes, backtick, literal backslash,
real newline) are restored; ordinary `n` remains. All ten boundary fixtures pass, including the three new
character, canonical coverage and full-summary fixtures. An independent catalog probe finds zero differences
from the original extraction rule across 784 summaries, restores 640 markers and detects the full Sapporo
summary in an async chunk. The original rule still omits 144 summaries with an early excluded character;
this is recorded coverage, not a claim that every individual summary is detectable.

**Approved.** Reviewed H1 inputs `119b872`, `efc2837`, and `1d46b0d` were merged by hash into the
designated integration branch as `53baa860334b03c5d4fc5760967821c8d0cdfcda`, excluding H2 and the
adapter at this stage. The isolated LF checkout passed 582 tests / 151 files with four workers, lint,
TypeScript, architecture (683 modules), public-only 415-page build and CMS exclusion. The build still
reports dynamic detail routes at this H1-only stage, as expected before H2.

An emitted-artifact probe inventories 42 scripts and injects the full canonical Sapporo summary into an
async map chunk and an entry chunk, all 1,607 source URLs into the async chunk, and map geometry into an
entry chunk. Each injection makes the checker exit 1 with the expected violation. Original bytes are
restored in `finally`, byte equality is checked, and the restored checker exits 0. The probe selects chunks
from the generated report rather than relying on hashed filenames. This resolves both recorded P2 findings.

The subsequent H2/adapter combination is validated separately at `4f41ec5`; see
[the consolidated record](../refactor.md#h1-h2-and-j1-adapter-integration--2026-09-28).
No Claude worktree, translation artifact, main branch or hosted service was modified during review.
