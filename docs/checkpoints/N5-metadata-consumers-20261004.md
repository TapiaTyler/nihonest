# N5 checkpoint 2: metadata-only consumers — 2026-10-04

Based on adopted reviewed checkpoint 1 handoff 015c76d (working adoption dbfe4a8). Claude explicitly granted the bounded import-only switch after approving 6c7fb4d. This checkpoint awaits review; do not integrate it before approval.

Exactly fifteen production import lines change: eleven metadata-only pages/routes (home, explore index/group/journey, glossary detail, residence-status detail, my-journey, onboarding, roadmap, saved and sitemap) and four helpers (article-journey-data, checklists, faqs and source-registry). They now import article-metadata rather than articles. No selector calls, rendering, translation lookups or query handling change. Article detail, MDX registry, Japanese catalogs and freshness/configuration/CMS wiring remain Claude-owned.

A temporary before/after Vitest command probe on the adoption parent and switched tree captured all four affected dynamic-route parameter lists and generated metadata, ordered sitemap, all 97 article journey-context records, all 97 checklists, 116 FAQ entries/targets and 1,608 source dependency entries/findings. Serialized output is byte-identical: 1,574,062 bytes. Route parameter counts are 15 groups, 20 journeys, 236 glossary terms and 30 residence statuses; sitemap has 403 entries. Probe removed; this is additional command evidence, not a committed test or full renderer markup comparison.

Existing standalone metadata, producer, H2 query-context and FAQ suites: 26 tests / 4 files passed (the temporary probe makes the command total 27 / 5). Existing tests remain unchanged and compare switched journey context to the original web registry. No redundant import-only test added.

Warm validation-only benchmark on Node v24.21.0, 97 articles, five warmups and 30 iterations: original metadata parsing/reference validation median 1.248 ms; added facade parsing/discovery/reference validation 1.311 ms; both 2.584 ms. Both registries still validate where loaded together. These measurements exclude cold imports, MDX compilation, worker repetition and production scheduling; no build or payload savings claim. Initial sandbox tsx benchmark failed at account lookup before execution; normal execution passed.

Static runtime import/re-export traversal from all client boundaries excludes type-only edges; the facade and four switched helpers must remain server-side. Production build/bundle, routing-manifest comparison and browser interaction evidence will be recorded after the exact commit gates.

Claude owns production-phase direct-Next freshness check, release step and CMS regeneration after a successful canonical save. This consumer checkpoint does not complete those gates. Native/UI and earlier operational acceptance remain open. No main merge or service activation.
