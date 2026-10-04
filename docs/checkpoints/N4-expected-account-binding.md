# N4 / H5 expected-account binding — 2026-10-03

Implementer: Codex. Reviewer: Claude. Base: `adaf2b9` (validated H4 handoff).
Checkpoint commit is reported in the handoff. **Implementation complete; review/integration pending.**
Claude retains proxy/session changes; this checkpoint touches no proxy or Supabase configuration modules.

## Contract

The coordinator already captures an expected account for each queued request, but the provider formerly
discarded it. The provider now forwards it through
`synchronizeAccountContent(client, expectedAccountId, deviceState)` to the required RPC argument
`p_expected_user_id`. Invalid UUIDs fail locally without an RPC. Database authorization remains the
verified request identity; the supplied ID expresses intent and does not grant access.

New migration `20261003000100_bind_account_content_sync.sql` replaces the legacy three-JSON-argument
RPC with `sync_account_content(uuid, jsonb, jsonb, jsonb)`. The expected UUID has no default; the three
record arrays retain their defaults. Before payload validation or writes, null/missing `auth.uid()`,
null expected identity or a mismatch raises SQLSTATE `42501` with a generic message. The transport
returns its existing sanitized failure and accepts no canonical response when the RPC reports an error.

Invoker security is explicit, search_path remains empty, PUBLIC/anon execution is revoked and authenticated
execution is granted. Table grants and owner RLS remain intact. Existing payload validation, timestamp
comparisons, equal-time removal handling, deduplication and canonical response body are byte-identical
to the previous migration; only the signature/identity guard and function metadata change.

The old unbound signature is dropped rather than retained as a compatibility bypass. This is an intentional
breaking wire change: update migration, type definition and adapter/provider together at the reviewed gate.
An old client against the migrated database fails closed; a new client against the old database also fails.
Any future hosted deployment must plan this transition and require old clients to refresh. No deployed
database was changed here. Direct table CRUD still follows its existing RLS contract; this intent guard
applies to this sync RPC, not all writes by an authenticated user.

A request legitimately authorized for A can finish after the browser switches to B. This does not change
its database identity, so the coordinator must still discard the stale A response. Provider tests check
that the A and B requests carry their respective expected IDs, while existing stale-result/cache-ownership
and sign-out checks remain. No token is captured, stored or exported by the coordinator.

## Verification

- Focused adapter/coordinator/provider Vitest: **29 tests / three files passed**; TypeScript, targeted
  ESLint, architecture (**712 modules**) and whitespace passed.
- Existing SQL sync suite updated for the required argument: **27 assertions passed**. New binding
  suite: **13 assertions passed**, including removed legacy/omitted-identity invocation, invoker and
  execution grants, both mismatch directions, null/missing identity, unchanged complete snapshots of
  all three tables after rejection, and matching-account canonical reads.
- Real PostgreSQL **17** via the already-installed image
  `public.ecr.aws/supabase/postgres:17.6.1.165`, disposable container
  `nihonest-codex-binding-20261003`, `--rm --network none`, no published ports or host volumes.
  The image's existing auth schema/users/uid helper and roles were used, with pgTAP enabled and the
  original content-sync migration followed by the new migration. Tests ran with `psql -v ON_ERROR_STOP=1`
  and role/JWT-subject fixtures; no Auth server, real token verification, PostgREST or full migration
  chain is claimed. This is bounded SQL acceptance, not full Supabase/H5 acceptance.
- Negative control removed only the identity guard in that disposable database: **seven assertions
  failed**, including all three unchanged-row checks. Restoring the committed guard returned the binding
  suite to **13 passed**. The container was then stopped and automatically removed.
- Full Vitest `run --maxWorkers=4`: **945 tests / 176 files passed**. Public-only production build:
  **416 generation entries**, detail families remain SSG; post-build TypeScript, CMS exclusion and
  bundle boundaries (**42 scripts**) passed. The build wrapper blanked account/email/AWS settings
  and the public origin, with email disabled and telemetry off. Existing dependencies were used;
  no clean install, browser lifecycle run or GitHub Actions execution. Content/localization audits
  were not rerun because no content or translation input changed.

## Review and remaining gates

Review the exact committed checkpoint before integrating through `codex/hosting-native-integration`.
Do not depend on a branch head carrying this unreviewed checkpoint. Claude can continue independent
proxy/session work against the documented interface, but combined acceptance waits for integration.

Still required: isolated Supabase Auth/PostgREST calls proving expected-ID dispatch under actual SDK token
selection; signed-in public browsing through token expiry/refresh and account navigation; switching and
sign-out/API authorization with pending requests; combined H5/N4 and hosted acceptance. The SQL checks
do not prove those transport/session behaviors. H3b CI repair, J1 acceptance/operator and N1/N2 Stage-C
gates remain open. No main merge, hosted service, email, recurring job or translation activation.
