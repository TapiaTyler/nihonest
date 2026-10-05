# J1 published critical-update targeting acceptance — 2026-10-04

Implementer: Codex. Base: `95ab4dd`. New harness scenarios/evidence await independent Claude review and integration.
**Tested production source: `1a4ab65bc24161d0cd8db68c408f09a33d893735`** (reviewed integration).
No production runtime, SQL, configuration, dependencies or translation artifacts changed.

## Added real-stack coverage

The Auth/PostgREST harness previously tested manually inserted saved-article critical events. These ten
additional scenarios exercise actual published-release generation, preparation, claiming, context loading
and finalization through the production runner and adapter. Only the email sender is fake.

- Saved residence-status target produces the status event and correct status URL.
- An article journey-wide target with a null route matches the selected journey.
- A residence-status target matches the selected journey and exact route.
- Article route and journey mismatches each produce no event or delivery.
- Saved-plus-journey article relevance produces one event/send, with both reasons in the message.
- After claim, changing the selected route, changing the selected journey, or withdrawing critical-topic
  consent each suppresses the claimed delivery without a fake send or infrastructure error.
- Critical-topic consent disabled before generation produces no event or delivery.

Matching targeting scenarios check event type, release-based deduplication key, payload release ID,
delivery/event linkage, sent state at attempt one and destination text. Both-reason targeting checks the
existing message wording. Generation marks the six targeting releases processed, including mismatches;
a repeated pass generates/claims nothing and makes no additional fake send. The three after-claim cases
check persisted suppression at attempt one, processed release state and no later send.

Fixtures use synthetic journey/route IDs, canonical article/status IDs and explicit database-time publication
timestamps. Every allocated release ID is recorded before insertion. Release cleanup deletes only these IDs;
journey targets cascade. Auth fixture deletion and release cleanup run in finally blocks before each empty
inventory check, including failed assertions. No editorial release or real account is used.

## Exact source and execution

Used the clean detached validation checkout at `4372d4a6680b08b01615e6298dd72cf4ad3db03b`, a documentation-only
successor whose production files match `1a4ab65`. Only the new acceptance harness was temporarily copied in;
its source guard verifies production/migrations/packages/bootstrap against the supplied reviewed commit.
Pending Stage-C source was excluded. The validation harness was restored byte-for-byte and its tree ended clean.

Fresh project: `nihonest-j1-auth-critical-20261004`. External stack directory:
`C:/Users/T3/.codex/visualizations/2026/09/28/01a0e87b-a14b-7e43-a0c2-fbb02ce671f5/j1-auth-critical-stack-20261004`.
All eight migrations and config came from `git show 1a4ab65`, changing only owned local project/ports and
disabling studio/SMTP. API/DB/shadow/studio/SMTP ports: **55551/55552/55550/55553/55554**. Existing CLI 2.116.0,
images and dependencies were reused; no clean install. Only owned database/Auth/PostgREST/Kong services ran.
Credentials stayed in memory; CLI credential output was captured and never printed or written to records.

Commands (harness from validation checkout):

```text
node node_modules/supabase/dist/supabase.js start --workdir <owned-stack-dir> --exclude realtime,storage-api,imgproxy,mailpit,postgres-meta,studio,edge-runtime,logflare,vector,supavisor
node --import ./scripts/notification-worker-register.mjs --import tsx scripts/acceptance/notification-worker-auth.ts --source-ref 1a4ab65bc24161d0cd8db68c408f09a33d893735 --stack-dir <owned-stack-dir>
```

**25 scenarios passed**, including the previous 15. The final report identified production `1a4ab65`, checkout
context `4372d4a`, and empty inventories. Its harnessRef identifies that checkout context, not this new
temporarily copied harness checkpoint.

## Negative control and cleanup

- A temporary validation-only variant gave the route-mismatch fixture a matching route. The run exited 1 at
  `published-article-route-mismatch-targeting`, detecting an unexpectedly generated event. The variant was
  restored; root harness and production code were unaffected.
- After restoring the original validation harness, an independent clean-checkout preflight ran against exact
  `4372d4a`: ready-for-fixtures, **11 tables empty, zero Auth users**, also after the expected-failing control.
  Its owned local secret was supplied only through the child environment.
- `stop --workdir <owned-stack-dir> --project-id nihonest-j1-auth-critical-20261004 --no-backup` exited 0.
  Project-label-filtered container and volume inventories were empty. Other contributors' stacks were untouched.
- `npx tsc --noEmit`, targeted ESLint on the harness and `git diff --check` passed.

This covers ten selected branches, not every publication/timing/target combination or a hosted acceptance.
No full web release/build/browser, pgTAP/operator/concurrency rerun, real email/provider, scheduler or actual
HTTP-loss injection. Provisioning remains manual and separate from the scenario harness. Independent review,
scoped operations approval and hosted/scheduling/provider gates remain open. Consolidated handoff stays held
at the user's request; integration remains `1a4ab65` / `4372d4a`. No main merge or activation.
