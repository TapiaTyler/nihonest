# Deployment configuration

Settings are validated by feature in [`src/lib/config/deployment-config.ts`](../src/lib/config/deployment-config.ts).
The public knowledgebase always runs; accounts, administrative jobs, and email delivery are optional and a
disabled feature never requires its settings or secrets. Validation issues name the setting and never print values.

## Preflight

```bash
npm run config:check -- --target production --require accounts
npm run config:check -- --deployment job --target production
```

- `--target local|production` (default `local`). Production requires an HTTPS, non-local `NEXT_PUBLIC_SITE_URL`
  and HTTPS Supabase URLs, and requires a server secret key whenever accounts are enabled.
- `--deployment web|job` (default `web`). `job` checks a command environment exactly as `requireJobConfig` does:
  the Supabase URL and a server secret, plus email settings when delivery is enabled. It needs no publishable key,
  and `--require` may add only `emailDelivery`. `web` checks the Next.js site; `--require jobs` there means the
  worker shares the web host's environment, so incomplete web-account settings are still reported.
- `--require accounts,jobs,emailDelivery` fails unless those features are configured. Jobs are never inferred
  from the web environment.
- `--env-file <path>` layers a dotenv file beneath the process environment.
- Exit status 1 means at least one issue.

## Features and settings

| Feature | Enabled when | Settings |
| --- | --- | --- |
| Public site | always | `NEXT_PUBLIC_SITE_URL` (required in production) |
| Accounts | `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is set (both are then required) | the two public values; `SUPABASE_SECRET_KEY` (or legacy `SUPABASE_SERVICE_ROLE_KEY`) for account deletion, required in production; optional `NEXT_PUBLIC_SUPABASE_GOOGLE_AUTH_ENABLED` / `NEXT_PUBLIC_SUPABASE_APPLE_AUTH_ENABLED` |
| Administrative jobs | the command requires them, or email delivery is enabled | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SECRET_KEY` (or legacy key) |
| Email delivery | `EMAIL_DELIVERY_ENABLED` is exactly `true` | `EMAIL_PROVIDER=amazon-ses`, `AWS_REGION`, `EMAIL_FROM_NAME`, `EMAIL_FROM_ADDRESS`, HTTPS `NEXT_PUBLIC_SITE_URL`; AWS credentials come from the SDK's default provider chain and are not validated here |

Blank values count as unset. Flags are compared exactly, as the browser does: only `true` enables and only `false`
disables; anything else, including ` true ` or `TRUE`, is reported and treated as disabled.

Origin settings (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`) must be a bare `http`/`https` origin. A trailing
slash is allowed; credentials, a path, a query, or a fragment are rejected. Readers return the normalized origin,
and `src/lib/site-url.ts` fails the build on an invalid site URL, so nothing else in the value reaches metadata,
the sitemap, or email links.

## Build time versus runtime

- `NEXT_PUBLIC_*` values are inlined into browser JavaScript by `next build`. Set them in the build environment;
  changing them afterward requires a rebuild. They are public.
- `SUPABASE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and the email settings are read at runtime by the server or a
  job command. They must never use the `NEXT_PUBLIC_` prefix and are never sent to the browser.
- A job command reads `NEXT_PUBLIC_SUPABASE_URL` at runtime from its own environment.

## Using the module

- Commands (for example the notification worker) call `requireJobConfig(process.env, target)`, which returns the
  Supabase URL, secret key, and email configuration or throws a `ConfigurationError` listing each issue.
- Server code reads email settings through `getEmailDeliveryConfig()` and the admin client through
  `readSupabaseSecretKey()`. Browser code keeps reading public values through `src/lib/supabase/config.ts`, whose
  literal `process.env.NEXT_PUBLIC_*` references Next.js inlines.
- `deployment-config.ts` has no `server-only` marker so commands can run outside Next.js. Client components must
  not import it.

Public-only local development needs no settings. Hosted checks that this preflight cannot prove — callback URLs,
SES identity verification, AWS credentials, and scheduler setup — belong to the hosted integration gate.

## Security headers

`next.config.ts` sends the headers built in [`src/lib/config/security-headers.ts`](../src/lib/config/security-headers.ts)
on every response:

- **Content-Security-Policy.** Same-origin by default; `object-src`, `frame-src`, and `frame-ancestors` are `'none'`;
  `base-uri` and `form-action` are `'self'`. `img-src` adds the origins in `images.remotePatterns` (official document
  images load directly). `connect-src` adds the Supabase origin only when accounts are configured. Pages are prebuilt,
  so per-request nonces are not available (the installed Next.js CSP guide: nonces require dynamic rendering); scripts
  and styles therefore allow `'unsafe-inline'` for Next's hydration payload. There is no `'unsafe-eval'` in production,
  and the browser runs Zod in `jitless` mode so its eval probe does not report a violation. The site renders no raw
  HTML (`dangerouslySetInnerHTML` is unused).
- `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`,
  `Cross-Origin-Opener-Policy: same-origin` (sign-in uses redirects, not popups), and a `Permissions-Policy` that
  disables camera, microphone, geolocation, payment, USB, and topics (pronunciation uses on-device speech synthesis).
- **Transport.** Only when `NEXT_PUBLIC_SITE_URL` is HTTPS: `Strict-Transport-Security: max-age=31536000` (no
  `includeSubDomains` or `preload` until the production host is settled) and `upgrade-insecure-requests`. Headers are
  fixed at build time, like the other `NEXT_PUBLIC_*` values.
- `X-Powered-By` is not sent.

Hosted check still required: confirm the headers through the production host and CDN, and sign-in against the real
Supabase origin under the policy.

## Health check

`GET /api/health` (and `HEAD`) returns `{"status":"ok"}` with `Cache-Control: no-store`. It is **process liveness**
only: it reads no settings, calls no database or provider, and is excluded from the session proxy, so a Supabase or
email outage never marks the public knowledgebase unhealthy. **Dependency readiness** (for example whether accounts or
jobs can reach Supabase) is a separate concern and is not part of this endpoint.

## Local development only

`NIHONEST_DEV_ALLOWED_ORIGINS` (comma-separated hosts, for example a phone on the LAN) extends `next dev`'s allowed
origins beyond `127.0.0.1`. It has no effect on production builds and is never a deployment setting.

## Release checks and CI

`npm run release:check` runs every release gate in order and stops at the first failure: the web configuration
preflight (`--target production` by default; `--target local` for a rehearsal without production settings), lint,
the unit/integration suite, architecture boundaries, the editorial and coverage audits, the localization audit,
the article translation and glossary consistency checks, the production build, type checking (after the build,
which generates route types), the CMS exclusion scan, and the browser bundle boundary. Stop any `next dev` server
for the checkout first. No step sends email, calls a hosted service, or changes canonical content.

`.github/workflows/ci.yml` runs on pushes and pull requests to `main`:

- **Release checks:** `npm ci` on Node 24, then `npm run release:check` with a fixture `https://nihonest.invalid`
  public origin, then a job-environment preflight with placeholder credentials and delivery disabled.
- **Production browser tests:** a public-only build served by `next start` on loopback (no HTTPS origin, so
  `upgrade-insecure-requests` does not break local asset loading), then the full Playwright suite. The account
  lifecycle test stays skipped unless `RUN_SUPABASE_E2E=1` with a local Supabase stack.

CI holds no hosted credentials: Supabase, email, and AWS settings are absent or placeholders, so accounts, jobs, and
delivery stay disabled, and no database is created or changed.

What automation does not prove (hosted gate):

- the host deploys only after CI passes (enable the host's "wait for CI" setting for `main`);
- production settings are set in the host, including `NEXT_PUBLIC_*` values at build time;
- headers, HSTS, and caching through the production host and CDN; `/api/health` as the host's health check;
- sign-in, callbacks, and account sync against the real Supabase project under the Content-Security-Policy;
- reviewed migrations applied and backups configured; notification jobs remain unscheduled until J1's own gates;
- real email stays disabled until an explicitly authorized opt-in test.

## Session scope

`src/proxy.ts` refreshes Supabase sessions only on `/account`, `/account/*`, `/api/account`, `/api/account/*`, and
`/auth/*`, the routes that read a verified server identity. Prebuilt public pages and `/api/health` make no
per-request Auth call; on public pages the browser Supabase client refreshes an expiring session and rewrites the
cookies that those routes read. The authentication callback redirects with a relative `Location`, so the browser
stays on the host where its session cookies were set.

`e2e/session-scope.spec.ts` checks this against a local Supabase stack: signed-in public browsing across a real
access-token expiry, direct account/API requests after expiry, sign-out from a public page followed by 401/403
API responses, and account switching. Run it with a JWT lifetime longer than the 90-second supabase-js refresh
margin (for example 180 seconds):

```bash
RUN_SUPABASE_E2E=1 SUPABASE_JWT_EXPIRY_SECONDS=180 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npx playwright test e2e/session-scope.spec.ts e2e/account.spec.ts
```

`SUPABASE_MAILPIT_URL` points the tests at a non-default Mailpit. Hosted check still required: the same flows on the
production Supabase project and host, including cross-device sync.
