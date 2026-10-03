# N4 Stage-A account coordinator

Implementer: Codex. Reviewer: Claude after availability reset. Date: 2026-09-29.
Base: `7fdea85c81e5f7cfd665ae66fbac29f23ff8293f` (pending J1 command checkpoint).
Status: portable extraction and web binding implemented; review/integration pending. Hosted cross-device
and the combined H5 session gate remain open. This checkpoint has no dependency on new J1 implementation
code, but its working-branch parent includes the four unreviewed J1 checkpoints; do not merge the branch head.

## Contract and behavior

- `src/lib/sync/account-content-coordinator.ts` receives synchronous device state/snapshot/owner read and
  write functions, an asynchronous `synchronize(expectedAccountId, state)` transport, and a status publisher.
  It imports only portable domain rules and the new shared sync contract. No React, browser globals, Next,
  Node or Supabase SDK is required to import or test it. The existing architecture guard covers this subtree.
- `setAccount` reports whether identity changed. `synchronize` queues one serial drain, coalescing requests
  while a transport is in flight. `deviceChanged` requests a pass except during canonical writes. Failed
  work pauses until a later device event or explicit retry; it does not create an automatic retry loop.
  `dispose` invalidates pending results and further requests without deleting local data.
- The coordinator uploads an empty snapshot when the device cache belongs to another account. The web
  storage adapter still applies canonical records only for families whose serialized snapshot did not change
  during the request, then records the owner. Existing keys, migrations, merge rules and RPC payloads remain.
- Account revisions invalidate results across account switches, sign-out and A -> B -> A transitions.
  Obsolete successes and failures cannot write the current cache or status. Rejected transports produce a
  generic error and release the queue for retry; canonical-write notifications cannot trigger recursive sync.
- The React provider owns browser storage subscriptions, auth notifications, deferred SDK work and cleanup.
  A revision guard prevents a delayed initial `getUser()` response from overwriting a newer auth event.
  Same-account token refresh does not trigger another content sync. Cleanup disposes that effect's coordinator
  and unsubscribes; pending transport results cannot write storage after unmount.
- `AccountContentSyncResult` moves into a portable contract module and is re-exported from its original
  adapter, preserving that import interface. The existing Supabase adapter and its wire contract remain.

## H5 account/session handoff

- Codex retains ownership of `account-content-sync-provider.tsx`, its tests and the sync subtree. Claude
  requests account/session binding changes or an explicit file handoff before editing these areas for H5.
- Auth notifications supply account identity for cache lifecycle, not authorization. Initial web identity
  comes from `getUser`; the server RPC still authorizes the SDK's authenticated request. The coordinator
  holds no token, redirect, cookie or secret and needs no browser/native session storage implementation.
- Transport adapters must bind requests to the expected account identity. This extraction preserves the
  web SDK's current-session RPC behavior; it does not add a per-request token binding or establish that a
  session change between SDK token selection and the RPC is safe. H5 must coordinate that behavior and
  refresh/session ownership rather than treating coordinator revision checks as server authorization.
- The combined H5/N4 gate must cover signed-in public browsing, expiry/refresh, subsequent account navigation,
  account switching during requests, sign-out and pending results, cleanup/re-subscription, and cross-device
  sync. Native redirects and secure auth storage remain platform bindings; content/preferences storage must
  not receive native auth secrets. No asynchronous native storage API is added without a selected adapter.

## Verification

- Focused coordinator/provider/RPC-adapter tests: **20 tests / three files passed**, including 11 coordinator
  tests in Node without React/browser/live Supabase and four new provider race tests. Existing provider
  cache-merge, foreign-owner and in-flight account-change fixtures still pass.
- Full `npx vitest run --maxWorkers=4`: **675 tests / 159 files passed**. `npx tsc --noEmit`, targeted ESLint,
  architecture (**696 production modules**) and `git diff --check` passed.
- Public-only production build: **415 pages**, detail routes remain SSG. CMS exclusion passed. `bundle:check`
  passed on **42 browser scripts**: no guidance prose/source registry, and no map geometry in entry chunks.
  No new artifact-injection probe was run; its earlier combined-integration result remains separately recorded.
- Windows / Node 24.21.0 / Next 16.3.4 with existing dependencies, not a clean installation. The build wrapper
  blanks hosted/account/email/AWS settings, supplies a fixture HTTPS origin and disables telemetry. Full
  Vitest finished before the build. Auth/sync tests were fixtures; no hosted account or provider was used.
  Browser UI, hosted cross-device, SQL, editorial and localization checks were not rerun.

## Remaining review

Review this exact checkpoint against `7fdea85`. Integration remains `e4fc1ff`; the four J1 checkpoints and
consolidated documentation since `b494ed0` also await Claude. Top-level refactor status is corrected to
distinguish the working-branch command from the older reviewed integration. No H5/proxy/config/Supabase
module, translation, renderer, main branch, hosted service or recurring job is changed or activated.
