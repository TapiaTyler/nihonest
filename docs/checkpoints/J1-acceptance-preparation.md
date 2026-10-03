# J1 acceptance preparation and operator review

Implementer: Codex. Reviewer: Claude after availability reset. Date: 2026-09-30.
Base: `810e262faaa48b5b2f6a036b61ccc7cddf02fab4`.
Status: preparation only; reciprocal review, integration and real database acceptance remain open.

## Review and changes

Reviewed the worker, Supabase adapter, command, authority migration, pgTAP fixture and
[operating contract](../NOTIFICATION-WORKER-OPERATIONS.md) together. No new runtime defect was found.
The operating contract matches disabled-email database writes, confirmed-email suppression, database
finalization, bounded operations, aggregate output and uncertain-send recovery. Disabled delivery is not
a dry run, and an expired fifth claim is reported without resetting it.

The authority fixture now has 29 assertions (previously 24). New cases reject an attempt limit above
twenty, failure without an error summary, provider metadata on suppression, and the original token after
reclaim. A row snapshot also proves rejected finalizations leave the original claim unchanged.
These supplement the existing expiry, completed-token replay, database timestamp/backoff, privilege and
owner-RLS cases. No migration, runtime, dependency or configuration change.

## Remaining real database acceptance

Use a fresh, disposable **isolated Supabase/PostgreSQL 17** environment at the reviewed combined commit.
Record the commit, PostgreSQL version, migration status and fixture output. Do not reset another
contributor's database or run the worker with production credentials. This record does not authorize
starting services or real email; those actions remain subject to the existing gates.

1. Run all four committed database notification fixtures through `npm run supabase:test` in that
   isolated environment, including the 29-assertion authority fixture. Preserve failure output. Existing
   migrations and deterministic legacy RPC tests must pass together with the new service-only wrappers.
2. Use two independent connections and committed fixture rows to exercise competing claims. Hold a
   claimed row's transaction open in connection A, then claim from B with the same attempt/lease limits.
   B must return different unlocked work without waiting for A; total attempts must increment once per
   successful claim. Commit both and inspect persisted tokens. A single transaction or embedded connection
   cannot demonstrate `SKIP LOCKED` behavior.
3. Hold a row lock on a processing fixture in A. In B, begin finalization with its correct token while
   the lease is still valid. Keep the lock until database time passes `claim_expires_at`, then release A.
   B must raise `P0002` and leave the row unchanged: completion time must be read **after** the lock wait.
   Use a statement timeout longer than the deliberately bounded wait and capture both sessions' times.
4. Reclaim expired processing work below five attempts, then try finalization with its old token from
   the other connection. It must fail; the new token must remain authoritative. At attempt five, both
   failed rows and expired processing rows must remain unclaimed and appear only in aggregate inspection.
5. Run the fixture worker against isolated Auth/PostgREST with a fake sender. Exercise a missing
   preferences row, verified/unverified/missing email, changed consent, withdrawn reminder, changed
   critical relevance, provider timeout and lost finalization response. Compare reports and persisted
   rows; no live SES call belongs to this acceptance step. SDK mocks alone do not establish Auth/RLS/RPC
   behavior through the real stack.

The existing claim/generation RPC defaults use database **transaction-start time**; worker clock reads
and the new completion wrapper use `clock_timestamp()`. Keep claim calls in their normal short request
transactions, and record request/lock delays. The conservative worker clock/monotonic budgets may abandon
a claim whose lease aged during a request. Neither an explicit caller `p_now` nor a fixture transaction
kept open for the whole scenario represents the production adapter, which omits `p_now`.

After real database acceptance, run the combined integration checks and obtain reciprocal review for
the four pending J1 implementation checkpoints and this preparation. Host/scheduler choice and any
opt-in real-email test still need their separate decisions. Reviewed integration remains `e4fc1ff`;
do not integrate the working branch head with its unrelated unreviewed N1/N2/N4 ancestors.

## Local verification

- Isolated artifact `j1-sql-acceptance-smoke.cjs`: **30 embedded SQL assertions passed**, using all
  repository migrations and the authority fixture's seed. Includes the five new cases (the attempt-limit
  upper bound was already checked in the earlier embedded smoke). PostgreSQL **18.3 / PGlite 0.5.8**,
  stub Auth, one connection, no hosted I/O. This is not pgTAP or PostgreSQL 17 concurrency acceptance.
- Static assertion count: the committed pgTAP plan matches **29 assertions**. pgTAP itself was not run.
- `npx vitest run src/lib/notifications src/domain/notifications --maxWorkers=4`: **133 tests / 15 files passed**.
- `npm run --silent notification:once -- --help`: exit 0, usage only; no job settings/service calls.
- `git diff --check`: passed. Existing dependencies; no clean install. Full suite, types/lint/build/browser,
  translation audits and real SQL/hosted checks were not repeated for this SQL-fixture/documentation change.
