# Hosting and native readiness refactor roadmap

Status: implementation in progress, 2026-09-29. H3a, J1 preparation/hardening, CMS LF/stability fixes,
compile-cache cleanup, H1 (including marker fix `1d46b0d`), H2 `581ed1e`, and scope-limited J1 adapter
`9dee0a0` are reviewed/integrated. Combined source `4f41ec5` is validated. Claude approved prior
consolidated documentation through `b494ed0`; the `e374bbe` and subsequent consolidated records await
review. J1 database-authority, recipient, lease-budget and runnable-command checkpoints plus N4 extraction
are implemented on the working branch and await review/integration. N1 bundle integrity preparation is
implemented; expanded catalog coverage remains pending. J1/N1/N4 acceptance remains open;
H4, H5 and H3b have not started. Wider hosting acceptance and activation remain pending. This replaces
the completed structural-refactor working notes.

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
- Review a specific committed checkpoint while independent work continues. Dependent work waits for the reviewed
  handoff; ongoing work must not change the commit being reviewed.

### H3a handoff to J1

J1's configuration wiring depends on the reviewed H3a commit being integrated and brought into Codex's worktree.
A completion message or an interface description alone does not satisfy that dependency.

Claude's handoff records:

- The commit hash and changed configuration files.
- The public module interface, feature flags, and build-time versus runtime settings.
- How job-only settings are validated and which credentials J1 requires.
- Tests confirming that public-only builds do not require worker credentials or enable email delivery.

Codex can inspect SQL, design the runner, and prepare fixtures before that handoff. After review, integrate H3a
through the designated integration checkout and merge the integrated commit into Codex's branch before wiring
J1 to the configuration module. Commit independent work first; do not discard it to update the branch.

### Integration and combined verification

For the H3a/J1 preparation gate and shared-file fixes on 2026-09-28, Codex owns
`codex/hosting-native-integration` and the consolidated updates to this document and ROADMAP.md. Claude owns
the separate CMS line-ending/test-diagnostic and compile-cache fixes, reviewed by Codex before integration.
Integrate exact reviewed commit hashes. The CMS stability patch was cherry-picked independently;
reviewed H1/H2 and the scope-limited J1 adapter were subsequently integrated by exact hash as recorded below.

Separate worktrees isolate files and build output; they do not prove that the branches work together. At each
integration gate:

1. Record the exact checkpoint commit and obtain the other agent's review.
2. Integrate only reviewed changes into the integration branch. Merging a worker branch requires every commit
   included by that merge to be ready; otherwise use an agreed checkpoint-specific integration method.
3. Run the applicable full checkpoint/batch gates against the combined result. Record its commit and results.
4. Bring the validated integration result into both working branches before dependent work or file handoffs.

Do not mark integration validated from branch-local checks alone. In particular, verify H5 session handling and
N4 account orchestration together, including refresh, account switching, sign-out, and subsequent navigation.
Resolve conflicts with the affected file owner and rerun affected checks after resolution.

### Stages

| Stage | Claude | Codex | Why these can overlap |
| --- | --- | --- | --- |
| A | H3a (below), then H1 → H2 | J1 preparation, then configuration wiring after the H3a handoff; N4 | J1 depends on reviewed/integrated H3a. N4 can overlap, subject to the account/session ownership rule below. |
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

Supporting files follow these rules:

| File or area | Owner and coordination rule |
| --- | --- |
| Checkpoint-specific tests and fixtures | The checkpoint implementer; shared tests require an agreed handoff before editing. |
| `scripts/check-architecture.ts` | Codex for N2/N4 portability checks; coordinate any release-related edits requested by Claude. |
| `docs/refactor.md`, `docs/ROADMAP.md`, shared operational documentation | One designated integration owner per gate applies consolidated status updates; each implementer supplies its checkpoint record. Agree ownership before parallel edits. |
| `package.json` dependency sections and `package-lock.json` | One agreed dependency owner at a time updates both together. The concurrent exception above covers script additions only. |

H5 may require account/session component changes even though N4 owns account orchestration. Claude requests
those changes from Codex or obtains an explicit file handoff; neither agent assumes these areas are independent.
The same coordination applies when a shared test or configuration contract changes.

A checkpoint that needs a file owned by the other agent in that stage waits, or asks for a small change through
the review channel. Neither agent edits the other's files.

### Partial N1/N2 delivery and final acceptance

Stage B is an intermediate review point:

- N1: catalog coverage implemented; component payloads pending.
- N2: parser/data contracts implemented; renderer integration pending.

Record those partial statuses and their reviewed commits. Do not mark either checkpoint complete or imply that
the bundle is fully usable because the Stage B tests pass. Final N1/N2 acceptance follows Stage C's renderer
wiring, component data, and bundle payload integration, with the complete checkpoint checks run on the combined
result. Any Japanese catalog changes needed for that result must also be integrated and reviewed.

## Batch 1 — Hosting readiness

### H1 — Keep full catalogs out of browser imports

Status: implemented by Claude at `119b872`, fixed by `efc2837` (async inventory) and `1d46b0d`
(marker extraction), reviewed/approved by Codex and combined-validated. See
[the exact-commit review](checkpoints/H1-review.md). The original marker-rule coverage limit is documented.

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

Status: implemented by Claude at `581ed1e`, reviewed/approved by Codex and integrated after H1's correction.
Combined validation at `4f41ec5` passed; see [the review record](checkpoints/H2-CMS-review.md).
Hosted CDN behavior and the full existing browser suite remain acceptance limits.
Coordinate with H1 and inventory existing query behavior first.

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

Status: H3a implemented by Claude and reviewed by Codex (`9d3442b` + `86218cc`). H3b remains planned.
H3a code is integrated and validated with J1 preparation and the CMS LF fix at `669fa99`.
The validated handoff `6eb2fa6` is in both working branches; H3b and hosted checks remain pending.

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

Status: preparation and runner hardening implemented by Codex and reviewed by Claude (`6624e27`, `7c272d2`);
J1 remains incomplete. The hardening is integrated by exact hash; see [its record](checkpoints/J1-runner-hardening.md).
The injectable runner, fixtures and scope-limited adapter are integrated into the integration branch. New command
and configuration wiring are implemented only on the working branch; review/integration, isolated SQL integration
tests and final acceptance remain pending. Configuration wiring is unblocked by the validated H3a handoff
`6eb2fa6` in both working branches (see the handoff and integration rules).
Adapter mapping/transport at `9dee0a0` was approved by Claude for that scope and integrated at `4f41ec5`;
that reviewed adapter alone has no command consumer and does not resolve finalization clock authority. See
[the mapping review and acceptance notes](checkpoints/J1-store-mapping.md#claude-review-and-acceptance-notes--2026-09-28).
Codex's subsequent [database-authority checkpoint](checkpoints/J1-database-authority.md), dated 2026-09-29,
implements store-provided database time, a service-only finalizer and aggregate exhausted-claim inspection
on the working branch. The recipient (`904856e`), lease-budget (`4b4bb37`) and command (`7fdea85`)
checkpoints follow it there. All four await review/integration and real PostgreSQL 17 acceptance.

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

Status: existing-file integrity preparation implemented, review/integration pending; expanded catalog
coverage planned. See [the bounded checkpoint](checkpoints/N1-bundle-integrity.md).
Coordinate translation selectors with Claude.

Stage B delivers catalog coverage only; Stage C adds component payloads. Record partial delivery separately
and complete final acceptance after integrating Stage C.

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

Stage B delivers parser/data contracts only; Stage C wires renderers and component content. Final acceptance
requires the integrated rendering and export paths, not just the standalone parser tests.

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

Status: Stage-A portable coordinator extraction and web binding implemented by Codex, review/integration
pending. See [the checkpoint and H5 session handoff](checkpoints/N4-account-coordinator.md).
Hosted cross-device and combined H5 acceptance remain open. Supports Phase 15; does not block hosting.

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

### H3a / J1 preparation gate — 2026-09-28

- Reviewed inputs: Claude's H3a `9d3442b99fd4193b244cfca21d465deda8365d4d` and follow-up
  `86218cc127fd753b34738ef47e57682c706fc496`; Codex's J1 preparation
  `6624e2714b6b378bae036e1f60956795a16930a4`. Codex approved H3a after rereview; Claude approved J1
  for preparation scope only. Exact reviewed inputs were merged into `codex/hosting-native-integration`
  without conflicts; no unreviewed H1 changes were included.
- H3a scope: explicit-environment configuration readers, feature-aware preflight, job-only deployment scope,
  exact flags, normalized credential-free origins, shared email/admin readers, and validated site URL metadata.
  The three initial review findings are resolved. CI and the release command remain H3b.
- J1 scope: injected store/provider/clock, bounded single-message claims, existing consent/relevance rules,
  token-bound finalization, retry backoff, disabled-delivery preservation, and sanitized aggregate reports.
  See [the preparation record](checkpoints/J1-preparation.md). No live database adapter or command exists yet.
- Branch-local verification, not combined validation: H3a rereview passed 36 focused tests across four files,
  targeted lint, TypeScript, architecture (678 modules), job/public preflight fixtures, a public-only Turbopack
  build (415 pages), and CMS exclusion. A fixture credentialed-origin build failed as intended without echoing
  the value. J1 preparation passed 30 focused tests, TypeScript, targeted lint, and architecture.
- Before the LF fix, H3a's full suite had 537 passes and two failures out of 539 tests. The same two failures reproduced at
  pre-H3a base `4bc3df9`: `tools/cms/record-creator.test.ts:77` and `tools/cms/recovery-http.test.ts:123`.
  Claude diagnosed CRLF working-copy fixtures: the first assertion requires LF; the second tries to replace
  an LF body within CRLF source, produces no edit, and then fails its Git commit. The hidden stderr obscured
  that cause. No CMS source changes are part of the H3a inputs.
- Fix owner: Claude. Codex reviewed and approved the exact two-file commit
  `63dd167ca74bbd8c55b3e7d09faf092284cab726`: `.gitattributes` with `* text=auto eol=lf` and recovery-test
  fixture Git stderr/stdout reporting with preserved error cause. No stored content was renormalized, no
  translation artifacts were regenerated, and no H1 work was included. It was integrated after `cbc38bb`.
  A fresh detached checkout supplied LF for validation, with zero tracked CRLF/mixed files; existing dirty
  worktrees were not refreshed. CRLF CMS byte preservation remains a separate follow-up, not proven by LF policy.
- **Validated combined source commit:** `669fa99622bf916ed5b1423cdb28fb4ee538f75d` on
  `codex/hosting-native-integration`. All three reviewed inputs are ancestors. The subsequent completion-record
  commit changes only this document and ROADMAP.md; the tested source tree is unchanged. Claude's consolidated
  documentation at `6eb2fa6639db60682c1159c0e23db716bf28f345` was approved by Claude on 2026-09-28,
  separately from the passed combined code checks.
- Combined environment: fresh LF Windows checkout, Node 24.21.0, Next.js 16.3.4, copied existing dependencies
  (not a clean installation). A local wrapper removed Supabase/email/AWS and other `NEXT_PUBLIC_*` settings,
  supplied only a fixture HTTPS site origin, and disabled telemetry. Job preflight used dummy credentials;
  no database, provider send, or hosted service was invoked.
- Combined commands/results: full `vitest run` **559 tests across 149 files passed**, including both formerly
  failing CMS tests and J1's 20 worker fixtures; `eslint .`, `tsc --noEmit`, and architecture passed (679 modules).
  Editorial audit passed for 479 records and zero approval records. Article/glossary mechanical localization
  checks each checked 97 current articles with zero findings; reports were written only under ignored
  `.glossary-drafts/`. Public and job-only production preflight fixtures passed. Normal Turbopack `next build`
  passed (415 generated pages), followed by CMS exclusion. Tracked-tree and whitespace checks passed.
- Skipped checks: live/isolated SQL tests await J1's real adapter; hosted, manual authentication/email,
  and browser flow gates await their relevant checkpoints. Municipality evidence verification was not rerun
  because no supplement/source/research content changed. H3b CI/clean-install/release automation and the
  wider H1–H5 acceptance gate remain pending; this integration does not establish deployment readiness.
- J1 final-acceptance findings carried forward: database-authoritative lease time and clock-skew tests;
  inspection of exhausted failures and expired processing claims at attempt five; standalone command loading
  of `server-only`; relevant critical-send and withdrawn reminder-topic tests; real PostgreSQL concurrency,
  timestamp mapping, bounded I/O, and alerting/error-count behavior. SES/finalization ambiguity and critical
  release recipient fan-out remain documented operating limits.
- Statuses: local H3a, J1 preparation, and CMS LF fix implemented/reviewed; combined code integration validated;
  consolidated documentation at `6eb2fa6` approved by Claude. That exact handoff is in Codex's working branch
  and was merged by Claude as `8e8a9c7` without overlapping Claude's uncommitted H1 changes. Claude reported an LF
  checkout, 59 focused tests across seven files, and TypeScript passing after the merge. J1 final implementation
  and staging/manual hosted checks remain pending; production activation none. No merge into main is authorized
  by this gate.

### Compile-cache cleanup integration — 2026-09-28

- Claude implemented and Codex reviewed/approved exact commit
  `07ab2720928671300aa414c3529cbdc313b5aaf1`, whose parent is the already approved LF fix `63dd167`.
  The diff deletes 398 tracked binary files under `.tmp/node-compile-cache/` and adds `/.tmp/` with a comment
  to `.gitignore`; there are no application, interface, dependency, or translation changes. Repository code
  searches found no dependency on this root cache. Cache files are regenerable; integration can remove
  previously tracked copies in the receiving checkout.
- **Validated combined source commit:** `5241670614de0b966d0abe7111d2a13fe3a78202` on
  `codex/hosting-native-integration`, merging only the reviewed hash after `6eb2fa6`, without conflicts.
  No later Claude branch commits or uncommitted H1 changes are included. The subsequent record changes
  only this document and ROADMAP.md. Claude approved that documentation delta at `85935ac` and merged the
  exact handoff into Claude's working branch as `f9dee65`, without conflicts.
- Environment: isolated LF Windows validation checkout, Node 24.21.0, Next.js 16.3.4, copied existing
  dependencies rather than a clean installation. The existing fixture-only wrapper removed Supabase/email/AWS
  settings and other public settings, supplied a dummy HTTPS site origin for the build, and disabled telemetry.
  Job preflight used dummy credentials. No hosted service, database, or provider send was invoked.
- Commands/results: `git show`, `git diff-tree`, dependency searches, and `git diff --check` passed review;
  `git ls-files .tmp` returns no files and `git check-ignore .tmp/cache-probe` confirms the ignore rule.
  There are zero tracked CRLF/mixed files in validation. Full `vitest run` passed **559 tests in 149 files**.
  The first full run alongside static checks had 558 passes and a five-second timeout in the CMS source scan;
  the full suite rerun alone passed with unchanged code and timeout settings. `eslint .`, `tsc --noEmit`,
  architecture (679 modules), editorial audit (479 records, zero approval records), article/glossary checks
  (97 current articles each, zero findings), and public/job production preflights passed. Normal Turbopack
  `next build` generated 415 pages; the subsequent CMS exclusion scan passed. The tracked checkout is clean.
- Skipped checks and operating limits from the prior gate still apply: no content changes require municipality
  evidence regeneration; real SQL, clean-install CI, browser/hosted flows, and J1 final acceptance remain pending.
  Both shared-file fixes are reviewed and combined code validation is complete; Claude approved the
  documentation at `85935ac`. Production activation none; no main merge.

### J1 hardening integration and H1 review — 2026-09-28

- Claude approved Codex's exact J1 follow-up `7c272d2c8efa8b57893e47fce70b6c7a7014c849` against `85935ac`,
  including [its checkpoint record](checkpoints/J1-runner-hardening.md). The integration branch fast-forwarded
  to that exact tested source commit, with no conflict or source changes. The subsequent consolidated record
  changes only documentation. Claude approved that record at `861ee5f` and merged the exact handoff as
  `397eb87` without overlapping uncommitted H2 files.
- J1 checks at that exact source: 38 focused tests, full suite with four workers (567 tests / 149 files),
  targeted lint, TypeScript, architecture (679 modules), and whitespace checks passed. The earlier default-worker
  CMS HTTP timeout and unchanged-timeout rerun are recorded. The runner still has no application consumer;
  production build/CMS exclusion are inherited from the base gate, not rerun for the runner-only follow-up.
  Database clock authority, exhausted/expired fifth claims, adapter/command/config wiring, real SQL acceptance,
  and operator documentation remain pending. Clock failure at attempt five is included in the inspection work.
- Claude reviewed the fixtures independently: 61 notification tests across nine files, TypeScript, and targeted
  lint passed. Review approval does not establish real SQL concurrency or authorize delivery.
- H1 exact commit `119b872c9004114784cd98516301ca6d2a60f306` was reviewed in an isolated LF checkout.
  Its full 563-test/150-file suite, lint, TypeScript, architecture (682 modules), public-only 415-page build,
  CMS exclusion, and article localization checks passed. Current emitted JS is free of guidance/source catalogs.
  Codex requests one P2 checker fix: the gate scans only entry chunks and accepts catalog markers injected into
  an async browser chunk. [The review record](checkpoints/H1-review.md) contains the proof, requested regression
  fixture, reproduced route sizes, interface handoff, and checks not independently repeated. H1 is not integrated;
  Claude's ongoing H2 work is excluded.
- Statuses: J1 hardening reviewed/integrated; documentation at `861ee5f` approved by Claude. H1 changes requested;
  full J1, H2 and later batch gates pending. Hosted activation none; no main merge.

### H1 checker rereview and J1 adapter preparation — 2026-09-28

- Codex rereviewed Claude's exact `efc2837fc202c015e973572e26bacb7dbb81c228` (parent `397eb87`, H1 ancestor
  `119b872`) in the isolated LF checkout; H2 is excluded. The all-emitted-JS inventory resolves the original
  async gap and its seven fixtures pass. A new P2 extraction error at `client-bundle-boundary.ts:32` excludes
  ordinary `n` rather than newline, reducing canonical guidance markers from 640 to 113. A formerly detectable
  Sapporo summary now produces no violation. [The rereview record](checkpoints/H1-review.md#rereview-of-efc2837--2026-09-28)
  records the proof and requested character/coverage tests. H1 remains unapproved/unintegrated; broader gates
  are deferred until the marker regression is corrected.
- Codex's bounded J1 store mapping/transport checkpoint is
  `9dee0a04c3cfca71328c38e91e730e44502e482d` on `codex/hosting-native-refactor`, based on `861ee5f`.
  It accepts H3a job settings; maps existing RPCs/UTC timestamps; reads current owner-filtered consent,
  Auth recipient and targeted saved/journey relevance; maps token finalization; and bounds native fetch through
  response-body consumption with no automatic SDK retries. Review/integration are pending. Its record
  `docs/checkpoints/J1-store-mapping.md` belongs to that pending checkpoint, not this integration tree.
- Adapter branch checks: 48 focused tests, full suite with four workers (587 tests / 151 files), targeted
  lint, TypeScript, architecture (681 modules), and whitespace checks passed. No live database or provider
  was invoked; one fixture uses a temporary loopback HTTP server to prove body-timeout cancellation.
  The Docker client is installed but its daemon was unavailable; no stack was started or reset.
- Next J1 work: database-authoritative clock/finalization and exhausted/expired fifth-claim inspection,
  standalone command loading, provider/whole-lease I/O budgets, isolated SQL acceptance, and operating docs.
  A fixture-tested transport does not prove SQL concurrency or complete J1. Claude owns the acknowledged
  separate CMS test-stability follow-up after H2. Production activation none; no main merge.
- Integration source remains the reviewed `7c272d2`; this new consolidation changes only documentation
  and awaits Claude's review. Pending adapter code and all H1/H2 code are excluded from integration.

### H2 review and independent CMS stability integration — 2026-09-28

- Codex reviewed Claude's exact H2 `581ed1e31d9777992e8d4969a9e01ac73980c918` and CMS stability
  `68aa4e8e259c22824ddb405792d3b67a5df59c09` in an isolated LF checkout of the latter. H4 and later
  uncommitted work were excluded. [The review record](checkpoints/H2-CMS-review.md) gives interfaces,
  commands, negative controls, environment and limits.
- H2 scope is approved: all three detail families prebuild with validated client query context and
  queryless Suspense fallbacks. Independent review checks passed 585 tests / 152 files with four workers,
  lint, TypeScript, architecture (689 modules), editorial and article checks, public-only 415-page build,
  CMS exclusion, and all seven new production browser tests. A separate browser probe confirmed saved
  Nagoya survives a Shinjuku deep link. The first default-worker run alongside the build ended in a
  worker-pool error; it was not a pass. The reported baseline HTML deltas and 14 stale browser failures
  were not independently repeated. Claude owns their separate bounded test repair, preserving assertions.
- H1 remains changes-requested: the marker probe still misses the real Sapporo summary (640 old versus
  113 new markers). H2 approval does not approve that ancestor. H1/H2 integration and the combined hosting
  gate await the correction; hosted CDN behavior and the full existing browser suite remain unvalidated.
- CMS stability is approved: read-only Git calls suppress optional index locks; seven fixture-heavy suites
  use the existing 30-second timeout pattern. The new index-refresh assertion fails without the fix,
  independently reproduced with byte-for-byte restoration of the isolated checkout.
- **Validated combined source commit:** `2a35d9aa7352834f9219243837324d9d9ab7f856` on
  `codex/hosting-native-integration`, cherry-picking only `68aa4e8` after `b494ed0`. H1/H2 and pending
  adapter `9dee0a0` are excluded. Combined gates in the isolated LF Windows checkout passed full Vitest
  alone at default concurrency (**568 tests / 149 files**), lint, TypeScript, architecture (**679 modules**),
  public-only production build (**415 pages**), CMS exclusion and whitespace checks. Dependencies were
  copied, not clean-installed; no database or provider was invoked.
- The subsequent completion record changes documentation only and awaits Claude's review. Earlier
  documentation at `b494ed0` and the adapter review remain pending. Artificial CPU-saturation stalls
  reported by Claude are an unresolved follow-up, not fixed by this gate. No hosted activation or main merge.

### H1, H2 and J1 adapter integration — 2026-09-28

- Codex approved exact H1 marker correction `1d46b0d14e3ee75f68e5a435ae70209047373ab5` against
  `efc2837`. All ten fixtures pass; an independent probe matches the original rule across all 784 summaries,
  restores 640 markers and rejects the canonical Sapporo summary. The original 144-summary coverage limit
  remains explicit. [The H1 rereview](checkpoints/H1-review.md#rereview-of-1d46b0d-and-integration--2026-09-28)
  closes both P2 findings without changing Claude's worktree.
- H1 merged by exact hash as `53baa860334b03c5d4fc5760967821c8d0cdfcda`. Its combined gate passed
  582 tests / 151 files with four workers, lint, TypeScript, architecture (683 modules), public-only build
  (415 pages), CMS exclusion and repaired bundle checks. Emitted-artifact injections of async/entry guidance,
  async source catalogs and entry map geometry all fail as intended; restored bytes pass again.
- Previously approved H2 `581ed1e31d9777992e8d4969a9e01ac73980c918` then merged as `d0f9028`.
  CMS stability `68aa4e8` was already independently integrated as `2a35d9a`; it is not awaiting review.
  Claude approved J1 adapter `9dee0a04c3cfca71328c38e91e730e44502e482d` against `861ee5f` for
  mapping/transport scope, independently checking 56 notification tests / six files, types and targeted lint.
- **Validated combined source commit:** `4f41ec57e092ba78deb6b153e418ec0efe760295` on
  `codex/hosting-native-integration`, adding the exact reviewed adapter after H2, conflict-free. No later
  Claude branch head was merged. The subsequent completion record changes documentation only.
- Final gates: full `vitest run --maxWorkers=4` **608 tests / 154 files passed**; `eslint .`, `tsc --noEmit`,
  architecture (**691 modules**), editorial audit (**479 records, zero approval records**), article/glossary
  checks (**97 current articles each, zero findings**), public/job fixture preflights, public-only `next build`
  (**415 pages**, all three detail families SSG), CMS exclusion and whitespace checks passed. All seven H2
  Playwright tests passed against an isolated production server. Bundle checking on 42 emitted scripts and
  all four artifact-injection negative controls passed; original artifact bytes were restored.
- Environment: isolated detached LF Windows checkout, Node 24.21.0, Next.js 16.3.4, copied dependencies
  rather than a clean install. The build wrapper removes hosted/email/AWS settings, uses only a fixture
  HTTPS site URL, and disables telemetry. Job preflight uses dummy settings and performs no service call.
  No SQL stack, provider send, schedule or hosted service was activated.
- J1 acceptance remains open: database-authoritative clock/lease checks and finalization must replace the
  mixed-clock intermediate state before a runnable command ships; exhausted failures and expired fifth claims
  need inspection; missing/invalid recipient suppression and `email_confirmed_at` policy need a contract;
  critical-event target mapping should be exhaustive. Standalone loading, bounded complete-lease/provider I/O,
  real isolated SQL concurrency/RLS acceptance and operator documentation remain pending.
- Claude approved `b494ed0` and merged its exact documentation handoff as `88b4d3e` (no adapter ancestor).
  `e374bbe` and the new consolidated documentation await review after Claude's availability reset. Claude's
  five-day absence plan leaves H4/H5/H3b, translations, configuration/Supabase modules, rendering/finder/map
  files and stale shared Playwright tests with Claude; no temporary ownership handoff is assumed. Codex can
  continue J1 and Stage-A N4, holding new implementation checkpoints for Claude's review. J2 still needs an
  execution-location decision. Stale browser tests, artificial CMS stress stalls, clean-install/hosted checks
  and wider hosting gates remain open. Production activation none; no main merge.

### J1 database-authority preparation — 2026-09-29

- Claude reports merging exact `e4fc1ff` into `claude/hosting-readiness` as `93e44b4`, conflict-free and
  pushed. Both working branches now carry the validated handoff. Claude confirmed the five-file documentation-only
  delta after `4f41ec5`; line-by-line documentation review since `b494ed0` remains deferred until reset.
- Codex's next bounded working-branch checkpoint adds a new service-only clock/finalizer/inspection migration,
  its RPC type entries and pgTAP fixtures, and updates only owned notification runner/adapter files and tests.
  The runner requires asynchronous store time, adds conservative monotonic transport age, preserves clock
  latching, and reports aggregate exhausted failures/expired fifth claims with exit 1. The database finalizer
  reads current time after locking/rechecking the token and computes failure backoff from the locked attempt.
  [The checkpoint record](checkpoints/J1-database-authority.md) supplies the exact contract, commands and limits.
- Working-branch checks: 61 focused tests / three files, full **621 tests / 154 files** with four workers,
  TypeScript, targeted lint, architecture (691 modules), and whitespace passed. Temporary in-memory PGlite
  0.5.8 / PostgreSQL 18.3 applied the real migrations and passed 26 SQL assertions with fixture Auth roles;
  repository dependencies are unchanged. This is a single-connection smoke, not Supabase/PostgreSQL 17
  concurrency acceptance. The new 24-assertion pgTAP fixture was not run; Docker's Linux engine remains
  unavailable. No daemon/stack was started or reset. Build/browser/editorial gates were not repeated for
  the still-unconsumed adapter; the reviewed integration's results remain separate.
- Review and integration wait for Claude; integration branch remains at `e4fc1ff`. Real concurrency/lock-wait
  and SQL/RLS acceptance, recipient suppression/confirmation policy, exhaustive event mapping, standalone
  command/config wiring, provider/whole-lease budgets and operating docs remain pending. No main merge,
  translation edit, hosted service, recurring schedule or real email.

### J1 recipient-policy preparation — 2026-09-29

- The database-authority working checkpoint is pushed as `6aa8f1c`, awaiting Claude's review. The next
  [bounded checkpoint](checkpoints/J1-recipient-policy.md) replaces the context's address string with a strict
  eligible/suppressed union. Delivery requires a valid current Auth email and `email_confirmed_at`; general
  or phone confirmation, pending addresses and event payload addresses cannot substitute. Missing, invalid
  or unconfirmed email is terminally suppressed with the original claim token; later confirmation does not
  revive old suppressed deliveries. Auth lookup/ownership failures remain retryable context failures.
- Suppression still validates event identity, preferences and lease time. Ineligible critical recipients skip
  relevance reads; eligible event targets use an exhaustive switch. No command or app consumer is added.
- Checks passed: **84 focused tests / four files**, full **644 tests / 155 files** with four workers,
  TypeScript, targeted lint, architecture (**692 modules**) and whitespace. Existing dependencies and fixture
  Auth/provider/database responses were used; no new SQL/build/browser/editorial checks are claimed.
- Both new J1 checkpoints and consolidated documentation await Claude after reset. Integration remains
  `e4fc1ff`; provider/whole-lease budgets, standalone command/config wiring, real SQL concurrency/lock-wait
  and pgTAP acceptance, and operator docs remain open. No main merge, hosted activation or real email.

### J1 provider and claim-lease budget preparation — 2026-09-29

- After recipient-policy `904856e` (pushed, review pending), Codex added a separate
  [I/O budget checkpoint](checkpoints/J1-lease-io-budget.md). Store and provider operations gain bounded
  cancellable deadlines. A monotonic claim budget starts before claiming, shortens to database expiry,
  and reserves time for send and finalization. A lease too short for configured worst-case I/O fails
  before database work; near-expiry claims remain for recovery without a new send/finalizer call.
- The configured SES adapter takes explicit email config, makes one SDK attempt with a bounded request,
  propagates abort, and exposes resource disposal to the future command. A provider timeout can mean
  uncertain acceptance and a duplicate on recovery; the database remains final expiry authority.
- Checks: **86 focused tests / six files**, full **656 tests / 157 files** with four workers, TypeScript,
  targeted lint, architecture (**693 modules**) and whitespace passed. All remote operations were fixtures.
  SQL/build/browser/editorial gates were not repeated. No command/activation was added.
- `6aa8f1c`, `904856e`, this checkpoint and consolidated docs await Claude's review after reset. Integration
  remains `e4fc1ff`; command/config wiring, real PostgreSQL 17 concurrency/pgTAP and operator docs remain.

### J1 standalone command preparation — 2026-09-29

- Following pushed lease-budget checkpoint `4b4bb37` (review pending), Codex added the
  [one-pass command checkpoint](checkpoints/J1-command.md) and
  [operating record](NOTIFICATION-WORKER-OPERATIONS.md). The command validates H3a production job settings
  before constructing clients, aligns runner/SES deadlines, supports enabled/disabled email correctly,
  disposes resources and emits only aggregate JSON/exit status. A scoped Node hook handles `server-only`
  outside Next.js. Exactly one `package.json` script line is added; scripts are not reordered.
- Fixture command tests (4), full **660 tests / 158 files**, TypeScript, targeted lint, architecture
  (**694 modules**), whitespace and `npm run notification:once -- --help` passed. No real database,
  provider send, hosted service or schedule was invoked. SQL/build/browser/editorial gates were not repeated.
- This and the three prior J1 working checkpoints plus consolidated documentation await Claude. Integration
  remains `e4fc1ff`. Real isolated PostgreSQL 17 SQL concurrency/lock-wait/pgTAP and combined acceptance
  remain before any hosted activation or main merge.

### N4 Stage-A coordinator preparation — 2026-09-29

- Codex extracted a portable serial coordinator with injected snapshots/storage ownership, sync transport
  and status publication, then wired the web provider to it. Queued edits, retry, account revision checks,
  sign-out and disposal move outside React. Existing storage keys, merge rules and RPC payloads remain.
  [The record](checkpoints/N4-account-coordinator.md) specifies contracts and the H5 session handoff.
- Added coverage for stale initial identity, stale errors after sign-out, cleanup, unchanged token refresh
  and A -> B -> A transitions. Focused **20 tests / three files**, full **675 tests / 159 files**, types,
  targeted lint, architecture (**696 modules**) and whitespace passed. Public-only build generated **415
  pages**; CMS exclusion and browser bundle checks (**42 scripts**) passed. Existing dependencies were used.
- This working checkpoint awaits Claude, with no branch-head integration across the pending J1 ancestors.
  Integration remains `e4fc1ff`. Hosted cross-device and combined H5 session/refresh/transport binding remain
  unvalidated. No Claude-owned configuration/session/rendering/translation file or hosted service was changed.

### N1 Stage-B bundle integrity preparation — 2026-09-29

- After pending N4 checkpoint `9061031`, Codex added [existing-file integrity validation](checkpoints/N1-bundle-integrity.md).
  Eight explicit format-1 contracts reuse domain schemas. The exporter validates payloads and the complete
  bundle; a portable verifier accepts only complete supported files with valid records, unique IDs/paths,
  correct UTF-8 checksums, record counts and catalog version. Canonical JSON and version inputs remain.
- Focused **21 tests / two files**, full **693 tests / 160 files** with four workers, TypeScript, full lint,
  architecture (**697 modules**) and whitespace passed. Existing dependencies were used; build/browser,
  SQL, translation audit and native installation were not repeated.
- This is preparation only: expanded catalog/translation coverage, cross-catalog references and Stage-C
  component payloads remain pending. Review/integration awaits Claude; integration remains `e4fc1ff`.
  No translation artifacts, renderers, configuration, main or hosted activation changed.
