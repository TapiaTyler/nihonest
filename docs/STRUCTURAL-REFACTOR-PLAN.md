# Structural Refactor Plan

This checkpoint reorganizes the existing application without changing public behavior, stable content identities, routes, or persistence contracts. It prepares the canonical catalog for localization and a later native client without prematurely introducing a CMS, monorepo, or shared-package system.

## Working method

- Prefer Git-detectable moves and small extractions over deleting and recreating modules.
- Preserve a stable public import through a barrel or compatibility module while consumers migrate.
- Split data by durable subject or ownership boundary, never by arbitrary line count.
- Keep schema validation at the assembled catalog boundary so duplicate IDs and broken references continue to fail early.
- Add module comments only for ownership, invariants, non-obvious state, or prohibited dependencies.
- Run focused tests after each bounded move; reserve a production build and wider regression pass for major checkpoints and final closure.
- Do not combine structural moves with factual content rewrites or UI redesign.

## Inventory

The largest hand-maintained modules at the start of this checkpoint are:

| Module | Approximate size | Primary responsibility | Intended boundary |
|---|---:|---|---|
| `src/data/glossary-additions.ts` | 204 KB / 700 lines | Most glossary records | Immigration, employment, education/language, tax/municipal, and daily-life modules |
| `src/data/structured-residence-status-guidance.ts` | 111 KB / 506 lines | Structured status explanations | Status-category modules |
| `src/data/faqs.ts` | 104 KB / 222 lines | FAQ records and browse mapping | Existing FAQ browse groups |
| `src/data/sources.ts` | 94 KB / 321 lines | Official-source registry | Authority and subject modules with one validated export |
| `src/data/annotated-documents.ts` | 51 KB / 490 lines | Document families and versions | Identity/immigration, tax, My Number, and municipal records |
| `src/data/discovery.ts` | 42 KB / 326 lines | Groups, journey steps, routes, and journeys | Groups, shared steps, and journey-family modules |
| `src/lib/content/articles.ts` | 27 KB / 316 lines | Static MDX registration and catalog assembly | Categorized static registrations plus one validation boundary |
| `src/components/site-header.tsx` | 25 KB / 392 lines | Desktop and mobile navigation and account menu | Header orchestration, desktop navigation, mobile drawer, and account menu |
| `src/components/discovery/explore-discovery.tsx` | 20 KB / 323 lines | URL state, filters, grouping, and results | State hook, filter panel, and grouped results |
| `src/components/personalization/onboarding-form.tsx` | 15 KB / 310 lines | Journey onboarding workflow | Step controls and selection panels under one form owner |
| `src/components/documents/annotated-document-viewer.tsx` | 18 KB / 278 lines | Version/location selection and document presentation | Selectors, navigation, and semantic field presentation |

`src/types/database.ts` is generated output and is not a manual split candidate.

## Dependency rules to preserve

1. `src/domain` remains platform-independent and does not import React, Next.js, Supabase clients, or repository data catalogs.
2. `src/data` supplies validated canonical registries and may depend on domain schemas, but not UI components.
3. `src/lib` assembles catalogs and integrates infrastructure; pages and components consume its stable APIs where an adapter already exists.
4. `src/components` owns presentation and interaction, not canonical records or business-rule definitions.
5. Static MDX imports remain build-time visible to Next.js. Article registration must not be replaced with unrestricted runtime filesystem discovery.
6. Stable IDs, slugs, routes, storage keys, database contracts, editorial revisions, and translation revision links must not change during a structural move.

## Iterations

### 1. Source dependency coverage and refactor contract

- Record this inventory and the dependency rules.
- Register annotated-document families and local-guidance supplements as source dependents.
- Retain their associated canonical article so source-review priority and claim categories remain risk-aware.
- Require the repository source registry to close without warnings.

### 2. Official-source registry

- Split the source catalog into stable subject modules.
- Keep `@/data/sources` as the public compatibility entry point.
- Preserve order only where it is externally observable; otherwise make deterministic assembly explicit.
- Validate source IDs and dependency coverage after assembly.

**Complete locally:** 286 source records now live in seven authority-and-subject modules. The compatibility entry point defines deterministic module order, preserves local record order, and reapplies source-monitoring metadata exactly once. Focused assembly validation requires complete membership and unique IDs without a globally coordinated sequence number.

### 3. Glossary, FAQ, and residence-status data

- Split glossary additions by subject and FAQs by their existing browse groups.
- Split structured residence-status guidance by status category.
- Preserve the current exported arrays, lookup behavior, sorting inputs, and editorial revisions.

**Iteration 3A complete locally:** the 213 glossary additions now live in ten modules keyed to the existing primary browse topics. Shared residence-status and occupational-route constructors have one typed owner, while `@/data/glossary-additions` preserves the established export through deterministic module and local array order. Focused assembly validation requires complete membership and unique IDs. FAQ and structured residence-status splits remain separate bounded passes.

**Iteration 3B complete locally:** all 104 FAQs now live in six modules keyed to the existing browse groups. A typed constructor assigns group ownership at the module boundary, replacing the separate ID-to-group lookup table without duplicating the group on every record. `@/data/faqs` follows the canonical browse-group order and each group owns its local editorial order; focused assembly validation locks complete membership and unique IDs without global sequence numbers. Structured residence-status guidance remains isolated for Iteration 3C.

**Registry-order cleanup complete locally:** FAQ, glossary-addition, and official-source modules now export direct validated records rather than `{ catalogOrder, record }` wrappers. Compatibility modules define deterministic module order, local arrays define only their own editorial order, and consumer-specific sorting remains with the UI, search, or review report. Article `termIds` now match the exact first-appearance order of inline glossary links across the full MDX catalog, with a repository audit preventing missing, extra, or out-of-order Key Japanese terminology entries.

**Iteration 3C complete locally:** structured guidance for all 30 residence statuses now lives in modules matching the eight canonical residence-status categories. The split exposed and closed the previous Professor and Student coverage gaps. A shared builder owns schema validation and the batch evidence-check date, while `@/data/structured-residence-status-guidance` preserves the public registry and lookup function. Focused assembly validation requires exact module membership, unique IDs, category ownership, compatible lookup behavior, and complete status coverage.

### 4. Discovery and article registration

- Separate content groups, shared journey steps, and journey families.
- Split static article registrations into categorized build-time modules without introducing runtime discovery.
- Keep the existing content API and all route resolution unchanged.

**Iteration 4A complete locally:** the 15 article groups now have one dedicated registry module, shared article/conditional/route-choice and settlement-step builders have one owner, and the shared eleven-route professional catalog is defined once. All 20 guided journeys are split across eight durable journey-family modules. `@/data/discovery` remains the compatibility entry point and explicitly preserves the established public journey order even where family ownership is interleaved. Focused validation locks group and journey membership, route-aware Student settlement behavior, and shared professional-route consistency. Static article registration remains isolated for Iteration 4B.

**Iteration 4B complete locally:** all 95 MDX articles remain statically imported at build time but their registrations now live in six bounded subject modules. `@/lib/content/articles` remains the sole compatibility and validation boundary, preserves the established catalog order, and exposes the same query API. Repository validation compares the registration imports against the complete `content/articles` directory and requires every family to be assembled exactly once, preventing silent omissions or duplicate registrations as the catalog grows.

### 5. Documents and local guidance

- Split annotated documents by document family and local guidance by municipality or stable subject.
- Preserve document-version identity, current-version rules, selectors, and source dependencies.

**Iteration 5 complete locally:** each of the six annotated-document families now owns its complete version and jurisdiction-variant history in a dedicated module. The four pilot geographies have one registry, while the twelve Shinjuku and Nagoya supplements are divided into six stable subject modules that preserve the existing subject-first, municipality-second order. Compatibility exports remain unchanged, shared review metadata has one owner, and focused validation locks exact registry membership alongside current-version, geography, article, glossary, visual-rights, and source dependencies.

### 6. Navigation and Explore presentation

- Extract desktop navigation, mobile drawer, and account navigation from the header.
- Extract Explore URL state, filters, and grouped-result presentation.
- Preserve focus management, responsive behavior, query persistence, and search performance.

**Iteration 6A complete locally:** `SiteHeader` is now a small composition boundary over independently owned desktop navigation, mobile-dialog navigation, shared route definitions, and account-session actions and controls. Desktop disclosure exclusivity, Escape and outside-pointer handling, focus restoration, mobile entrance and exit transitions, scroll locking, active-route semantics, language controls, and signed-in or signed-out account behavior remain intact. Existing header and homepage accessibility tests pass without changing their user-facing assertions; Iteration 6B remains isolated to Explore presentation and URL state.

**Iteration 6B complete locally:** `ExploreDiscovery` now coordinates the prebuilt search index through independently owned URL/session state, filter controls, grouped-result presentation, and default group browsing. Query debouncing, validated URL restoration, browser-history persistence, result return links, structured filter ordering, locale-aware translations and sorting, jump navigation, activity suggestions, and FAQ recovery remain unchanged. Focused URL-contract tests now complement the existing end-to-end component and search-index coverage.

### 7. Onboarding and document-viewer presentation

- Extract coherent step and selector components while retaining one orchestration owner for each workflow.
- Preserve unsaved-change protection, return routing, accessibility, and local preference behavior.

**Iteration 7A complete locally:** `OnboardingForm` remains the single owner of effective-selection derivation, journey and route inference, unsaved-change protection, preference persistence, route-change notices, and return routing. Stage selection, journey and focused-guide search, route narrowing, and save/privacy actions now have focused presentation components. Existing accessible names, radio-group behavior, local-only disclosure, skip and removal semantics, and navigation outcomes remain unchanged; the annotated-document viewer remains isolated for Iteration 7B.

**Iteration 7B complete locally:** each document-family workflow continues to own jurisdiction synchronization, current-version fallback, version and callout selection, focus movement, and live announcements. Quick navigation, prefecture/municipality/version selectors, lifecycle labels and dates, and the complete version artifact now have focused presentation modules. Existing default-open behavior, quick-jump reopening, archived-version swaps, official-image citations and reuse labels, fictional concept maps, source checks, and two-way local-guidance synchronization remain unchanged.

### 8. Closure audit

- Confirm no circular or prohibited dependencies were introduced.
- Run catalog, editorial, source, search, journey, synchronization, and affected component checks.
- Run the production build and a small critical-path browser suite once.
- Update architecture documentation and hand off the stable canonical contracts to localization.

**Iteration 8A complete locally:** a repository architecture check now traverses production TypeScript imports, rejects circular dependencies, prevents domain code from reaching React, Next.js, Supabase, application, component, data, or infrastructure modules, and prevents data registries from importing UI. The audit moved search normalization and the article source-review projection to platform-independent domain ownership while preserving their established library entry points. The architecture check covers 267 production modules, and the bounded catalog, editorial, source, search, journey, geography, document, and synchronization regression batch passes 113 tests across 36 files. The production build, critical-path browser checks, and final handoff update remain isolated for Iteration 8B.

**Iteration 8B complete locally:** the optimized Next.js build compiles, type-checks, and generates all 402 static pages. The public Playwright suite passes all 17 homepage, knowledgebase, cross-search, journey, onboarding, glossary, and residence-status flows without requiring Supabase; stale assertions were aligned with the current footer navigation, catalog totals, expanded FAQ coverage, debounced query persistence, and current guide titles. The architecture check remains green across 267 production modules, and the canonical-content handoff now identifies these compatibility modules and enforced boundaries as the stable starting point for Phase 14 localization.

## Explicitly deferred

- CMS or article database migration
- Monorepo or package extraction
- Native application scaffolding
- Public deployment
- Broad UI redesign
- Factual content edits unrelated to a structural defect
