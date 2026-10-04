# J1 current local acceptance and remaining operations gates — 2026-10-04

Audited working source `60e6591`. Codex documentation reconciliation; review pending. No production code,
SQL, settings, sender, stack or schedule is changed. Earlier dated checkpoint records remain historical;
this record supplies the current status instead of retroactively rewriting their pending-review statements.

## Reviewed local evidence already delivered

| Gate / evidence | Review and integration scope |
| --- | --- |
| Runner/database authority/recipient/lease/command | Claude code-approved; integrated foundation `b09cd28`, plus later approved follow-ups. Production command consumes the adapter and uses database-authoritative finalization. The adapter-only intermediate clock limitation is historical, not the current worker state. |
| Explicit local target and exhausted-row procedure | `8f9646a` code-approved by Claude; exact-hash integration recorded in the H3b/H5 receipt. Recorded real PostgreSQL 17 evidence: 72 notification pgTAP assertions and 49 operator-procedure assertions. Claude did not rerun this SQL/operator evidence. |
| Competing claims and post-lock expiry | `7758622` code-approved by Claude. Standalone harness: 36 assertions at `3bf4e94`, then 36 at reviewed combined source `0e5fcf9`, including transaction-time negative control. Claude did not rerun the concurrency harness. |
| Auth/PostgREST preflight | `759a4e4` scope-approved; integrated before the real-stack harness. Claude reran its 16 fixture tests/types. Read-only empty-inventory/source/loopback checks do not themselves establish full-stack acceptance. |
| Real Auth/PostgREST with fake sender | `733c827` scope-approved by Claude, integrated as `b3742db`. Codex recorded 14 real-stack scenarios against production source `f70069c`, final inventories empty and owned stack removed. Claude reviewed the harness without rerunning the real-stack scenarios. |
| Combined source gates | `4139f0c` release 13/13 (1,018 tests / 181 files); later reviewed `4372d4a` release 13/13 (1,028 / 181). These web gates did not rerun real SQL/Auth/operator scenarios. Current designated integration handoff is `1a4ab65`. |

References: [local target/operator evidence](J1-local-target-backlog-procedure.md),
[PostgreSQL concurrency](J1-postgres-concurrency-acceptance.md),
[reviewed-input integration](H3b-H5-review-integration-20261003.md),
[real Auth/PostgREST acceptance](J1-auth-postgrest-acceptance.md),
[harness integration](Stage-C-artifacts-J1-integration-20261004.md), and
[latest reviewed source gate](N3-English-v2-integration-20261004.md).

The operations guide's statements that those listed real local gates and procedure code review were still
pending had become stale. The current guide and the J1 status section in refactor.md are corrected in this
checkpoint. Local evidence retains its exact source and attribution; this reconciliation claims no new real
database run, independent repeat by Claude, hosted acceptance or automatic authorization to use the procedure.

## Remaining gates and evidence limits

- Choose/approve the job execution location and credentials, invocation frequency, overlapping-run policy,
  monitoring/incident routing, cost bounds and rollback ownership before scheduling. No deployment/scheduling
  or outbound communication is authorized by reviewed implementation alone.
- Rehearse the intended operational process and resolve or privately acknowledge any actual exhausted backlog.
  A code-approved procedure is not approval to mutate a real row. Each terminal resolution still needs its
  scoped environment/row/evidence/operator/reviewer decision. An acknowledgement does not hide counters or
  change exit code 1. Unknown provider acceptance remains uncertain; suppression abandons delivery, not proof
  of whether a message was sent.
- Real provider/hosted acceptance remains separately gated, including any explicit opt-in test. No SES send,
  AWS credentials, hosted database or scheduled worker was used in the local evidence or in this pass.
- The local 14-scenario harness does not cover every critical-event targeting branch, actual HTTP response
  loss, or provider acceptance followed by lease recovery of an unfinalized claim. The committed-RPC lost-ack
  wrapper is scoped evidence, not a broken-network simulation. Exactly-once delivery is not promised.
- H5/browser user-JWT/session/RLS acceptance is distinct from service-role worker acceptance; attributed H5
  local evidence and hosted PGRST303 watch items retain their separate records/gates.
- SQL/operator reproduction still has a tooling distinction: concurrency and Auth harnesses are committed;
  the 49-assertion operator harness lives in the session artifact directory. A portable, exact-source,
  disposable-stack reproduction of that procedure is useful independent follow-up, not evidence that the
  recorded operator assertions were never run. Do not run its old hardcoded-container artifact against an
  unverified target or borrow Claude's stack.

## Checks in this pass

Read-only `git diff --name-only` confirmed migrations and `resolve-exhausted-email-delivery.sql` unchanged
between reviewed combined SQL source `0e5fcf9` and current working HEAD. Runner, adapter, command, database-fetch
and domain-notification production files are unchanged from tested `f70069c`; the notifications directory
only adds the subsequently approved preflight module/tests. This comparison is source-continuity evidence,
not a real-stack rerun or permission to integrate unrelated working-branch checkpoints.

All three no-I/O help commands exited 0:

```text
npm run --silent notification:once -- --help
node scripts/acceptance/notification-worker-postgres.mjs --help
node --import ./scripts/notification-worker-register.mjs --import tsx scripts/acceptance/notification-worker-auth.ts --help
```

Help was used without job settings, credential inspection, Docker service startup or provider construction.
No full tests/types/lint/release/build/browser, real SQL/Auth, external or hosted checks were repeated for this
documentation correction. Whitespace checked. Consolidated review remains held at the user's request.
No integration advance, main merge, real email, hosted activation or scheduling.
