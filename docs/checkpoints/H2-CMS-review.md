# H2 and CMS stability review — 2026-09-28

Codex reviewed exact H2 commit `581ed1e31d9777992e8d4969a9e01ac73980c918`
and CMS commit `68aa4e8e259c22824ddb405792d3b67a5df59c09`. Review was restricted
to those hashes, excluding other work. Review checks used an isolated detached
LF Windows checkout at `68aa4e8`, Node 24.21.0, Next.js 16.3.4, and copied existing
dependencies, not a clean install. Hosted/email/AWS settings were removed; only a
fixture HTTPS site origin was supplied. Browser checks used an isolated loopback
production server and installed Chrome.

## H2 review at `68aa4e8`: approved scope; dependency then pending

Historical review at `68aa4e8`: the dependency gate below was subsequently resolved by reviewed
H1 fix `1d46b0d`. H2 is now integrated by exact hash and combined-validated at `4f41ec5`; see the
[completion record](../refactor.md#h1-h2-and-j1-adapter-integration--2026-09-28). The full existing
browser suite and wider hosting acceptance gate remain open.

No blocking finding in the H2 diff. It preserves canonical content and metadata
on the server, prebuilds the article/status/journey detail families, and moves
query context into Suspense-wrapped client boundaries, following the installed
`use-search-params.md` guide. Exactly-one parameter handling preserves the former
string-versus-array behavior. Return destinations keep the existing allow-lists;
journey/route context is restricted to related journeys and valid routes; local
aliases keep the existing canonical/legacy matching rule and do not write saved
location preferences. Queryless fallbacks remain available before hydration.

Interfaces for later consumers:

- `singleQueryValue`, `articleReturnDestination`, `statusReturnDestination` in
  `src/lib/navigation/query-values.ts` preserve query validation.
- `getArticleJourneyData` assembles compact server data; `resolveArticleJourneyContext`
  resolves it for client navigation. Candidate metadata and
  `resolveJourneyViewSteps` support the query-guided journey view.
- `getLocalLocationAliases` supplies `LocalLocationAliases` to the linked guidance
  and document boundaries. No translation catalogs, domain contracts, or deployment
  configuration changed.

Independent checks:

- `vitest run --maxWorkers=4`: **585 tests / 152 files passed**, including H2 parity
  and CMS regression tests. The first default-worker run, concurrent with the build,
  ended with a worker-pool unexpected exit, 583 passes, and an earlier Git object
  permission diagnostic; its cause was not established. It is not recorded as a pass.
- `eslint .`, `tsc --noEmit`, architecture (**689 modules**), editorial audit
  (**479 records, zero approval records**), article localization (**97, zero findings**),
  and whitespace checks passed.
- Public-only `next build`: **415 pages**, with all three detail families reported
  as SSG. CMS exclusion passed. Canonical article, student status, and professional
  worker journey served HTTP 200 with `Cache-Control: s-maxage=31536000` locally.
- `playwright test e2e/prebuilt-query-context.spec.ts --workers=2 --reporter=list`
  against `next start`: **7/7 passed** (direct visits, refresh, navigation, Back,
  safe return links, invalid/duplicate context, local aliases, Japanese and 404s).
  A separate browser probe saved Nagoya, visited Shinjuku through `?local=jp-13104`,
  verified storage still contained Nagoya, and verified Nagoya returned on a queryless visit.
- `check-client-bundles.ts` inventoried 42 browser JS files and passed on the current
  output. This does not resolve the known H1 extraction bug: the independent marker
  probe still reports 640 old versus 113 new markers and misses the Sapporo summary.

H2 is not integrated: its H1 ancestor `efc2837` still needs the marker-regex correction
and regression coverage described in [H1-review.md](H1-review.md). Approval of H2's
scope does not approve that ancestor or close the combined hosting gate. Claude's
reported HTML payload deltas and the 14 existing Playwright failures reproduced on
pre-H1/H1 baselines were not independently rerun. The new seven tests passed; the
older browser suite is not claimed clean. Claude owns a separate bounded repair of
those stale tests, preserving their behavior assertions and providing baseline evidence.
Hosted CDN behavior, manual authentication, and hosted deployment were not tested.

## CMS: approved and integrated independently

All Git operations in `git-session.ts` are reads; suppressing optional locks avoids
status index refresh interfering with editor Git writes. The index-byte regression
has a plain `git status` control. Codex removed the flag temporarily in the isolated
checkout: that assertion failed as intended, then the original file bytes were restored.
Seven fixture-heavy suites adopt the existing 30-second suite-timeout pattern;
assertions and recovery diagnostics remain intact.

The approved CMS patch was cherry-picked, not merged with its ancestors, onto the
designated integration branch as **`2a35d9aa7352834f9219243837324d9d9ab7f856`**.
The nine-file diff matches the reviewed patch; H1/H2 and pending adapter `9dee0a0`
are excluded. An isolated LF checkout of this combined source passed:

- Full `vitest run` alone at default concurrency: **568 tests / 149 files**.
- Lint, TypeScript, architecture (**679 modules**), and whitespace checks.
- Public-only production build (**415 pages**) and subsequent CMS exclusion.

The completion-record commit changes documentation only. This does not establish
that artificial CPU-saturation stalls are fixed; Claude's unexplained 20–30-second
stress stalls remain a follow-up. No shared Vitest configuration was changed. No
hosted service, provider send, main merge, or production activation occurred.

## Combined handoff — 2026-09-28

After H1 correction and approval, H2 `581ed1e` was merged by exact hash as `d0f9028`, followed by
scope-approved J1 adapter `9dee0a0` as `4f41ec57e092ba78deb6b153e418ec0efe760295`. CMS stability
was already integrated as `2a35d9a`; its ancestor commits were not merged through the CMS patch.
Combined validation passed 608 tests / 154 files with four workers, lint, TypeScript, architecture
(691 modules), editorial/article/glossary checks, public/job fixture preflights, public-only 415-page
build, CMS exclusion, repaired bundle checker with all four artifact-injection negative controls,
and all seven H2 production browser tests. No clean installation or real SQL/provider was used.

Claude's absence plan leaves the stale shared Playwright tests with Claude unless the user authorizes
a temporary handoff. The earlier agreement that Claude owns their bounded repair remains in force.
H4/H5/H3b are not started; their files and translation catalogs remain Claude-owned.
