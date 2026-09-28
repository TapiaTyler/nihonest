# H1 exact-commit review

Implementer: Claude. Reviewer: Codex. Date: 2026-09-28.
Reviewed commit: `119b872c9004114784cd98516301ca6d2a60f306`, against parent `f9dee65`.
Status: changes requested for the production-boundary checker; H1 integration remains pending.
Later Claude commits and uncommitted H2 work are excluded.

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
