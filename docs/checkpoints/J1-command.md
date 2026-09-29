# J1 standalone command and H3a configuration wiring

Implementer: Codex. Reviewer: Claude after availability reset. Date: 2026-09-29.
Base: `4b4bb37789db9ad222065c6c676af9053afd2973` (lease-budget checkpoint, review pending).
Status: implemented on the working branch; review/integration pending. No job or hosted service was run.

## Contract

- `npm run notification:once` is a single-pass Node command. Its entry point reads `process.env` only at the
  process boundary and invokes `executeNotificationWorkerJob`. That service validates H3a production job
  configuration before constructing a Supabase client or SES provider. Explicit factories are injectable for
  fixture tests. Missing job settings fail before any client, even when email is disabled.
- The command's production target requires the job URL and server secret. Email remains disabled unless H3a's
  exact feature flag and settings validate. With email disabled, generation/preparation still run, while claims,
  recipient reads and provider construction are omitted. The configured provider is disposed on both success
  and failure. Runner and SES timeouts use the same 10-second value.
- One JSON line carries only aggregate report fields and the corresponding exit status. Configuration errors
  expose setting names, never values. Other startup errors use a generic status. `--help` and invalid argument
  handling return before reading settings or touching any service. No new web endpoint, schedule, or long-lived
  background process exists.
- Next.js's `server-only` marker is mapped to an inert local file **only** by the standalone process's Node
  registration hook. Next's client-boundary enforcement is unchanged. This avoids a dependency/lockfile edit.
  The package change adds exactly one script line; it does not reorder the existing scripts.
- [The operating record](../NOTIFICATION-WORKER-OPERATIONS.md) describes post-gate configuration, defaults,
  disabled-delivery behavior, concurrency, costs, monitoring, uncertain sends and rollback. It does not
  authorize executing the command against hosted data or enabling real email.

## Verification

- `npm run notification:once -- --help`: exited 0 without a service call. Direct Node import of the worker
  using the scoped hook also passed; the initial data-URL hook approach failed under tsx on Windows and was
  replaced by the committed local shim.
- Fixture command tests: **4 passed** — config validation before construction, disabled-email generation
  without claims, enabled configuration with no fixture claims and provider disposal, and disposal after a
  store-construction failure. No live service/SDK send was invoked.
- Full `npx vitest run --maxWorkers=4`: **660 tests / 158 files passed**. `npx tsc --noEmit`, targeted
  ESLint, architecture (**694 production modules**) and `git diff --check` passed. Existing dependencies
  were used; no clean install. SQL/build/browser/editorial checks were not repeated for this command layer.

## Review and remaining gate

This command is not integrated and should not be scheduled or run with real credentials until Claude reviews
the `6aa8f1c` database-authority, `904856e` recipient, `4b4bb37` lease-budget and this exact command
checkpoint, and the combined integration/real PostgreSQL acceptance gates pass. The validated integration
remains `e4fc1ff`. Production host setup, concurrency/lock-wait and pgTAP tests, and an explicitly approved
opt-in email test remain outstanding. No main merge or activation.
