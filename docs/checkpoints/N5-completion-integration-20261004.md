# N5 consumer-switch completion and integration — 2026-10-04

Tested exact combined source **7f409a30804890e80244e6d5eb5b96546bd94993** on codex/hosting-native-integration. Claude approved the documentation-only handoff **8352af2e800f20992a32f95b6bddbf81b708f33a** and adopted it as **47385c4**. N5's planned metadata producer/selectors, freshness wiring and all web metadata consumer switches are complete for local code scope. Native and hosted/operator gates remain open.

## Receipt and review

Claude adopted exact prior handoff **7596efd115397ae451514b6d027925a0835c61ac** as **1f63d87**, tree-equal, and approved its documentation for stated scope. The exact article-detail checkpoint **a2978129066acab60ea1fde009a55c22f365b8b3**, parent 1f63d87, changes one page only.

Codex approves a297812 with no blocking findings. Static params, generated page metadata, article relationships, groups and journeys use the reviewed article-metadata facade. Only the lookup supplying the rendered body uses the existing MDX registry, imported as getRenderableArticleBySlug. Content selection/destructuring, missing-body notFound behavior and unknown-slug metadata behavior are preserved. No rendering, query handling, translation lookup, source metadata or catalog value changes.

Independent focused metadata/producer/H2 parity suites at exact a297812: **24 tests / 3 files** passed. No new redundant import-only test. Claude independently reports before/after **409 normalized HTML files**, **2,044 RSC payloads' string content** and sitemap body identical, plus release 14/14 and two default-worker production browser runs 35/5. These corpus/build/browser results are attributed to Claude, not independently repeated as full-corpus captures by Codex.

Cherry-picked exact a297812 as **7f409a3**, conflict-free, from prior handoff 7596efd. The complete tested tree equals exact reviewed a297812, including documentation. All sixteen production metadata consumers now use the plain facade for metadata-only lookups; only article body rendering imports the MDX registry. The source producer still AST-reads the original registry order without executing MDX. Collection validation and the generated-module freshness gates remain in place.

## Combined evidence

Owned detached LF validation checkout at exact 7f409a3, existing copied dependencies (no clean install). Supabase/AWS/SES/email/public settings cleared; email delivery false, public origin https://nihonest.invalid and internal checked flag unset.

**npm run release:check -- --target local: 14/14 passed in one invocation**: **1,220 tests / 197 files**, lint, article metadata freshness, architecture **731 production modules**, editorial/coverage/localization/article/glossary audits, production **416 build entries**, post-build TypeScript, CMS exclusion and all **37 browser JS files**. No guidance/source registry in browser JS or map geometry in route entries. Article initial JS: **826.5 KB raw / 209.4 KB gzip**, unchanged from the preceding combined gate. No controlled build/size savings claim; earlier warm duplicate-validation measurements retain their limited scope.

Production Playwright on the exact same build at default eight workers:

- First run: **34 passed / 1 failed / 5 Auth skipped**. home.spec.ts's FAQ-to-Explore query scenario failed before navigation: the No matching FAQ found heading for /faq?q=juminhyo did not appear within five seconds. No assertions/timeouts/source changed.
- Full repeat: **35 passed / 5 Auth skipped**, all forty discovered cases, including three early-input and seven H2 query-context cases. The initial failure is retained as an **unresolved intermittent FAQ-query observation**; the successful repeat does not establish its cause or a fix. Share it with the shared search owner for a bounded follow-up if it recurs.

Temporary loopback production servers stopped. Validation checkout clean and whitespace passed. Current source is identical to reviewed Claude source, and no code changed between the two browser runs.

The previous combined CMS audit at exact 6f83d94 passed both widths and keyboard walkthrough; not rerun here because this checkpoint changes only article-detail import sources/body lookup alias. Previous deliberate stale-title build rejection and full-corpus normalized markup/RSC parity remain separately attributed; no new capture or intentional source mutation in this final combined pass.

## Completion and limits

N5 local implementation/consumer-switch review and integration are complete. Direct production builds/release checks refuse stale generated metadata; CMS saves regenerate or clearly report guarded failure; plain metadata/selectors have the tested portable dependency boundary; all metadata-only web lookups have switched. The MDX body registry and its validation remain, so this does not claim elimination of duplicate validation or MDX compilation. Metadata is generated from canonical registrations, not a second manual inventory.

N1/N2 native renderer/UI/Hermes and broader grammar acceptance, N4/H5 hosted acceptance, J1 operator/hosted gates and human Japanese review remain open as recorded elsewhere. No hosted/CI/Auth/SQL/provider acceptance rerun, human screen-reader review, clean install, main merge, real email, scheduler or activation. Documentation through 8352af2 is approved and adopted; an unresolved FAQ-query observation is explicitly carried forward.

## Completion receipt and FAQ follow-up

Codex verified that 47385c4 and 8352af2 have identical trees, and that production source/configuration at 47385c4 has no difference from reviewed a297812. Claude approved the completion record, queue and consolidated status through 8352af2 for their stated scope. This receipt update can accompany the next consolidated documentation review; it introduces no code or dependency handoff.

Claude's follow-up on a production build of 47385c4 did not reproduce the FAQ timeout: an eight-worker, forty-visit probe passed **40/40**, with the heading visible after page load in **105–700 ms** (median about 200 ms) and the searchbox always containing juminhyo. Four warm and two fresh-server full Playwright runs each passed **35 / 5 Auth skipped**. These checks are attributed to Claude. Code inspection found no demonstrated URL-restoration/pre-hydration race. CPU contention during client FAQ indexing is a candidate explanation only; the cause remains unproven and the observation stays open.

If the case recurs, retain a trace and send it to Claude for the shared-search follow-up. Against an already running loopback production server, use:

```powershell
$env:PLAYWRIGHT_BASE_URL = 'http://127.0.0.1:3199'
npx playwright test e2e/home.spec.ts --grep "carries an unsuccessful FAQ query into the complete Explore search" --trace on
```

This is a contingent diagnostic command, not an additional run claimed here. Assertions and timeouts remain unchanged.
