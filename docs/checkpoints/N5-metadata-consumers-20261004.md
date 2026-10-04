# N5 checkpoint 2: metadata-only consumers — 2026-10-04

Based on adopted reviewed checkpoint 1 handoff 015c76d (working adoption dbfe4a8). Claude explicitly granted the bounded import-only switch after approving 6c7fb4d. Exact implementation **068b07cee7518c3634d3a608804321ffd367cdfc** awaits review; do not integrate it before approval.

Exactly fifteen production import lines change: eleven metadata-only pages/routes (home, explore index/group/journey, glossary detail, residence-status detail, my-journey, onboarding, roadmap, saved and sitemap) and four helpers (article-journey-data, checklists, faqs and source-registry). They now import article-metadata rather than articles. No selector calls, rendering, translation lookups or query handling change. Article detail, MDX registry, Japanese catalogs and freshness/configuration/CMS wiring remain Claude-owned.

A temporary before/after Vitest command probe on the adoption parent and switched tree captured all four affected dynamic-route parameter lists and generated metadata, ordered sitemap, all 97 article journey-context records, all 97 checklists, 116 FAQ entries/targets and 1,608 source dependency entries/findings. Serialized output is byte-identical: 1,574,062 bytes. Route parameter counts are 15 groups, 20 journeys, 236 glossary terms and 30 residence statuses; sitemap has 403 entries. Probe removed; this is additional command evidence, not a committed test or full renderer markup comparison.

Existing standalone metadata, producer, H2 query-context and FAQ suites: 26 tests / 4 files passed (the temporary probe makes the command total 27 / 5). Existing tests remain unchanged and compare switched journey context to the original web registry. No redundant import-only test added.

Warm validation-only benchmark on Node v24.21.0, 97 articles, five warmups and 30 iterations: original metadata parsing/reference validation median 1.248 ms; added facade parsing/discovery/reference validation 1.311 ms; both 2.584 ms. Both registries still validate where loaded together. These measurements exclude cold imports, MDX compilation, worker repetition and production scheduling; no build or payload savings claim. Initial sandbox tsx benchmark failed at account lookup before execution; normal execution passed.

Static runtime import/re-export traversal from **84 client boundaries** found no path to the facade or four switched helpers; type-only edges are excluded. Dynamic-loading behavior is covered separately by the production bundle scan.

Exact 068b07c passed **npm run release:check -- --target local, 13/13 in one invocation** in the owned detached LF checkout, with copied dependencies (no clean install): **1,205 tests / 194 files**, **729 production modules**, audits, production **416 build entries**, post-build TypeScript, CMS exclusion and **37 emitted browser JS files**. Article initial JS: 826.2 KB raw / 209.2 KB gzip. Baseline had 43 files and 209.5 KB gzip; these are observations, not a controlled savings claim. Single release build durations were 10.2 s baseline and 12.5 s checkpoint, likewise not a performance conclusion. Public/Supabase/AWS/SES/email settings cleared; email delivery false and origin https://nihonest.invalid.

Compared preserved exact 5f29566 production manifests with 068b07c: app path routes match; routing manifest matches excluding build ID; prerender inventory/order (**411 entries** in that manifest), source routes, revalidation/expiry/header rules and not-found routes match. Build-specific data paths/bypass tokens were not compared. The build's 416 progress entries and prerender manifest's 411 entries are different counters.

## Browser gate: open follow-up

Public production Playwright runs used a temporary loopback-only server, stopped after each run. No existing tests, timeouts or assertions were changed. Auth opt-in was unset; five Auth-dependent tests skipped in each run.

| Exact source | Workers | Passed | Failed | Skipped |
| --- | --- | --- | --- | --- |
| 068b07c | default 8, first | 26 | 6 | 5 |
| 068b07c | default 8, repeat | 31 | 1 | 5 |
| 5f29566 approved baseline, fresh build | default 8 | 31 | 1 | 5 |
| 5f29566 approved baseline | 2 | 31 | 1 | 5 |
| 068b07c, original retained build | 2 | 31 | 1 | 5 |
| 068b07c, original retained build | 1 | 30 | 2 | 5 |

All seven H2 query-context browser cases passed in each run. Initial checkpoint failures were six home navigation checks; repeats hit the NHI finder selection. Baseline failures were the Explore filter/no-results check and prefecture general-advice selection. The single-worker checkpoint run hit those same two baseline scenarios. Baseline-existing intermittent failures are demonstrated, but the cause and every initial failed scenario's attribution are not proven. This is **not** a clean full-browser pass or completed browser gate.

A focused diagnostic reproduced an inconsistent finder state: in two of four immediate interactions, the native prefecture select held jp-13000 but no municipality control appeared, including after 1.2 s. Four fresh contexts using a network-settled diagnostic before selection all produced the expected control. This supports early interaction/hydration as a candidate; it does not establish a root cause or prescribe network-idle waits in tests. A focused group-to-article navigation also passed. Shared finder/components and e2e specs remain Claude-owned; coordinate a bounded investigation/fix rather than silently weakening their assertions. Next logged Internal: NoFallbackError during some runs; no cause claimed.

Commands: full local release; existing focused Vitest suites; temporary before/after capture; TypeScript static import traversal; warm validation benchmark; production manifest comparison; production Playwright with default, two and one workers; focused navigation and finder-state diagnostics. Evidence logs/JSON are retained in the owned artifact directory. No clean install, hosted/Auth/SQL/provider acceptance or complete parent-versus-rendered-page markup capture. Validation checkout and worker tree were clean before their owned documentation update; no services left running.

Claude owns production-phase direct-Next freshness check, release step and CMS regeneration after a successful canonical save. This consumer checkpoint does not complete those gates. Native/UI and earlier operational acceptance remain open. No main merge or service activation.
