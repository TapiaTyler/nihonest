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
