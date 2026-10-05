# J1 database time, finalization and exhausted-claim checkpoint

Implementer: Codex. Reviewer: Claude after availability reset. Date: 2026-09-29.
Base: `ece6c4afd870e7bb7e37266fdb4ba02de69589ec`, whose tree matches reviewed integration `e4fc1ff`.
Status: implemented locally; review/integration pending. **J1 remains incomplete and has no runnable command.**

Claude reports merging exact `e4fc1ff` as `93e44b4`, conflict-free and pushed. Documentation review since
`b494ed0`, including `e374bbe`/`e4fc1ff`, remains deferred. This checkpoint is separate from that validated
integration source; it does not change Claude's absence-plan ownership or activate any service.

## Contract

- New migration `20260929000100_add_notification_worker_authority.sql` adds three RPCs with empty search
  paths and execution restricted to `service_role`: `read_notification_worker_time()`,
  `finalize_email_notification_delivery_now(uuid, uuid, text, text, text)`, and
  `inspect_email_notification_delivery_backlog(integer)`. Existing deterministic RPCs/signatures remain.
- The new finalizer locks the processing email row matching ID/token, then reads `clock_timestamp()` and
  rejects absent/expired claims. It delegates metadata/state validation to the existing finalizer while
  holding that lock. Database time sets sent time and retry availability; failure backoff uses the locked
  attempt count (one-minute exponential delay, six-hour cap). No timestamp or retry date is accepted by
  the new RPC. Reading time after lock acquisition avoids using transaction-start time after a lock wait.
  PostgreSQL distinguishes advancing `clock_timestamp()` from transaction-start `now()` in its
  [date/time documentation](https://www.postgresql.org/docs/17/functions-datetime.html#FUNCTIONS-DATETIME-CURRENT).
- The runner's caller-supplied `now` callback is removed. Stores must implement asynchronous `readWorkerTime()`;
  the live adapter reads the service-only database clock before each existing time decision. It adds the
  entire monotonic request round trip plus one millisecond for discarded PostgreSQL microseconds, so a
  delayed response cannot make lease checks run behind its sampled database time. This conservative allowance
  can abandon a nearly expired claim early. It never compares with the worker's wall clock.
- Malformed/rejected clock reads retain the reviewed latch: stop the pass, count one infrastructure failure,
  do not finalize uncertain work or claim more work. Provider dispatch still sanitizes failures; the runner
  detects a clock failure raised by its asynchronous send guard after dispatch catches it.
- Domain completion `now`/`retryAt` remain fixture/outcome metadata, validated as before; the adapter does
  not transmit either to the finalizer. Production persistence is decided by the database. Shared
  `src/types/database.ts` adds only these RPC entries; no dependency, shared config or Supabase client module changes.
- Inspection returns only `exhausted_failed` and `exhausted_expired_processing` counts at the supplied
  validated attempt limit (worker uses five). Unexpired processing claims and retryable rows are excluded.
  It changes no state/token/attempt, reveals no IDs, recipients or stored errors, and uses database time.
- The runner inspects after preparation and after a delivery pass, including when delivery is disabled
  (one inspection, no claims). It reports `exhaustedFailures`/`exhaustedExpiredClaims`; either gives failed
  status/exit 1 for operator alerting. Inspection failure stops before claims or fails the completion report.
  Jobs disabled still perform no I/O at all. Clock failure stops before the final inspection; an expired
  fifth claim left behind is counted on a later pass. No automatic reset, requeue or resend is introduced.

## Verification

- Focused runner/real-SDK mapping/transport: **61 tests / three files passed**. Coverage includes valid but
  skewed worker clocks, actual database expiry, response-age allowance, invalid database/monotonic time,
  clock latching at each stage, no transmitted finalization time/retry date, aggregate validation, disabled
  jobs/delivery, inspection errors, fifth claims left by context-clock failure or an uncertain successful send,
  and unexpired fifth claims becoming reportable only at expiry. Existing consent/retry/recovery fixtures pass.
- Full `vitest run --maxWorkers=4`: **621 tests / 154 files passed**. `tsc --noEmit`, targeted ESLint,
  architecture (**691 modules**) and `git diff --check` passed. Existing dependencies, not a clean install.
- SQL execution smoke: actual repository migrations applied to **PGlite 0.5.8 / PostgreSQL 18.3**, in memory,
  outside the repository. **26 SQL assertions passed**: function privileges, advancing database time inside
  a transaction, stale/expired/replayed claims, metadata/null validation, database backoff, aggregate counts
  and read-only inspection, eligible reclaim, sent/suppressed completion, and existing owner RLS with fixture Auth.
  SQL smoke harness: `j1-sql-smoke.cjs` under the session's artifact root, run with Node. The pinned runtime
  is installed only in the sibling `j1-sql-runtime/`; repository package/lock files are unchanged. The npm
  certificate lookup failure was resolved with Node `--use-system-ca`, retaining TLS verification.
- New `supabase/tests/database/notification_worker_authority.test.sql` supplies **24 pgTAP assertions** for
  the real isolated Supabase run. **That pgTAP suite was not run.** Docker's Linux engine is unavailable;
  native PostgreSQL executables were not found on PATH. No daemon/stack was started or another checkout reset.
- PGlite has a [single exclusive connection](https://pglite.dev/docs/#what-next); its smoke is not proof of
  multi-connection lock waiting/claim concurrency, Supabase Auth/RLS integration, or the configured PostgreSQL 17
  environment. Those remain acceptance gates, alongside the existing SQL suites and a fake-provider runner pass.
- Build/browser/editorial checks were not repeated: the changed adapter/runner still have no app/command
  consumer, RPC type additions passed full TypeScript, and reviewed integration `4f41ec5` already passed
  those gates. Final runnable J1 acceptance must repeat applicable combined gates.

## Remaining work

This resolves worker wall-clock skew in the implemented time source and adds database-authoritative finalization;
it does not establish exactly-once provider delivery. A process can stop after provider acceptance and before
persistence, and lease recovery may resend. The command must enforce provider/context/finalizer budgets shorter
than the lease and account for scheduling/transport delays; separate database and provider operations are not atomic.
The new migration must be reviewed and installed in an isolated test project before the live adapter is usable.

Next: real PostgreSQL 17 concurrency/expiry/permissions acceptance; recipient suppression and confirmation policy;
exhaustive critical-event target mapping; standalone server-only command loading and H3a wiring; provider I/O
budgets, operator recovery/alerts and scheduling/spend documentation. No recurring schedule, hosted database,
provider construction/send, translation edit or main merge is part of this checkpoint. New code waits for
Claude's review before integration. Reviewed integration stays at `e4fc1ff`.
