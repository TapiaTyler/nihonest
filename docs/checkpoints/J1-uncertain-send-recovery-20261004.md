# J1 uncertain accepted-send lease-recovery acceptance — 2026-10-04

Implementer: Codex. Base: `7cd951b`. New harness scenario/evidence review and integration pending.
**Tested production source: `1a4ab65bc24161d0cd8db68c408f09a33d893735`**, the reviewed integration handoff.
No production runner, provider, adapter, SQL, configuration or dependency behavior is changed.

## Added scenario

The existing Auth/PostgREST harness gains `accepted-send-unfinalized-lease-recovery-can-duplicate`:

1. Create an owned confirmed Auth fixture, consent and a due reminder. The real production runner/adapter
   uses actual Auth and PostgREST; only the sender is fake.
2. Accept the fake send, then throw in the finalization hook **before any finalization RPC**. The report has
   one claim, zero acknowledged sent/failed deliveries, one infrastructure error and exit 1. The database
   retains processing state, attempt 1, token/expiry, with no sent timestamp or provider ID.
3. Run an immediate normal pass: zero claims, no second fake send and the full processing row unchanged.
4. Shorten only the owned row's expiry after matching delivery ID, owner, processing state and original
   token; require the update to return exactly that row. This avoids waiting the normal 300-second lease.
5. Recover through the actual claim RPC: same delivery, attempt 2, new token. Attempt old-token finalization
   while the new claim is processing; it must reject with the full new row unchanged.
6. The normal production path accepts a second fake send and persists sent state, attempt 2, fake provider
   metadata, cleared claim and the original delivery/event IDs. The report acknowledges one send and exit 0.
7. A later pass makes no third fake send and leaves the complete sent row unchanged.

Two fake provider acceptances for one event demonstrate the documented **duplicate-on-recovery limit**.
This is distinct from the existing lost-finalization-acknowledgement case, where the actual RPC commits sent
before its response wrapper throws and no resend is possible. The new test does not promise delivery or
exactly-once semantics, simulate real SES acceptance, or inject an actual broken HTTP connection.

## Isolation and real run

Used the existing clean detached validation checkout at
`4372d4a6680b08b01615e6298dd72cf4ad3db03b`. Its production files match `1a4ab65` (documentation-only successor).
Only the new harness was temporarily copied in; the harness verifies production source/migration/package/
bootstrap equality against the supplied commit before fixtures. Pending Stage-C working-branch source was
excluded. The original validation harness was restored byte-for-byte and the checkout ended clean.

A fresh external artifact project `nihonest-j1-auth-recovery-20261004` used all eight `git show` migrations
from `1a4ab65` and that commit's Supabase config, with only owned local project/ports and studio/SMTP disabled.
API/DB/shadow/studio/SMTP ports: **55541/55542/55540/55543/55544**. Existing CLI 2.116.0/images were reused;
no clean install. Only owned database, Auth, PostgREST and Kong services ran. No browser, SMTP, AWS sender,
resident worker or scheduler. The stack directory was
`C:/Users/T3/.codex/visualizations/2026/09/28/01a0e87b-a14b-7e43-a0c2-fbb02ce671f5/j1-auth-recovery-stack-20261004`.

Commands (from validation checkout for the harness):

```text
node node_modules/supabase/dist/supabase.js start --workdir <owned-stack-dir> --exclude realtime,storage-api,imgproxy,mailpit,postgres-meta,studio,edge-runtime,logflare,vector,supavisor
node --import ./scripts/notification-worker-register.mjs --import tsx scripts/acceptance/notification-worker-auth.ts --source-ref 1a4ab65bc24161d0cd8db68c408f09a33d893735 --stack-dir <owned-stack-dir>
```

**All 15 scenarios passed**, including the original 14, with final empty inventories. The harness report's
`harnessRef: 4372d4a` identifies its checkout context, not the new scenario's checkpoint commit; the temporarily
copied scenario is the code change under review here. Administrative credentials came only from the verified
owned local CLI status and stayed in memory; CLI credential output was suppressed, not written into records.

## Negative control, cleanup and other checks

- A temporary validation-harness variant finalized through the real adapter before throwing. It exited 1
  specifically at the new scenario, detecting that the persisted row was sent rather than unfinalized.
  The variant was removed/restored; production SQL and root harness were never altered by that control.
- After restoring the original validation file, the clean-checkout read-only preflight ran against its exact
  HEAD, with the owned local credential passed only in the child environment. Result: ready-for-fixtures,
  **11 tables empty, zero Auth users**. This independently checks cleanup after the expected-failing control.
- `stop --workdir <owned-stack-dir> --project-id nihonest-j1-auth-recovery-20261004 --no-backup` exited 0.
  Project-label-filtered Docker container and volume lists were empty afterward. No other project was stopped,
  restarted, edited or cleaned. External public config/migration setup artifacts remain for inspection.
- TypeScript, targeted ESLint on the harness and whitespace passed. No new unit test mirrors the fixture;
  real Auth/PostgREST persisted-row assertions supply the acceptance. The final comment-only terminology
  correction says duplicate-on-recovery rather than implying a general at-least-once guarantee.
- No full web release/build/browser, pgTAP/operator/concurrency, hosted, external-source or real-provider
  check was repeated. Provisioning remains manual and separate from the committed scenario harness.

This advances local evidence for the accepted-but-unfinalized recovery case; actual HTTP loss, every
critical-target branch, hosted/provider checks and scoped operations/scheduling decisions retain their limits.
The new scenario and the separate operator harness `832d9c7` await Claude's independent review. Consolidated
handoff stays held at the user's request; integration remains `1a4ab65` / `4372d4a`. No main merge or activation.
