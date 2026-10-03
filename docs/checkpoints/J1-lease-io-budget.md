# J1 provider deadline and claim-lease I/O budget

Implementer: Codex. Reviewer: Claude after availability reset. Date: 2026-09-29.
Base: `904856ea1fc5c75ab9d994259fe99dba23832b49` (recipient-policy checkpoint, review pending).
Status: implemented on the working branch; review/integration pending. No runnable command exists.

## Contract

- The runner bounds each store call and the provider call. The defaults are 10 seconds each, configurable
  through `databaseTimeoutMs`/`providerTimeoutMs` in the existing runner limits (1–30,000 ms). The shared
  operation helper races the promise against a deadline and propagates `AbortSignal`; a non-cooperating
  fixture cannot block the pass forever. The Supabase adapter creates a request-scoped client so the signal
  reaches both PostgREST and Auth reads and the finalizer; its fetch also retains the existing response-body
  deadline, 2 MiB cap, redirect rejection and sanitized errors. No global mutable signal is shared.
- A monotonic claim budget starts **before** the claim RPC, accounting for time spent receiving the claim.
  On reading a claimed row, the runner shortens that budget using conservatively aged database time and the
  row's `claim_expires_at`. It reserves one second against expiry. A new claim/send/finalization may not
  outlive this budget even if an implementation ignores abort; the runner stops a pass whose lease budget
  expires and leaves the claim for database recovery.
- An enabled delivery pass rejects a plan when its requested lease cannot fit six maximum database calls,
  one provider call and the one-second reserve. At default 10-second call budgets, a lease must exceed
  71 seconds; the existing 300-second default fits. Before provider send, the remaining database and
  monotonic budgets must each cover the provider limit, two database calls and reserve. Before finalization,
  both must cover the database limit and reserve. Insufficient time leaves the claim processing, increments
  `expiredClaims`, and does not start another external operation. Database-side finalization still verifies
  expiry after acquiring the row lock, so these worker checks do not replace SQL authority.
- The configured SES v2 factory now accepts explicit validated email config and send timeout without reading
  environment or sending during construction. It uses one SDK attempt, bounded connection/request timeouts,
  forwards the caller abort signal into `client.send`, and exposes `dispose()` for the future command to close
  SDK resources. The existing environment-reading helper delegates to this factory. Disabled email constructs
  no client. Future command wiring must pass matching runner and SES timeouts and dispose the client.
- A provider timeout is a sanitized `failed` result with the existing database-controlled retry. The provider
  may have accepted an email without returning an acknowledgement; that retry can duplicate it. Likewise,
  a send followed by lease loss leaves an uncertain claim for recovery. The aggregate report cannot claim
  exactly-once delivery. Claim/finalization RPC timeouts can leave database work in flight; the SQL token
  and expiry checks remain decisive. If an arbitrary injected transport ignores abort, the runner returns
  by its deadline but cannot forcibly cancel that external side effect.

## Verification

- Focused notification/transport suites: **86 tests / six files** passed. Added cases cover a stalled
  non-cooperating operation, parent cancellation, claim budget shortening, native fetch cancellation, a
  stuck claim read, provider timeout, too-short configuration, pre-send and pre-finalization reserve checks,
  and SES one-attempt/abort/disabled construction. Existing clock, recipient, SQL-mapping and provider tests pass.
- Full `npx vitest run --maxWorkers=4`: **656 tests / 157 files passed**. `npx tsc --noEmit`, targeted ESLint,
  `npm run architecture:check` (**693 production modules**) and `git diff --check` passed.
- Windows / Node 24.21.0, existing dependency installation. SDK, Auth, database and provider operations
  were fixture-backed. No production/hosted service or real email was used. SQL/build/browser/editorial
  checks were not repeated; this adds no SQL, application consumer, renderer or content changes.

## Remaining gates

Claude must review this exact checkpoint and its pending `6aa8f1c`/`904856e` ancestors before integration.
The reviewed integration remains `e4fc1ff`. Standalone command and H3a config wiring, isolated real
Supabase/PostgreSQL 17 SQL concurrency/lock-wait and pgTAP acceptance, operator documentation and hosted
activation remain separate. No main merge, schedule or real email is authorized by this checkpoint.
