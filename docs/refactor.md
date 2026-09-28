# Hosting and native readiness refactor roadmap

Status: planned, 2026-09-28. This replaces the completed structural-refactor working notes.

## Purpose

Prepare Nihonest for its first hosted deployment, then prepare reusable content and account behavior for the
native application. Hosting comes first: browser payload size and request-time rendering affect every visitor
and the resources needed to serve the site.

[ROADMAP.md](ROADMAP.md) remains the overall product roadmap. This document defines implementation batches,
dependencies, acceptance criteria, and review gates supporting its Post-Phase 14 hosted integration gate and
Phase 15 native foundation. Completing refactors does not authorize public deployment, email delivery, content
approval, or a native release.

## Constraints

- Preserve stable IDs, slugs, catalog order, relationships, storage keys, existing saved data, and public links.
- Preserve translation revision checks, provenance, review state, English fallback, and visible draft labels.
- Follow AGENTS.md for Japanese translation ownership. Moving messages must not silently rewrite translations
  or mark them reviewed.
- Keep canonical content in the repository and private account state in Supabase. Retain the existing backend,
  authorization policies, notification queue, and delivery claims.
- Keep the local CMS outside production and preserve its guarded writes and implementation rules.
- Read the relevant installed Next.js guides before changing rendering, proxy, caching, or configuration.
- Avoid generic repository frameworks and speculative restructuring. Introduce workspaces/shared packages only
  when the second application exists and demonstrates a need.
- Share contracts, content, and behavior; native presentation remains separate from DOM, CSS, Next.js, and CMS UI.
- Work in bounded passes. Never discard, stash, or commit another contributor's changes.

## Assessment baseline

These observations explain the priorities; they are not permanent catalog counts or performance budgets.
Capture a fresh baseline when implementation begins.

Claude's production-build assessment reported a common browser chunk of approximately 2 MB (417 KB compressed)
containing municipality guidance, official sources, geography, and map data. Public article, status, and journey
detail pages rendered on request because they read search parameters despite defining static route parameters.
The session proxy also matched public pages. The build succeeded and generated 415 pages.

Codex confirmed the relevant import, query, and proxy patterns through inspection, but did not independently
reproduce the bundle measurement. Its architecture check passed for 677 production modules, and focused bundle
and storage tests passed. Those checks do not establish deployment readiness.

Existing foundations include pure domain rules, injectable key-value storage, reusable sync merge contracts,
a versioned content bundle, translation currency checks, and database notification concurrency protections.
Extend these foundations rather than replacing them.

## Sequence and suggested ownership

Ownership is a recommendation for review, not an exclusive assignment or a claim that one agent is inherently
better. It follows the areas each agent inspected and reduces overlapping edits.

| Batch | Scope | Suggested implementer | Suggested reviewer |
| --- | --- | --- | --- |
| 1 | Hosting readiness: payloads, static pages, release/configuration checks, headers, health, session scope | Claude | Codex |
| 2 | Notification worker; source-monitor adapter after choosing execution location | Codex | Claude |
| 3 | Portable content, parsing/messages, account coordinator, metadata boundary | Codex (N1, N2, N4, N5); Claude (N3, Japanese catalog edits) | The other agent |

Codex is a useful fit for the notification runner and account coordinator because its assessment traced their
queue and race-handling boundaries. Claude is a useful fit for Batch 1 because it already measured the production
build and traced client catalog imports. Claude retains translation ownership. Agree on files before parallel
implementation; each shared file has one active owner at a time.

## Concurrency plan

The batches are ordered by priority, not by strict dependency. Most of Codex's suggested work touches different
files from Batch 1, so running both agents at once saves the most time. The plan below keeps each shared file
with one owner at a time.

### Working setup

- Use a separate Git worktree and branch per agent, and merge at each review gate. In one shared checkout, a full
  test run or `next build` picks up the other agent's unfinished edits, and both builds write to the same `.next`.
- If a shared checkout is unavoidable, do not run `next build`, the CMS exclusion scan, or the full suite while the
  other agent is editing. Run focused tests only, and run the full gate at the review gate.
- Each agent reviews the other's finished checkpoint while starting its own next one, so review never idles either
  agent.

### Stages

| Stage | Claude | Codex | Why these can overlap |
| --- | --- | --- | --- |
| A | H3a (below), then H1 → H2 | J1, then N4 | J1 needs only the H3a contract. N4 touches account sync, which Batch 1 does not edit. |
| B | H4, H5, H3b (CI and release checks); review J1 and N4 | N1 without component payloads; N2 parser and data contracts; review H1 and H2 | N1 is `content-bundle.ts` and new payload schemas. The N2 parser is a new domain module; renderers are wired in Stage C. |
| C | N3; review N1 and N2; Japanese catalog edits for N2 | N2 renderer wiring and component data, then N1 component payloads, then N5 | Batch 1 is finished with `localized-article.tsx` and `japan-geography-reference.tsx`. |

J2 can start in any stage once its execution location is chosen; it touches only `scripts/check-sources.ts` and
source-monitoring modules.

**H3a** is a short first step split from H3: the feature-aware configuration module (settings schema and
validation for public site, accounts, jobs, and email). J1 builds on it, so Claude lands it before H1. **H3b** is
the rest of H3: CI and the release command, done once the other Batch 1 changes exist to be checked.

### Files with one owner per stage

| File or area | Stage A | Stage B | Stage C |
| --- | --- | --- | --- |
| `prefecture-finder*`, `japan-region-map.tsx`, `lib/content/prefecture-finder.ts` | Claude | Claude | Claude (N3) |
| `localized-article.tsx`, `japan-geography-reference.tsx` | Claude | Claude | Codex (N2) |
| Article, residence-status, and journey detail pages | Claude | Claude | Claude |
| `next.config.ts`, `src/proxy.ts`, `src/lib/supabase/*` | Claude | Claude | Claude |
| Configuration modules (`supabase/config.ts`, `site-url.ts`, `email-config.ts`) | Claude (H3a), then read-only | Claude | Claude |
| `src/lib/notifications/*` (except `email-config.ts`), the worker command | Codex | Codex | Codex |
| Account sync provider, `src/lib/accounts/*`, `src/lib/sync/*` | Codex | Codex | Codex |
| `content-bundle.ts`, `src/domain/article/*` | none | Codex | Codex |
| Interface message catalogs, translation data | Claude | Claude | Claude |
| `.github/workflows/*`, the release script | none | Claude | Claude |
| `package.json` scripts | Both may add a line; announce it and don't reorder | same | same |

A checkpoint that needs a file owned by the other agent in that stage waits, or asks for a small change through
the review channel. Neither agent edits the other's files.

## Batch 1 — Hosting readiness

### H1 — Keep full catalogs out of browser imports

Status: planned.

Entry points: `src/components/content/prefecture-finder.tsx`, `src/lib/content/prefecture-finder.ts`, geography
map components, and their importing layouts/renderers.

Implementation:

- Move labels and lightweight constants out of modules that load guidance and source catalogs.
- Assemble finder data on the server and pass only the required payload to the client.
- Import map paths and region data through narrow modules; avoid barrels that initialize unrelated catalogs.
- Trace transitive client imports, including localized article rendering. Preserve erased type-only imports.
- Measure remaining payloads before adding lazy loading or JSON delivery. This fix does not depend on N1.

Acceptance:

- Record production chunk sizes and route usage before/after, including the compression method.
- Full guidance prose and the source registry no longer appear in common browser JavaScript chunks.
- Measure serialized props too; do not transfer the same oversized catalogs through another mechanism.
- Check finder selection, municipality links, Japanese titles, maps, and fallback behavior.
- Add a production-boundary regression check without relying on hashed filenames or fixed catalog counts.
  Establish any size budget from the measured result.

### H2 — Prebuild public detail pages

Status: planned. Coordinate with H1 and inventory existing query behavior first.

Entry points: article, residence-status, and guided-journey detail pages.

Implementation:

- Keep canonical content, metadata, relationships, translation checks, and route generation in the build/server path.
- Move request-specific query handling into small client boundaries where appropriate.
- Preserve return destinations, journey/route context, municipality selection, language behavior, safe return URLs,
  and validation of query values.
- Follow the installed Next.js guidance for search parameters and Suspense. Do not force static output by dropping
  context or concealing an unintended dynamic dependency.

Acceptance:

- The production route report confirms the intended detail pages are prebuilt.
- Direct visits, refresh, client navigation, Back, and shared query links preserve context.
- Unknown slugs and invalid query values preserve existing behavior.
- Production Playwright checks cover English/Japanese pages, journey handoffs, and municipality deep links.

### H3 — Configuration preflight and release automation

Status: planned.

Implementation:

- Define feature-aware validation for the public site, accounts, administrative jobs, and email delivery.
- Reuse existing schemas/owners. Separate public settings from secrets; errors name settings without printing values.
- Preserve public-only local operation with optional features disabled.
- Validate production origins and feature dependencies before deployment. Document build-time versus runtime settings.
- Add CI for the intended production branch with the supported Node version and lockfile installation.
- Assemble release checks: type checking, lint, tests, architecture, editorial/localization checks, production build,
  and CMS exclusion. The exclusion scan runs after build; stop dev servers that share `.next`.
- CI must not send real email or mutate production data. Database tests use isolated/local environments.

Acceptance:

- Missing required settings fail early; disabled features do not require their secrets.
- CI blocks deployment on failed gates. Production output excludes CMS code and server secrets.
- Document commands, configuration, and hosted/manual checks that automation cannot prove.

### H4 — Security headers and health check

Status: planned. Coordinate with H3 and the deployment environment.

Implementation:

- Configure appropriate framing, content-type, referrer, and transport protections.
- Design CSP around actual scripts, images, authentication, pronunciation, and browser features; validate before
  enforcement. Do not copy a policy that breaks the app or claim universal protection.
- Enable transport-specific policies only where HTTPS behavior is established.
- Add a minimal liveness route without private data. Keep optional dependency readiness separate so a Supabase
  outage does not make the public knowledgebase unhealthy.
- Remove machine-specific development-origin configuration or make it an explicit local setting.

Acceptance:

- Check production headers and core browser features under the policy.
- Health responses are predictable, uncached as appropriate, and require neither authentication nor expensive queries.
- Document the health path and the difference between process health and dependency readiness.

### H5 — Narrow session handling safely

Status: planned. Verify alongside H2/H4.

Entry points: `src/proxy.ts`, `src/lib/supabase/proxy.ts`, authentication callbacks, account pages, and API routes.

Implementation:

- Inventory routes requiring server identity or refresh; narrow proxy work accordingly.
- Explicitly consider account, sign-in, callback, and private API behavior.
- Determine how signed-in readers browsing public pages retain working sessions. Do not exclude public pages
  without testing expiry, refresh, and subsequent account navigation.
- Preserve cookie propagation, authorization, and redirect validation. Do not replace validated identity with
  an unverified session value to reduce work.

Acceptance:

- Anonymous public browsing avoids unnecessary session work where the chosen design permits it.
- Test signed-in public browsing, expiry/refresh, account navigation, sign-out, and API authorization.
- Measure behavior under the actual signing-key configuration; do not assume each claims check makes a network call.

### Batch 1 review gate

Report H1–H5 separately with measured results, changed scope, automated checks, manual UI checks, and remaining
host setup. Run type checking, lint, relevant tests, architecture, affected editorial/localization checks, build,
and CMS exclusion. Run the full test suite for shared module changes. Stop for review before activating production
services or declaring the hosted gate complete.

## Batch 2 — Hosted features

### J1 — Notification worker

Status: planned. Suggested owner: Codex; reviewer: Claude. Depends on H3a's job configuration contract, which
Claude lands first so J1 can run alongside the rest of Batch 1 (see the concurrency plan).

Implementation:

- Add an injectable server-side runner and a command that runs once and exits.
- Inspect and orchestrate existing SQL event generation, delivery decisions, claims, provider sends, and finalization.
- Preserve database idempotency, leases, consent rules, and disabled-delivery behavior.
- Use narrow database/provider contracts for tests without live email or production data.
- Handle partial failures, bounded batches, retries/reclaim, exit status, and operational logs without exposing
  private message contents or secrets.
- Document scheduling, credentials, concurrency, frequency, and cost controls. A public job endpoint is not required
  when a scheduler can invoke the command.

Acceptance:

- Fixture tests cover opt-in/opt-out, duplicate runs, concurrent claims, expired claims, provider failure, and disabled
  delivery. Identify guarantees owned by SQL versus the runner.
- An isolated integration run proves the database/runner contract; mocks alone do not prove SQL concurrency.
- Real delivery stays disabled until the hosted gate explicitly authorizes an opt-in test.

### J2 — Scheduled source monitoring

Status: awaiting execution-location decision.

Choose a repository workflow or hosted worker before selecting persistence. A repository workflow fits current
review artifacts; compare scheduling, durable storage, credentials, concurrency, and cost.

Implementation after the decision:

- Separate check execution/reporting from checkout state/cache persistence in `scripts/check-sources.ts`.
- Keep the local adapter; add only the adapter required by the selected environment.
- Preserve accepted baselines, snapshots, interrupted-run progress, and human editorial review.
- Make overlapping runs safe and observations durable; do not rely on a deployment's writable filesystem.
- Produce artifacts/alerts without automatically approving, rewriting, or publishing canonical content.

Acceptance:

- Test injected stores, interruption, retries, and concurrent updates.
- Prove scheduled output is durable and usable by the existing review workflow.
- Document schedule and alert routing. Activating communications requires explicit authorization.

### Batch 2 review gate

Review orchestration, SQL assumptions, credentials, scheduling, privacy, recovery, and cost controls. Update
operational docs and ROADMAP.md. Code completion and hosted activation have separate statuses.

## Batch 3 — Native preparation

### N1 — Complete the portable content bundle

Status: planned. Coordinate translation selectors with Claude.

Implementation:

- Inventory native-required catalogs against the exporter. Cover English/Japanese municipality guidance/general
  advice, FAQ/glossary/status translations and structured guidance, discovery/journeys, annotated documents,
  activity cross-references, and geography as required by the native scope.
- Use existing revision rules; current translations are exported and missing/stale ones retain deliberate English
  fallback. Currency does not imply human approval; preserve review state and provenance.
- Define validated per-kind payloads with required sources, relationships, dates, and review metadata.
- Preserve deterministic checksums/versioning and document compatibility for format changes.
- Include N2's component payloads. Exclude private account state and secrets.

Acceptance:

- Catalog parity derives from canonical registrations rather than fixed counts.
- Test current/missing/stale translations, references, deterministic versions, and serializable payloads.
- Every component has a payload or shared data lookup; unsupported constructs fail clearly.
- Generation never changes canonical content or translation artifacts.

### N2 — Shared component content and inline formatting

Status: planned. Suggested split: Codex owns portable parsing/data contracts; Claude reviews Japanese rendering
and owns translation catalog edits. Each shared file has one active owner.

Implementation:

- Move substantive tax-residence rows, training-route rows, and geography practical-basics text from React into
  plain validated data, preserving wording, links, order, and localization.
- Web/native renderers use the same owners; map interaction remains platform-specific.
- Define a consistent supported inline grammar/parser for emphasis, bold, links, code, and supported nesting.
- Align export/render validation. Line-based conversion must not silently accept unsupported inline MDX.
- Keep display parsing separate from CMS byte-preserving serialization, locked blocks, and round-trip protections.

Acceptance:

- Real-article fixtures cover nested emphasis, links, escapes, code spans, quotes, lists, and components in
  English/Japanese rendering and export.
- Unsupported constructs fail or stay explicitly protected; content is never silently dropped or rewritten.
- Existing CMS round-trip/write tests pass if shared parsing or validation changes.

### N3 — Shared finder messages and labels

Status: planned. Depends on H1. Claude owns Japanese catalog edits.

- Move reusable labels/messages into established owners without importing full catalogs into browser code again.
- Preserve locale loading, key parity, accessible labels, and fallback.
- Test portable imports and rerun H1's production boundary check.

### N4 — Platform-independent account coordinator

Status: planned. Suggested owner: Codex; reviewer: Claude. Supports Phase 15; does not block hosting.

Implementation:

- Extract snapshots, queued requests, retries, cache ownership, account switching, and stale responses from the
  React sync provider into a coordinator with injected state/auth/sync contracts.
- Retain pure merge rules and the Supabase RPC adapter; keep React/browser lifecycle in web adapters.
- Define minimal account/session contracts with platform-specific redirect and session-storage bindings.
- Preserve storage keys/migrations and reuse the injected key-value interface. Add asynchronous capabilities only
  if required by the chosen native adapter.
- Native auth secrets use secure storage separate from content and preferences.

Acceptance:

- Coordinator tests need no React, browser globals, or live Supabase.
- Cover queued writes, retries, account changes during requests, stale results, sign-out, and cache ownership.
- Preserve web sync behavior and validate hosted cross-device behavior after extraction.

### N5 — Metadata independent of MDX rendering

Status: planned; lowest priority. Implement when native catalog integration benefits from the boundary.

- Separate plain metadata/selectors from the web MDX registry, both derived from canonical content.
- Do not introduce a second hand-maintained inventory.
- Preserve order, relationships, validation, static routes, and discovery results.
- Prove metadata consumers need no React/MDX imports; measure before claiming build savings.

### Batch 3 review gate

Run focused portable/catalog/parsing/coordinator tests and the full suite for shared changes. Run type checking,
lint, architecture, affected editorial/localization gates, build, and CMS exclusion. Review bundle compatibility
and translation fallback with Claude. Record remaining adapter work rather than presenting contracts as a finished app.

## Deferred work

- Introduce workspaces/packages when the Expo application exists, following ADR-025.
- Verify Japanese collation and time-zone formatting under Hermes in the first native spike.
- Choose the offline engine against Phase 16 requirements; the previous notes' SQLite recommendation is not a
  completed decision.
- Bundle delivery, anonymous downloads, checksum verification, atomic activation, and offline search are later
  delivery/client features. N1 defines their input.
- Implement native navigation, secure auth, lifecycle, push, sharing, and accessibility in native code.
- Defer account-export restructuring and extra API guard abstractions until those routes need them.

## Completion records

Update each checkpoint here and the relevant main-roadmap entry with:

1. Implementer/reviewer, actual scope, and deviations.
2. Commands/results, including failures and skipped checks with reasons.
3. Production measurements, environment, and measurement method where applicable.
4. Manual UI/hosted checks and operating decisions still pending.
5. Separate statuses for local implementation, review, staging validation, and production activation.

Compilation alone does not complete a batch. Stop at review gates; automated checks do not constitute human
editorial approval, and a documentation status change cannot authorize external activation.
