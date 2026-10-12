# Nihonest

**Find your place in Japan.**

Nihonest is a mobile-first public knowledgebase and personal journey companion for people preparing to move to Japan or already living there. It connects practical guidance with official sources, explains Japanese administrative terminology, and helps readers organize the guidance relevant to their situation.

Public content is available without registration. Personalization starts locally in the browser; optional accounts add synchronization. Nihonest helps readers navigate official information and does not replace Japanese authorities or qualified professionals.

## Current implementation

The repository includes:

- Validated MDX articles, residence-status records, FAQs, a Japanese administrative glossary, and structured official sources with review and link-check context.
- Explore search and filters, purpose-based article groups, route-aware journeys, and contextual previous/next navigation. Residence Statuses, Explore, FAQs, group pages, and the glossary offer card/list views remembered separately per page.
- Prefecture and municipality discovery, location-specific guidance supplements, annotated official documents, and structured tables and fee information.
- Anonymous onboarding, saved guidance, progress, and reminders stored locally, with optional Supabase passwordless accounts, account-bound synchronization, explicit local-state import, data export, and account deletion.
- English and Japanese interfaces and content, revision-checked translation artifacts, whole-unit English fallback when translations are missing or stale, reading preferences, and browser speech synthesis for glossary pronunciation. Machine-translated Japanese remains labeled as such; it is not qualified human review. The public site does not translate content at request time.
- A local editorial CMS that edits canonical repository files, tracks reviews and recovery, and refreshes generated article metadata after article saves.
- Prebuilt public routes, metadata and sitemap generation, security headers, a process-liveness endpoint, automated release checks, and a versioned portable content bundle for future native consumers.

These features are implemented in code; that does not establish hosted deployment or acceptance. Hosted account/cross-device checks, notification operations and scheduling, native rendering/Hermes acceptance, and qualified human Japanese review remain separate gates. See the [roadmap](docs/ROADMAP.md) and [refactor status](docs/refactor.md) for detailed evidence and remaining work. Content review and source currency are tracked per record rather than inferred from a successful build.

## Stack

- Node.js 24 LTS, npm, and TypeScript.
- Next.js 16 App Router, React 19, and Tailwind CSS 4.
- MDX for article bodies; structured TypeScript data and Zod schemas for reusable content and domain contracts.
- Supabase Auth/PostgreSQL for optional accounts and synchronization; Amazon SES behind the optional email provider boundary.
- Vitest, React Testing Library, and Playwright for automated checks.

Exact dependency versions are in [package.json](package.json) and the lockfile. Native iOS/Android applications using React Native and Expo remain planned; portable domain code and content export are preparation, not a completed native app.

## Run the public site locally

Use Node 24 (also specified in [.nvmrc](.nvmrc)), then run from the repository root:

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. Public-only development needs no Supabase project, Docker, email credentials, or environment file. Leave Supabase settings unset to keep accounts disabled; a partially configured account environment fails validation.

For a local production build:

```bash
npm run build
npm run start
```

Stop the development server before running a production build in the same checkout. An unset `NEXT_PUBLIC_SITE_URL` keeps the generated robots policy non-indexable. Setting that origin changes canonical metadata and enables the public robots policy; use the [deployment configuration guide](docs/DEPLOYMENT-CONFIGURATION.md) for staging and production settings.

## Optional local accounts

Account development uses the Supabase CLI included in the project and Docker Desktop, without requiring a hosted project.

1. Start Docker Desktop, then run `npm run supabase:start`.
2. Run `npm run supabase:status`.
3. Use [.env.example](.env.example) as the template for `.env.local`. Fill both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from the local stack, plus `SUPABASE_SECRET_KEY` or the legacy `SUPABASE_SERVICE_ROLE_KEY` for administrative account operations. Keep `EMAIL_DELIVERY_ENABLED=false`.
4. Run `npm run config:check -- --env-file .env.local --target local`, then start or restart `npm run dev`.
5. Open `/account`. Local passwordless sign-in emails appear in Mailpit at `http://127.0.0.1:54324`.

Use one web hostname throughout sign-in: cookies are host-scoped, so switching between `localhost` and `127.0.0.1` changes the session context. Google and Apple controls stay hidden until deliberately configured.

`npm run supabase:lint` and `npm run supabase:test` check the local database. `npm run supabase:reset` resets the local database and reapplies migrations; it discards local database data. Stop the project containers with `npm run supabase:stop`.

`NEXT_PUBLIC_*` settings are public and embedded in browser builds. Server secret/service-role keys and AWS credentials must remain server/job-only. See [deployment configuration](docs/DEPLOYMENT-CONFIGURATION.md) for the complete settings contract and hosted account acceptance requirements.

## Content and editorial tools

Start the local editing workspace with:

```bash
npm run cms
```

Open **`http://127.0.0.1:4177`**, using that exact hostname. The CMS binds only to loopback, is separate from Next.js, and is excluded from production builds. It writes repository files but does not commit, publish, or edit Japanese translation artifacts. It refuses writes to files that were already dirty when the CMS started. Read the [CMS guide](tools/cms/README.md) before editing.

Article metadata is generated from canonical MDX and registry entries, preserving registry order. After changing article metadata or registrations outside the CMS, regenerate and commit the generated module:

```bash
npm run content:metadata
npm run content:metadata:check
```

Production builds refuse stale metadata. CMS article saves attempt regeneration and show an explicit repair warning if regeneration fails; the saved article is retained.

Use the [editorial workflow](docs/EDITORIAL-WORKFLOW.md), [source-review guide](docs/SOURCE-REVIEW.md), and [local-guidance workflow](docs/LOCAL-GUIDANCE-WORKFLOW.md) for their respective content. Japanese provenance, revisions, and review are documented in the [translation report](content/translations/CLAUDE-TRANSLATION-REPORT.md).

## Validation

Useful checks from the repository root:

| Command | Purpose |
| --- | --- |
| `npm run lint` | ESLint checks. |
| `npm test` | Vitest unit and integration suite. |
| `npm run architecture:check` | Dependency and portability boundaries. |
| `npm run config:check -- --target local` | Local web configuration preflight. |
| `npm run release:check -- --target local` | Complete local release sequence, including freshness, audits, build, post-build TypeScript, CMS exclusion, and browser bundle boundaries. |
| `npm run release:check` | Release sequence with production configuration validation. |
| `npm run test:e2e` | Playwright browser tests; starts or reuses the local development server by default. |
| `npm run cms:a11y` | Local CMS accessibility checks. |

Playwright is configured to use Google Chrome; install it if needed with `npx playwright install chrome`. Set `PLAYWRIGHT_BASE_URL` to an already running production server to test that build instead of starting the development server. Account tests are opt-in with `RUN_SUPABASE_E2E=1` and require a configured local Supabase stack; see the [session acceptance instructions](docs/DEPLOYMENT-CONFIGURATION.md#session-scope).

The [CI workflow](.github/workflows/ci.yml) runs release checks and production browser tests on pushes and pull requests to `main`. CI uses public-only/fixture settings and does not prove hosted account, provider, or operational acceptance. `release:check` does not include the separate Playwright browser run.

## Portable content and notification jobs

`npm run content:bundle` writes the versioned public English/Japanese content bundle and checksummed manifest to the gitignored `build/content-bundle/` directory. Exported data and portable contracts support future native/offline clients; native UI and runtime acceptance remain open.

The notification worker is a separate, bounded command rather than a web endpoint or resident process. Its configuration, database-time leases, exhausted-backlog procedures, local acceptance evidence, and activation gates are in [notification worker operations](docs/NOTIFICATION-WORKER-OPERATIONS.md). It defaults to production job validation. Email delivery is disabled unless explicitly enabled, but running a pass with delivery disabled still writes events and prepares deliveries; it is not a dry run. Scheduling and real delivery require their own reviewed operational setup.

## Deployment and contributing

Consult [deployment configuration](docs/DEPLOYMENT-CONFIGURATION.md) before configuring a host. `GET /api/health` and `HEAD /api/health` are process-liveness checks, not database/provider readiness checks. Public build settings must be present at build time; changing them requires rebuilding. Hosted security, callbacks, migrations, backups, rollback, and cross-device acceptance remain required independently of local test results.

Before contributing, read the relevant parts of:

- [Product specification](docs/PRODUCT.md) and [architecture](docs/ARCHITECTURE.md).
- [Content guidelines](docs/CONTENT-GUIDELINES.md), [editorial workflow](docs/EDITORIAL-WORKFLOW.md), and [source review](docs/SOURCE-REVIEW.md).
- [Roadmap](docs/ROADMAP.md), [decisions](docs/DECISIONS.md), and [refactor checkpoints](docs/refactor.md).

Keep changes within the agreed scope, preserve other contributors' work, and use separate worktrees for concurrent changes. Follow the relevant content/tool contracts, validate affected behavior, and report review and acceptance limits. Commit messages use `type: concise description`, for example `docs: refresh README for the current implementation`. Commits, pushes, merges, and service activation follow the authorization for the task.

## License

Nihonest is not offered under an open-source license. No additional permission to reuse project material is granted here. Third-party software, official source materials, map assets, and other third-party materials remain subject to their respective licenses, attribution, and reuse requirements. This statement does not claim exclusive rights over facts, public-domain material, or material that is not protected by copyright.
