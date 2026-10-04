# J1 explicit local target and exhausted-backlog procedure — 2026-10-03

Implementer: Codex. Reviewer: Claude. Base: `938b869` (N1 test checkpoint, still unreviewed).
Checkpoint hash is reported in the handoff. **Implementation complete; review/integration pending.**

## Command target

`notification:once` defaults to production and accepts only `--target production`, `--target local`
or help. Missing/unknown/duplicate arguments are rejected without echoing them or reading settings.
The selected target reaches `executeNotificationWorkerJob`; no environment value infers it.

Local mode first uses the existing H3a job validator, then requires a loopback Supabase hostname
(`localhost`, `127.0.0.1`, `[::1]`) and disabled email before constructing a store/provider. Production
requirements are unchanged, including rejection of HTTP/loopback job origins. No configuration-owner
module, provider, runner, report, exit policy or migration is changed. Local execution still writes
events/prepared deliveries; it is not a dry run. The operator must independently verify stack identity
and use disposable credentials. Actual fake-sender acceptance still needs its injected runner harness.

## Exhausted-backlog operating procedure

The operating contract now distinguishes acknowledgement from resolution. A private incident acknowledges
the alert but does not clear counters or turn exit 1 into success. Investigate provider acceptance and
record uncertain outcomes; no automatic attempt reset, resend, deletion or requeue is introduced.

`scripts/sql/resolve-exhausted-email-delivery.sql` is a **manual database-administrator psql procedure**,
never called by the worker. It defaults to rehearsal/ROLLBACK. A separately reviewed decision to permanently
abandon one delivery requires its ID, a nonempty private incident reference and explicit
`commit_resolution=true`. The reference is not persisted in a new database audit table; the documented
private incident must preserve the necessary evidence and operator/reviewer/execution record.

The procedure locks one row and checks database wall time after the lock. Only email rows at five or more
attempts that are failed or expired-processing can become suppressed. Retryable, live, sent, suppressed or
absent rows fail with a nonzero psql exit. It preserves attempts, last-attempt time, event/owner and available
time, clears claims/error/provider metadata as required by the existing suppression constraint and updates
the timestamp through the existing trigger. Terminal suppression is an abandonment decision; it makes no
claim about whether an uncertain provider send actually occurred. Post-commit recovery/replacement remains
a separate reviewed decision. No new privileged RPC or grants are added.

## Independent verification

- Targeted command/entry tests: **25 passed / two files**. All notification/domain suites:
  **154 passed / 16 files**. TypeScript, targeted ESLint and whitespace passed.
- Actual `npm run --silent notification:once -- --help`: exit 0, updated usage, no job I/O.
  Actual entry with explicit local target and non-loopback dummy URL: exit 1, sanitized configuration
  report naming only NEXT_PUBLIC_SUPABASE_URL. No credential/URL printed and no service contacted.
- Disposable PostgreSQL **17** using the already-installed Supabase postgres image `17.6.1.165`,
  network disabled, no published ports or host volumes. All current repository migrations applied,
  including the separately unreviewed N4 migration; this does not integrate or approve that checkpoint.
  Image auth schema/roles/uid helper plus JWT-subject fixtures; no real Auth server/JWT verification.
- All four notification pgTAP fixtures executed through psql: dispatch **10**, pipeline **15**,
  foundation **18**, worker authority **29** — **72 assertions passed**. This advances the PostgreSQL
  fixture evidence; real two-connection concurrency/lock-wait, Auth/PostgREST/fake-sender acceptance
  remains open. Tests are not claimed as `supabase test db` on a full local stack.
- Artifact harness `j1-operator-acceptance.cjs` invoked the actual committed psql procedure:
  **49 assertions passed**, covering default rehearsal with unchanged row snapshots, missing/blank
  reference/ID, retryable/live/sent/absent rejection, exhausted failed and expired-processing suppression,
  retained metadata, cleared claims, terminal replay rejection, exact commit-flag validation and aggregate
  backlog becoming zero. The harness is saved in the session artifact directory for reproduction.
- The first rehearsal caught that PostgreSQL 17 psql ignores the exit argument to `\quit`: a missing
  reference returned success. Explicit SQL errors with ON_ERROR_STOP replaced that path; the final
  harness confirmed nonzero failures. Subsequent harness retries also exposed image initialization
  and readiness-probe assumptions (BusyBox ps options and the wrapped process name). The final harness
  waits for the final PID-1 PostgreSQL readiness log, rather than its temporary initialization server.
  All owned disposable containers were stopped and removed; no product fix arose from those harness retries.
- Existing dependencies; no clean install. Full web Vitest/build/browser/content/localization/architecture
  were not repeated for this job-command/operator-only checkpoint. Prior checkpoint evidence remains
  attributed to its exact source. No real SES or hosted service was contacted.

## Handoff and remaining gates

Review the exact checkpoint and updated `NOTIFICATION-WORKER-OPERATIONS.md` before integration or operational
use. Its parent `938b869` and earlier N4 `a39d01b` still await review; do not integrate the branch head on
approval of this checkpoint alone. Validated integration remains H4 `52f8a08` / documentation `3bf4e94`.

J1 production activation still needs combined reviewed-source verification, real concurrent claims and
post-lock expiry, full Auth/PostgREST/fake-sender acceptance, scheduler/host choice and the scoped operator
resolution gate. N4/H5 Auth/session and N1/N2 Stage-C/native gates remain open. No main merge or activation.
